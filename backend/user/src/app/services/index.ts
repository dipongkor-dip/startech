import bcrypt from "bcryptjs";
import {prisma} from "../config/database";
import {signAccessToken, signRefreshToken} from "../helper/jwt";
import {UserRole} from "@prisma/client";

// POST /auth/register - email or phone + password
const register = async (email: string | null, phone: string | null, password: string, name: string) => {
  if ((email && !phone) || (!email && phone) || !password) {
    throw new Error("Email or phone and password are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [...(email ? [{email}] : []), ...(phone ? [{phone}] : [])],
    },
  });

  if (existingUser?.phone || existingUser?.email) {
    throw new Error(`User with this ${existingUser.email ? "email" : "phone"} already exists`);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const userId = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {email, phone, password: hashedPassword},
    });

    await tx.customer.create({data: {userId: user.id, name}});

    return user.id;
  });

  return userId;
};

const sendOtpUserCheck = async (email: string | null, phone: string | null) => {
  if (!email && !phone) {
    throw new Error("Email or phone is required");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [...(email ? [{email}] : []), ...(phone ? [{phone}] : [])],
    },
  });

  if (!user) throw new Error("User not found");
};

const verifyOtp = async (email: string | null, phone: string | null) => {
  if ((email && !phone) || (!email && phone)) {
    throw new Error("Email or phone and OTP are required");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [...(email ? [{email}] : []), ...(phone ? [{phone}] : [])],
    },
  });

  if (!user) throw new Error("User not found");
  await prisma.user.update({
    where: {id: user.id},
    data: {isValidated: true},
  });

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  return {accessToken, refreshToken};
};

// POST /auth/login - email or phone + password (body: { login: "email@x.com"|"phone", password })
const login = async (email: string | null, phone: string | null, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [...(email ? [{email}] : []), ...(phone ? [{phone}] : [])],
    },
  });

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }
  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  return {accessToken, refreshToken};
};

// GET /auth/me
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({where: {id: userId}});

  if (!user) {
    throw new Error("User not found");
  }

  let profile;

  if (user.role === UserRole.admin) {
    profile = await prisma.admin.findUnique({where: {userId}});
  } else if (user.role === UserRole.customer) {
    profile = await prisma.customer.findUnique({where: {userId}});
  } else if (user.role === UserRole.superAdmin) {
    profile = await prisma.superAdmin.findUnique({where: {userId}});
  } else if (user.role === UserRole.customerSupportManager) {
    profile = await prisma.customerSupportManager.findUnique({where: {userId}});
  } else if (user.role === UserRole.deliveryBoy) {
    profile = await prisma.deliveryBoy.findUnique({where: {userId}});
  }

  return {profile, role: user.role};
};

export const userService = {register, verifyOtp, sendOtpUserCheck, login, getMe};
