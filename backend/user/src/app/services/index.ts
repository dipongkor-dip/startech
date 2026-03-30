import bcrypt from "bcryptjs";
import {prisma} from "../config/database";
import {signAccessToken, signRefreshToken} from "../helper/jwt";
import {UserRole} from "@prisma/client";
import ServerError from "../errors/ServerError";
import status from "http-status";

// POST /auth/register - email or phone + password
const register = async (email: string | null, phone: string | null, password: string, name: string) => {
  if ((!email && !phone) || !password) {
    throw new ServerError(status.BAD_REQUEST, "Email or phone and password are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [...(email ? [{email}] : []), ...(phone ? [{phone}] : [])],
    },
  });

  if (existingUser) {
    throw new ServerError(status.BAD_REQUEST, `User with this ${existingUser.email ? "email" : "phone"} already exists`);
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
  if (email) {
    await prisma.user.findUniqueOrThrow({where: {email}});
  } else if (phone) {
    await prisma.user.findUniqueOrThrow({where: {phone}});
  } else {
    throw new ServerError(status.BAD_REQUEST, "Email or phone is required");
  }
};

const verifyOtp = async (email: string | null, phone: string | null) => {
  let user;

  if (email) {
    user = await prisma.user.findUniqueOrThrow({where: {email}});
  } else if (phone) {
    user = await prisma.user.findUniqueOrThrow({where: {phone}});
  } else {
    throw new ServerError(status.BAD_REQUEST, "Email or phone is required");
  }

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
    throw new ServerError(status.NON_AUTHORITATIVE_INFORMATION, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ServerError(status.UNAUTHORIZED, "Invalid credentials");
  }
  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  return {accessToken, refreshToken, isValidated: user.isValidated, needPasswordReset: user.needPasswordReset};
};

// GET /auth/me
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({where: {id: userId, isValidated: true, needPasswordReset: false}});

  if (!user) {
    throw new ServerError(status.FORBIDDEN, "User not found");
  }

  let profile;

  if (user.role === UserRole.ADMIN) {
    profile = await prisma.admin.findUnique({where: {userId}});
  } else if (user.role === UserRole.CUSTOMER) {
    profile = await prisma.customer.findUnique({where: {userId}});
  } else if (user.role === UserRole.SUPER_ADMIN) {
    profile = await prisma.superAdmin.findUnique({where: {userId}});
  } else if (user.role === UserRole.CUSTOMER_SUPPORT_MANAGER) {
    profile = await prisma.customerSupportManager.findUnique({where: {userId}});
  } else if (user.role === UserRole.DELIVERY_BOY) {
    profile = await prisma.deliveryBoy.findUnique({where: {userId}});
  }

  return {profile, role: user.role};
};

const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({where: {id: userId}});

  if (!user || !user.password) {
    throw new ServerError(status.NOT_FOUND, "User not found");
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new ServerError(status.UNAUTHORIZED, "Current password is incorrect");
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Update password and reset needPasswordReset flag
  await prisma.user.update({
    where: {id: userId},
    data: {
      password: hashedNewPassword,
      needPasswordReset: false,
    },
  });
};

export const userService = {register, verifyOtp, sendOtpUserCheck, login, getMe, changePassword};
