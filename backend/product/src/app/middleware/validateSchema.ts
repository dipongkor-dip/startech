import {Request, Response, NextFunction} from "express";
import {ZodSchema} from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: formattedErrors,
    });
  }
  // validated data overwrite করে দিলে type safety বাড়ে
  req.body = result.data;
  next();
};
