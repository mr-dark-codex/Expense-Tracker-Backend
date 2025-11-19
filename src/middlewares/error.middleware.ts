import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { ApiResponse } from "../utils/ApiResponse";
import { config } from "../config";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (config.env === "development") {
    console.error("Error:", err);
  }

  // Handle Prisma unique constraint errors
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    const response = ApiResponse.error(409, `${field} already exists`, [
      `This ${field} is already taken`,
    ]);
    return res.status(response.statusCode).json(response);
  }

  // Handle Prisma foreign key constraint errors
  if (err.code === "P2003") {
    const response = ApiResponse.error(400, "Invalid reference", [
      "Referenced record does not exist",
    ]);
    return res.status(response.statusCode).json(response);
  }

  // Handle Prisma invalid UUID format errors
  if (err.code === "P2023") {
    const response = ApiResponse.error(400, "Invalid ID format", [
      "The provided ID is not a valid UUID format",
    ]);
    return res.status(response.statusCode).json(response);
  }

  // Handle Prisma record not found errors
  if (err.code === "P2025") {
    const response = ApiResponse.error(404, "Record not found", [
      "The requested record does not exist",
    ]);
    return res.status(response.statusCode).json(response);
  }

  // Handle custom errors
  if (err instanceof CustomError) {
    // console.log('Err : ', err)
    const response = ApiResponse.error(err.statusCode, err.message, err.errors);
    return res.status(response.statusCode).json(response);
  }

  const response = ApiResponse.error(
    err.statusCode,
    err.message || "Internal server error",
  );
  return res.status(response.statusCode).json(response);
};
