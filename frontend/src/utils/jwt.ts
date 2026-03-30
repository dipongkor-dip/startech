"use server";

import jwt from "jsonwebtoken";

export const verifyToken = async (token: string) => {
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    return {success: true, message: "Token is valid", payload: verifiedToken};
    //----
  } catch (error: any) {
    return {success: false, message: error?.message || "Invalid token"};
  }
};