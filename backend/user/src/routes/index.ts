import {Router, Request, Response} from "express";
import { authRouter } from "../app/auth/auth.routes";
import { productPermissionRoutes } from "../app/product-permission/product-permission.routes";

export const routes = Router();

// Health check
routes.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    service: "product-service",
    timestamp: new Date().toISOString(),
  });
});

// More specific routes first
routes.use("/auth", authRouter);
routes.use("/product-permissions", productPermissionRoutes);