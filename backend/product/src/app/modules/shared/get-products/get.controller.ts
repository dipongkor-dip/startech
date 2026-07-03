import {NextFunction, Request, Response} from "express";
import {catchAsync} from "../../../utils/catchAsync";
import {sendResponse} from "../../../utils/sendResponse";
import status from "http-status";
import {getProductService, getProductsService} from "./get.service";

export const getProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getProductsService(req.query);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Categories retrieved successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

export const getProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {productModel} = req.params;
  try {
    const products = await getProductService(productModel);

    sendResponse(res, {
      status: status.OK,
      success: true,
      message: "Categories retrieved successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
});
