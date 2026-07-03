import {NextFunction, Request, Response} from "express";

export const parseJsonBody = (req: Request, res: Response, next: NextFunction) => {
  

  next();
};
