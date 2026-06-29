import bcrypt from "bcryptjs";
import {Status, UserRole} from "@prisma/client";
import ServerError from "../../handler/ServerError";
import status from "http-status";
import {addEmployeeDTO, changePasswordDTO, loginDTO, registerDTO, sendOtpDTO, verifyOtpDTO} from "./auth.validation";
import {prisma} from "../../config/database";
import {signAccessToken, signRefreshToken} from "../../helper/jwt";

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

  const profile = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {email: payload.email, phone: payload.phone, password: hashedPassword},
    });

    await tx.customer.create({data: {userId: user.id, name: userName}});

    return user;
  });

  const accessToken = signAccessToken(profile.id, profile.role);
  const refreshToken = signRefreshToken(profile.id, profile.role);
  return {accessToken, refreshToken};
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
    user = await prisma.user.findUnique({where: {email}, select: {password: true, id: true, role: true}});
  } else if (phone) {
    user = await prisma.user.findUnique({where: {phone}, select: {password: true, id: true, role: true}});
  } else {
    throw new ServerError(status.FORBIDDEN, "Invalid credentials");
  }

  console.log(user);

  if (!user || !user.password) throw new ServerError(status.NOT_FOUND, !user ? "None of your accounts were found." : "User does not have a password set");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new ServerError(status.UNAUTHORIZED, "Invalid credentials");

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  return {accessToken, refreshToken};
};

// GET /auth/me
const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {id: true, email: true, phone: true, role: true, status: true, isValidated: true, needPasswordReset: true},
  });

  if (!user) throw new ServerError(status.FORBIDDEN, "User not found");

  let profile;

  if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
    profile = await prisma.admin.findUnique({
      where: {userId},
      select: {name: true, avatar: true, division: true, city: true, upazila: true, address: true, isActive: true, createdAt: true},
    });
  } else if (user.role === UserRole.CUSTOMER) {
    profile = await prisma.customer.findUnique({
      where: {userId},
      select: {name: true, avatar: true, division: true, city: true, upazila: true, address: true, isActive: true, createdAt: true},
    });
  } else if (user.role === UserRole.CUSTOMER_SUPPORT_MANAGER) {
    profile = await prisma.customerSupportManager.findUnique({
      where: {userId},
      select: {name: true, avatar: true, division: true, city: true, upazila: true, address: true, isActive: true, createdAt: true},
    });
  } else if (user.role === UserRole.DELIVERY_BOY) {
    profile = await prisma.deliveryBoy.findUnique({
      where: {userId},
      select: {name: true, avatar: true, division: true, city: true, upazila: true, address: true, isActive: true, createdAt: true},
    });
  }

  return {profile, ...user};
};

const changePassword = async (userId: string, payload: changePasswordDTO) => {
  const {currentPassword, newPassword} = payload;
  const user = await prisma.user.findUniqueOrThrow({where: {id: userId}});

  if (!user.password) throw new ServerError(status.NOT_FOUND, "User does not have a password set");

  // Verify current password
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new ServerError(status.UNAUTHORIZED, "Password is incorrect");

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Update password and reset needPasswordReset flag
  await prisma.user.update({
    where: {id: userId},
    data: {password: hashedNewPassword, needPasswordReset: false},
  });
};

const addEmployee = async (payload: addEmployeeDTO, userRole: string) => {
  const {name, email, phone, password, role} = payload;

  const user = await prisma.user.findFirst({
    where: {
      AND: [{OR: [email ? {email} : {}, phone ? {phone} : {}]}, {OR: [{status: Status.ACTIVE}, {status: Status.INACTIVE}]}],
    },
    select: {
      id: true,
      role: true,
      isValidated: true,
      needPasswordReset: true,
      email: true,
      phone: true,
    },
  });

  if (user) {
    throw new ServerError(status.BAD_REQUEST, "User with this email or phone already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  return await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {email, phone, password: hashedPassword, role, needPasswordReset: true},
    });

    if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
      if (userRole !== UserRole.SUPER_ADMIN) {
        throw new ServerError(status.FORBIDDEN, "Only super admins can create admin users");
      }
      await tx.admin.create({data: {userId: createdUser.id, name: name || "Admin"}});
    } else if (role === UserRole.CUSTOMER_SUPPORT_MANAGER) {
      await tx.customerSupportManager.create({data: {userId: createdUser.id, name: name || "Customer Support Manager"}});
    } else if (role === UserRole.DELIVERY_BOY) {
      await tx.deliveryBoy.create({data: {userId: createdUser.id, name: name || "Delivery Boy"}});
    } else if (role === UserRole.PRODUCT_MANAGER) {
      await tx.productManager.create({data: {userId: createdUser.id, name: name || "Product Manager"}});
    }

    return createdUser;
  });
};

const socialAuthCheck = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({where: {id: userId}, select: {id: true, role: true}});

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  return {accessToken, refreshToken};
};

export const authService = {register, verifyOtp, sendOtpUserCheck, login, getMe, changePassword, addEmployee, socialAuthCheck};
