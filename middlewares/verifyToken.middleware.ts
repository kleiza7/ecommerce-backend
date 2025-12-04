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

  if (!authHeader) {
    throw new AppError("Unauthorized: Token missing", 401);
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Unauthorized: Invalid authorization header", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: USER_ROLE;
    };

    // Role token içinde enum değilse reject et
    if (!Object.values(USER_ROLE).includes(decoded.role)) {
      throw new AppError("Unauthorized: Invalid role in token", 401);
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (_) {
    throw new AppError("Unauthorized: Invalid or expired token", 401);
  }
};
