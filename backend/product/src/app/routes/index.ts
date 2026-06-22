import {Router, Request, Response} from "express";
import {PhoneRoute} from "../modules/phones/phone.route";
import {ReviewRoute} from "../modules/shared/reviews/review.route";
import {QueryRoute} from "../modules/shared/query/query.route";
import {CategoryRoute} from "../modules/shared/categories/categories.route";
import {getProduct, getProducts} from "../modules/shared/get-products/get.controller";

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
routes.use("/phones/:phoneId/reviews", ReviewRoute);
routes.use("/phones/:phoneId/queries", QueryRoute);
routes.use("/phones", PhoneRoute);
routes.use("/categories", CategoryRoute);
routes.use("/products", getProducts);
routes.use("/product/:categorySlug/:productModel", getProduct);
