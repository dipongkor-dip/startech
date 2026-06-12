import {NextFunction, Request, Response} from "express";
import http_status from "http-status-codes";
import ServerError from "./ServerError";
import env from "../env";

export const globalError = async (err: any, req: Request, res: Response, next: NextFunction) => {
  let status: number = http_status.BAD_REQUEST;
  let message: string = err.message || "Something went wrong!";
  let error: any = err;

  // ✅ Handle custom ServerError
  if (err instanceof ServerError) {
    status = err.status;
    message = err.message;
    error = env.nodeEnv === "development" ? err.stack : undefined;
  }

  // ✅ Handle Mongo duplicate key error
  if (err.code === 11000) {
    status = http_status.CONFLICT; // 409
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field "${field}": ${err.keyValue[field]}`;
    error = env.nodeEnv === "development" ? err.stack : undefined;
  }

  console.log("global err", error);

  res.status(status).json({
    success: false,
    message,
    error: env.nodeEnv === "development" ? error : undefined,
  });
};
