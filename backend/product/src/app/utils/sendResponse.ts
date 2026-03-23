import { Response } from "express";

interface TMeta {
  page?: number;
  limit?: number;
  totalPage?: number;
  total: number;
}

interface TResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.status).json({ success: data.success, status: data.status, message: data.message, data: data.data, meta: data.meta });
};