import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { signAccessToken, signRefreshToken, verifyToken } from '../../utils/jwt';
import { env } from '../env';
import { generateOtp, sendOtp } from '../../utils/otp';

const router = Router();

function sanitizeUser(user: Record<string, unknown>) {
  const { password, ...rest } = user;
  return rest;
}

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
    const finalRole =
      role ?? (profile && typeof profile === 'object' ? (profile as any).role : undefined) ?? 'user';

    // Create user as unvalidated, send OTP, then validate.
    const user = await prisma.user.create({
      data: {
        email: email || null,
        phone: phone || null,
        password: hash,
        provider: 'local',
        isValidated: false,
        role: finalRole,
        profile: sanitizedProfile ? { create: sanitizedProfile } : undefined,
      },
      include: { profile: true },
    });

    const otp = generateOtp();
    if (email) {
      await sendOtp({ destinationType: 'email', destination: email, otp });
    }
    if (phone) {
      await sendOtp({ destinationType: 'phone', destination: phone, otp });
    }

    const validatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isValidated: true },
      include: { profile: true },
    });

    const accessToken = signAccessToken(validatedUser.id);
    const refreshToken = signRefreshToken(validatedUser.id);
    res.status(201).json({
      accessToken,
      refreshToken,
      user: sanitizeUser(validatedUser),
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
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
