import {Request, Response} from "express";
import {sendResponse} from "../../../utils/sendResponse";
import {queryService} from "./query.service";
import {StatusCodes} from "http-status-codes";

const getByProductId = async (req: Request, res: Response) => {
  const data = await queryService.getQueriesByProductId(req.params.phoneId);
  return sendResponse(res, {
    status: StatusCodes.OK,
    success: true,
    message: "Queries fetched",
    data,
  });
};

const create = async (req: Request, res: Response) => {
  const q = await queryService.createQuery({
    ...req.body,
    productId: req.params.phoneId,
    userId: req.body.userId,
  });
  return sendResponse(res, {
    status: StatusCodes.CREATED,
    success: true,
    message: "Query created",
    data: q,
  });
};

const answer = async (req: Request, res: Response) => {
  const q = await queryService.answerQuery(req.params.queryId, req.body.answer);
  if (!q) {
    return sendResponse(res, {
      status: StatusCodes.NOT_FOUND,
      success: false,
      message: "Query not found",
      data: null,
    });
  }
  return sendResponse(res, {
    status: StatusCodes.OK,
    success: true,
    message: "Answer added",
    data: q,
  });
};

export const queryController = {getByProductId, create, answer};
