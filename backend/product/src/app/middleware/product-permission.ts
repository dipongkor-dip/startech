import {Request, Response, NextFunction} from "express";
import {verifyToken} from "../helper/jwt";
import {JwtPayload} from "jsonwebtoken";
import status from "http-status";
import {sendRpcMessage} from "../config/rabbitmq";
import ServerError from "../handler/ServerError";
import {category} from "../modules/shared/categories/categories.model";

export interface AuthenticatedRequest extends Request {
  token?: JwtPayload;
}

export const authorization = () => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.split(" ")[1] || req.cookies.accessToken;

    if (!accessToken) throw new ServerError(status.BAD_REQUEST, "Token Not Found");

    try {
      const token = verifyToken(accessToken) as JwtPayload;
      if (token.role !== "PRODUCT_MANAGER") throw new ServerError(status.UNAUTHORIZED, "Unauthorized User");

      req.token = token as JwtPayload;

      next();
    } catch (error: any) {
      console.error("❌ productPermission middleware error:", error);

      // যদি custom ServerError হয়
      if (error instanceof ServerError) {
        return res.status(error.status).json({success: false, error: error.message});
      }

      // অন্য কোনো error হলে generic response দিন
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message || "Unexpected error occurred",
      });
    }
  };
};

export const productPermission = () => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.split(" ")[1] || req.cookies.accessToken;

    if (!accessToken) throw new ServerError(status.BAD_REQUEST, "Token Not Found");

    try {
      const token = verifyToken(accessToken) as JwtPayload;
      if (token.role !== "PRODUCT_MANAGER") throw new ServerError(status.UNAUTHORIZED, "Unauthorized User");

      const {permissionId} = req.params;
      const {categoryId} = req.body;

      if (!permissionId || !categoryId) throw new ServerError(status.PRECONDITION_REQUIRED, !permissionId ? "Required PermissionId" : "Required CategoryId");

      const cat = await category.findById(categoryId);
      if (!cat) throw new ServerError(status.UNAUTHORIZED, "Category ID Must be child Id");
      const catPar = await category.find({parentId: cat.id});
      if (catPar.length > 0) throw new ServerError(status.UNAUTHORIZED, "Category ID Must be child Id");

      // // rabbitmq call product permission check
      const response = await sendRpcMessage<{success: boolean; permissionId: string; error?: string}>("product_permission", "product_per_response", {
        permissionId,
        userId: token.userId as string,
      });

      // if (!response.success) return res.status(status.UNAUTHORIZED).json({error: response.error || "Unauthorized User"});
      if (!response.success) throw new ServerError(status.UNAUTHORIZED, response.error || "Unauthorized User");

      req.token = token as JwtPayload;
      req.body.permissionId = response.permissionId;

      next();
    } catch (error: any) {
      console.error("❌ productPermission middleware error:", error);

      // যদি custom ServerError হয়
      if (error instanceof ServerError) {
        return res.status(error.status).json({success: false, error: error.message});
      }

      // অন্য কোনো error হলে generic response দিন
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message || "Unexpected error occurred",
      });
    }
  };
};
