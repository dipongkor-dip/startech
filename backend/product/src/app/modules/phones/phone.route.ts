import {Router} from "express";
import {catchAsync} from "../../utils/catchAsync";
import {phoneController} from "./phone.controller";
import {authorization, productPermission} from "../../middleware/product-permission";
import {validate} from "../../middleware/validateSchema";
import {phoneCreateSchema} from "./phone.validation";

const route = Router();

route.get("/", catchAsync(phoneController.getPhones));
route.get("/:id", catchAsync(phoneController.getPhoneById));
route.get("/phone/:categoryId", authorization(), catchAsync(phoneController.getProductManagerPhones));
route.post("/:permissionId", validate(phoneCreateSchema), productPermission(), phoneController.createPhone);
route.patch("/:id", authorization(), catchAsync(phoneController.updatePhone));
route.delete("/:id", authorization(), catchAsync(phoneController.deletePhone));

export const PhoneRoute = route;
