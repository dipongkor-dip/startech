import {JwtPayload} from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import {IProductPermission} from "./product-permission.interface";
import {productPermissionService} from "./product-permission.service";
import status from "http-status";
import {NextFunction, Request, Response} from "express";
import {AuthenticatedRequest} from "../middleware/authentication";

const createPermission = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const {userId} = req.token as JwtPayload;
  try {
    const permission = await productPermissionService.createPermission(req.body as IProductPermission, userId as string);
    res.status(status.CREATED).json({success: true, message: "Permission created successfully", data: permission});
  } catch (error) {
    next(error);
  }
});

const getPermissions = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // Logic to retrieve all permissions from the database
});

const updatePermission = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // Logic to update an existing permission in the database
});

const deletePermission = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // Logic to delete a permission from the database
});

export const productPermissionController = {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission,
};
