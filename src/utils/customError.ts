import { config } from "../config";
export class CustomError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(message: string, statusCode: number, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    if (config.env !== "production") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
