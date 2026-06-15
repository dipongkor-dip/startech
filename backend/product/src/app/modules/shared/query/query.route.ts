import {Router} from "express";
import {catchAsync} from "../../../utils/catchAsync";
import {queryController} from "./query.controller";

const route = Router({mergeParams: true});

route.get("/", catchAsync(queryController.getByProductId));
route.post("/", catchAsync(queryController.create));
route.patch("/:queryId/answer", catchAsync(queryController.answer));

export const QueryRoute = route;
