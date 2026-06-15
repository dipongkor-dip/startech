import {Request, Response} from "express";
import {sendResponse} from "../../../utils/sendResponse";
import {reviewService} from "./review.service";
import {StatusCodes} from "http-status-codes";

const getByProductId = async (req: Request, res: Response) => {
  const data = await reviewService.getReviewsByProductId(req.params.phoneId);
  return sendResponse(res, {
    status: StatusCodes.OK,
    success: true,
    message: "Reviews fetched",
    data,
  });
};

const create = async (req: Request, res: Response) => {
  const review = await reviewService.createReview({
    ...req.body,
    productId: req.params.phoneId,
    userId: req.body.userId,
  });
  return sendResponse(res, {
    status: StatusCodes.CREATED,
    success: true,
    message: "Review created",
    data: review,
  });
};

export const reviewController = {getByProductId, create};
