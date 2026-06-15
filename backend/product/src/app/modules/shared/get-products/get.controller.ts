import {NextFunction, Request, Response} from "express";
import {catchAsync} from "../../../utils/catchAsync";
import {sendResponse} from "../../../utils/sendResponse";
import status from "http-status";
import {getProductsService} from "./get.service";

export const getProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getProductsService(req.query);
    return sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Categories retrieved successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
});
