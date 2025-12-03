import { NextFunction, Response } from "express";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";

export const CheckRole = (...allowedRoles: USER_ROLE[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: Token missing or invalid",
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: You are not allowed to access this resource",
      });
    }

    next();
  };
};
