import {NextFunction, Request, Response} from "express";
import {sendResponse} from "../../utils/sendResponse";
import {phoneService} from "./phone.service";
import {StatusCodes} from "http-status-codes";
import {JwtPayload} from "jsonwebtoken";
import {AuthenticatedRequest} from "../../middleware/product-permission";
import {catchAsync} from "../../utils/catchAsync";
import {uploadFilesToCloudinary} from "../../config/cloudinary";
import multer from "multer";

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

export const createPhone = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const {product, phone: phoneData, description} = req.body;

  // 🎯 মাল্টার ফিল্ডস টাইপ কাস্টিং
  // 🎯 মাল্টার ফিল্ডস টাইপ কাস্টিং
  const files = req.files as {[fieldname: string]: Express.Multer.File[]} | undefined;

  try {
    let phoneUploadedImages: {url: string; publicId: string}[] = [];
    let descUploadedImages: {url: string; publicId: string}[] = [];

    if (files && files["phoneImages"] && files["phoneImages"].length > 0) {
      phoneUploadedImages = await uploadFilesToCloudinary(files["phoneImages"], "phone-main");
    }

    if (files && files["descImages"] && files["descImages"].length > 0) {
      descUploadedImages = await uploadFilesToCloudinary(files["descImages"], "phone-desc");
    }

    // 🎯 ৩. দুটি আলাদা ইমেজের অ্যারে সার্ভিসে পাঠানো হলো
    const result = await phoneService.createPhone(product, phoneData, description, phoneUploadedImages, descUploadedImages);

    return sendResponse(res, {
      status: StatusCodes.CREATED,
      success: true,
      message: "Phone created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const updatePhone = async (req: AuthenticatedRequest, res: Response) => {
  const {userId} = req.token as JwtPayload;
  const phone = await phoneService.updatePhone(req.params.id, req.body, userId);
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

const getProductManagerPhones = async (req: AuthenticatedRequest, res: Response) => {
  const {userId} = req.token as JwtPayload;
  const {categoryId} = req.params;
  const phones = await phoneService.getProductManagerPhones(userId, categoryId);
  return sendResponse(res, {
    status: StatusCodes.OK,
    success: true,
    message: "Phones fetched successfully",
    data: phones,
  });
};

export const phoneController = {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
  getProductManagerPhones,
};
