import { NextFunction, Response } from "express";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AppError } from "../errors/AppError";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";

export const checkRole = (...allowedRoles: USER_ROLE[]) => {
  return (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized: Token missing or invalid", 401);
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      throw new AppError("Forbidden: Insufficient permissions", 403);
    }

    next();
  };
};
