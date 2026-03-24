import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { signAccessToken, signRefreshToken, verifyToken } from '../../utils/jwt';
import { env } from '../env';
import { generateOtp, sendOtp } from '../../utils/otp';

const router = Router();

function sanitizeUser(user: Record<string, unknown>) {
  const { password, ...rest } = user;
  return rest;
}

const OTP_EXPIRES_MS = 10 * 60 * 1000;
const ALLOWED_ROLES = new Set<UserRole>([
  UserRole.superadmin,
  UserRole.admin,
  UserRole.productManager,
  UserRole.deliveryBoy,
  UserRole.customerSupportManager,
  UserRole.customer,
]);

// POST /auth/register - email or phone + password
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, phone, password, profile, role } = req.body;
    if (!password || (!email && !phone)) {
      return res.status(400).json({ error: 'Email or phone and password required' });
    }
    const existing = await prisma.user.findFirst({
      where: {
        OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
      },
    });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hash = await bcrypt.hash(password, 10);

    const sanitizedProfile =
      profile && typeof profile === 'object'
        ? {
            name: profile.name ?? undefined,
            avatar: profile.avatar ?? undefined,
            address: profile.address ?? undefined,
          }
        : undefined;

    // `role` moved from Profile -> User. Keep backward compatibility:
    // if caller still sends `profile.role`, use it but do not persist it in Profile.
    const requestedRole = role ?? (profile && typeof profile === 'object' ? (profile as any).role : undefined);
    const finalRole = ALLOWED_ROLES.has(requestedRole) ? requestedRole : UserRole.customer;
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_MS);

    // Create user as unvalidated and wait for OTP verification.
    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        password: hash,
        provider: 'local',
        isValidated: false,
        role: finalRole,
        otpCode: otp,
        otpExpiresAt,
        otpAttempts: 0,
        profile: sanitizedProfile ? { create: sanitizedProfile } : undefined,
      },
      include: { profile: true },
    });

    if (email) {
      await sendOtp({ destinationType: 'email', destination: email, otp });
    }
    if (phone) {
      await sendOtp({ destinationType: 'phone', destination: phone, otp });
    }

    res.status(201).json({
      requiresOtpVerification: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, phone, otp } = req.body;
    if ((!email && !phone) || !otp) {
      return res.status(400).json({ error: 'Email or phone and OTP are required' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
      },
      include: { profile: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isValidated) {
      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);
      return res.json({ accessToken, refreshToken, user: sanitizeUser(user) });
    }
    if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
    }
    if (user.otpAttempts >= 5) {
      return res.status(429).json({ error: 'Too many incorrect attempts. Please resend OTP.' });
    }
    if (user.otpCode !== String(otp).trim()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { otpAttempts: user.otpAttempts + 1 },
      });
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const validatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isValidated: true,
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
      include: { profile: true },
    });

    const accessToken = signAccessToken(validatedUser.id);
    const refreshToken = signRefreshToken(validatedUser.id);
    return res.json({ accessToken, refreshToken, user: sanitizeUser(validatedUser) });
  } catch {
    return res.status(400).json({ error: 'OTP verification failed' });
  }
});

router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isValidated) return res.status(400).json({ error: 'User already verified' });

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_MS);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiresAt,
        otpAttempts: 0,
      },
    });

    if (user.email) {
      await sendOtp({ destinationType: 'email', destination: user.email, otp });
    } else if (user.phone) {
      await sendOtp({ destinationType: 'phone', destination: user.phone, otp });
    }

    return res.json({ success: true, message: 'OTP resent successfully' });
  } catch {
    return res.status(400).json({ error: 'Failed to resend OTP' });
  }
});

// POST /auth/login - email or phone + password (body: { login: "email@x.com"|"phone", password })
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: 'Login and password required' });
    }
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { phone: login }],
      },
      include: { profile: true },
    });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isValidated) {
      return res.status(403).json({ error: 'Please verify your OTP first' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    res.json({ accessToken, refreshToken, user: sanitizeUser(user) });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// GET /auth/me
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: { profile: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'user-service',
    timestamp: new Date().toISOString(),
  });
});

export default router;
