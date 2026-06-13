import {NextFunction, Request, Response} from "express";
import http_status from "http-status";
import ServerError from "./ServerError";
import {env} from "../env";

export const globalError = async (err: any, req: Request, res: Response, next: NextFunction) => {
  let status: number = http_status.BAD_REQUEST;
  let message: string = "Something went wrong!";
  let error: any = err;

  // ✅ Handle custom ServerError
  if (err instanceof ServerError) {
    status = err.status;
    message = err.message;
    error = env.nodeEnv === "development" ? err.stack : undefined;
  }

  if (err.code === "P2002") {
    status = err.status;
    message = err.message;
    error = env.nodeEnv === "development" ? err.stack : undefined;
  }

  res.status(status).json({
    success: false,
    message,
    error: env.nodeEnv === "development" ? error : undefined,
  });
};
