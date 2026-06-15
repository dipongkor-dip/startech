import {Router} from "express";
import {catchAsync} from "../../../utils/catchAsync";
import {reviewController} from "./review.controller";

const route = Router({mergeParams: true});

route.get("/", catchAsync(reviewController.getByProductId));
route.post("/", catchAsync(reviewController.create));

export const ReviewRoute = route;
