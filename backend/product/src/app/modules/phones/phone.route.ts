import {Router} from "express";
import {catchAsync} from "../../utils/catchAsync";
import {phoneController} from "./phone.controller";

const route = Router();

route.get("/", catchAsync(phoneController.getPhones));
route.get("/:id", catchAsync(phoneController.getPhoneById));
route.post("/", catchAsync(phoneController.createPhone));
route.put("/:id", catchAsync(phoneController.updatePhone));
route.delete("/:id", catchAsync(phoneController.deletePhone));

export const PhoneRoute = route;
