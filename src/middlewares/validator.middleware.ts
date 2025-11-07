import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    const response = ApiResponse.error(400, "Validation failed", errorMessages);
    return res.status(response.statusCode).json(response);
  }

  next();
};
