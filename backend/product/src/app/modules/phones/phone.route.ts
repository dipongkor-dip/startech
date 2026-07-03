import {NextFunction, Request, Response, Router} from "express";
import {catchAsync} from "../../utils/catchAsync";
import {phoneController} from "./phone.controller";
import {authorization, productPermission} from "../../middleware/product-permission";
import {validate} from "../../middleware/validateSchema";
import {phoneValidationSchema} from "./phone.validation";
import {upload} from "../../config/cloudinary";

const route = Router();

route.get("/", catchAsync(phoneController.getPhones));
route.get("/:id", catchAsync(phoneController.getPhoneById));
route.get("/phone/:categoryId", authorization(), catchAsync(phoneController.getProductManagerPhones));
route.post(
  "/:permissionId",
  upload.fields([
    {name: "phoneImages", maxCount: 5}, // 🎯 ফোনের জন্য ইমেজ ফিল্ড
    {name: "descImages", maxCount: 10}, // 🎯 ডেসক্রিপশনের জন্য ইমেজ ফিল্ড
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.product) req.body.product = JSON.parse(req.body.product);

    if (req.body.phone) req.body.phone = JSON.parse(req.body.phone);

    if (req.body.description) req.body.description = JSON.parse(req.body.description);

    next();
  },
  validate(phoneValidationSchema),
  productPermission(),
  phoneController.createPhone,
);
route.patch("/:id", authorization(), catchAsync(phoneController.updatePhone));
route.delete("/:id", authorization(), catchAsync(phoneController.deletePhone));

export const PhoneRoute = route;
