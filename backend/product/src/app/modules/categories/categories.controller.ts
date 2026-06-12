import {Request, Response, NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import {sendResponse} from "../../utils/sendResponse";
import {categoryService} from "./categories.service";
import {CategoryInt} from "./categories.interface";
import {catchAsync} from "../../utils/catchAsync";
import {updateCategorySchema} from "./categories.model";
import mongoose from "mongoose";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategory(req.body as Partial<CategoryInt>);
    return sendResponse(res, {
      status: StatusCodes.CREATED,
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    return sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const category = await categoryService.updateCategory(new mongoose.Types.ObjectId(id), req.body as typeof updateCategorySchema);
    return sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

const updateStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const data = await categoryService.updateStatus(id);
    return sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Category status updated successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

const updateSequence = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.updateSequence(req.body);
    return sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Category sequence updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    await categoryService.deleteCategory(id);
    return sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Category deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

const getCategoryById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params;
    const category = await categoryService.getCategoryById(id);
    return sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  updateStatus,
  updateSequence,
  deleteCategory,
  getCategoryById,
};
