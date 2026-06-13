import bcrypt from "bcryptjs";
import {prisma} from "../config/database";
import {signAccessToken, signRefreshToken} from "../helper/jwt";
import {UserRole} from "@prisma/client";
import ServerError from "../handler/ServerError";
import status from "http-status";
import {email} from "zod/v4/classic/external.cjs";
import {changePasswordDTO, loginDTO, registerDTO, sendOtpDTO, verifyOtpDTO} from "./auth.validation";

// POST /auth/register - email or phone + password
const register = async (payload: registerDTO) => {
  const userName = payload.name || payload.email?.match(/^([a-zA-Z]+)(?=[0-9]*@)/)?.[1] || "User";

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [...(payload.email ? [{email: payload.email}] : []), ...(payload.phone ? [{phone: payload.phone}] : [])],
    },
  });

  if (existingUser) {
    throw new ServerError(status.BAD_REQUEST, `User with this ${existingUser.email ? "email" : "phone"} already exists`);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {email: payload.email, phone: payload.phone, password: hashedPassword},
    });

    await tx.customer.create({data: {userId: user.id, name: userName}});
  });
};

const sendOtpUserCheck = async (payload: sendOtpDTO) => {
  const {email, phone} = payload;

  if (email) {
    await prisma.user.findUniqueOrThrow({where: {email}});
  } else if (phone) {
    await prisma.user.findUniqueOrThrow({where: {phone}});
  } else {
    throw new ServerError(status.BAD_REQUEST, "Email or phone is required");
  }
};

const verifyOtp = async (payload: verifyOtpDTO) => {
  const {email, phone, otp} = payload;
  let user;

  if (email) user = await prisma.user.findUniqueOrThrow({where: {email}});
  else if (phone) user = await prisma.user.findUniqueOrThrow({where: {phone}});
  else throw new ServerError(status.BAD_REQUEST, "Email or phone is required");

  await prisma.user.update({where: {id: user.id}, data: {isValidated: true}});

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  return {accessToken, refreshToken, isValidated: user.isValidated};
};

// POST /auth/login - email or phone + password (body: { login: "email@x.com"|"phone", password })
const login = async (payload: loginDTO) => {
  const {email, phone, password} = payload;

  let user;

  if (email) {
    user = await prisma.user.findUnique({where: {email}});
  } else if (phone) {
    user = await prisma.user.findUnique({where: {phone}});
  }

  if (!user || !user.password) {
    throw new ServerError(status.NOT_FOUND, "Invalid credentials");
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

const changePassword = async (userId: string, payload: changePasswordDTO) => {
  const {currentPassword, newPassword} = payload;
  const user = await prisma.user.findUnique({where: {id: userId}});

  if (!user || !user.password) {
    throw new ServerError(status.NOT_FOUND, !user ? "User not found" : "User does not have a password set");
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new ServerError(status.UNAUTHORIZED, "Password is incorrect");
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

export const authService = {register, verifyOtp, sendOtpUserCheck, login, getMe, changePassword};
