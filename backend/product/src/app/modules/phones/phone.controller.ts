import {NextFunction, Request, Response} from "express";
import {sendResponse} from "../../utils/sendResponse";
import {phoneService} from "./phone.service";
import {StatusCodes} from "http-status-codes";
import {JwtPayload} from "jsonwebtoken";
import {AuthenticatedRequest} from "../../middleware/product-permission";
import {catchAsync} from "../../utils/catchAsync";

const getPhones = async (req: Request, res: Response) => {
  const phones = await phoneService.getPhones();
  return sendResponse(res, {
    status: StatusCodes.OK,
    success: true,
    message: "Phones fetched successfully",
    data: phones,
  });
};

const getPhoneById = async (req: Request, res: Response) => {
  const phone = await phoneService.getPhoneById(req.params.id);
  if (!phone) {
    return sendResponse(res, {
      status: StatusCodes.NOT_FOUND,
      success: false,
      message: "Phone not found",
      data: null,
    });
  }
  return sendResponse(res, {
    status: StatusCodes.OK,
    success: true,
    message: "Phone fetched successfully",
    data: phone,
  });
};

const createPhone = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const phone = await phoneService.createPhone(req.body);
    return sendResponse(res, {
      status: StatusCodes.CREATED,
      success: true,
      message: "Phone created successfully",
      data: phone,
    });
  } catch (error) {
    next(error);
  }
});

const updatePhone = async (req: Request, res: Response) => {
  const phone = await phoneService.updatePhone(req.params.id, req.body);
  if (!phone) {
    return sendResponse(res, {
      status: StatusCodes.NOT_FOUND,
      success: false,
      message: "Phone not found",
      data: null,
    });
  }
  return sendResponse(res, {
    status: StatusCodes.OK,
    success: true,
    message: "Phone updated successfully",
    data: phone,
  });
};

const deletePhone = async (req: Request, res: Response) => {
  const phone = await phoneService.deletePhone(req.params.id);
  if (!phone) {
    return sendResponse(res, {
      status: StatusCodes.NOT_FOUND,
      success: false,
      message: "Phone not found",
      data: null,
    });
  }
  return sendResponse(res, {
    status: StatusCodes.OK,
    success: true,
    message: "Phone deleted successfully",
    data: phone,
  });
};

export const phoneController = {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
};
