import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "config";
import { CustomError } from "../utils/customError";
import { UserRole } from "../types/user";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new CustomError("Authentication required", 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new CustomError("Invalid or expired token", 401));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new CustomError("Unauthorized access", 403);
    }
    next();
  };
};
