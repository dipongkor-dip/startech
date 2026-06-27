"use server";

import jwt from "jsonwebtoken";
import {cookies} from "next/headers";

export const verifyToken = async (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
};

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value || null;
};

export const deleteCookie = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};
