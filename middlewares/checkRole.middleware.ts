import { NextFunction, Response } from "express";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AppError } from "../errors/AppError";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";

export const checkRole = (...allowedRoles: USER_ROLE[]) => {
  return (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized: Missing authentication", 401);
    }

    const { role } = req.user;

    if (!Object.values(USER_ROLE).includes(role)) {
      throw new AppError("Unauthorized: Invalid role in token", 401);
    }

    if (!allowedRoles.includes(role)) {
      throw new AppError(
        "Forbidden: You do not have permission to access this resource",
        403
      );
    }

    next();
  };
};
