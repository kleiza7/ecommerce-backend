import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AppError } from "../errors/AppError";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";

export const verifyToken = (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: Token missing", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    // Role token içinde geçersizse
    if (!Object.values(USER_ROLE).includes(decoded.role as USER_ROLE)) {
      throw new AppError("Unauthorized: Invalid role in token", 401);
    }

    req.user = {
      id: decoded.id,
      role: decoded.role as USER_ROLE,
    };

    next();
  } catch (err) {
    throw new AppError("Unauthorized: Invalid or expired token", 401);
  }
};
