import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { USER_ROLE } from "../enums/UserRole.enum";
import { AuthenticatedRequest } from "../interfaces/AuthenticatedRequest.interface";

export const VerifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: Token missing" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    if (!Object.values(USER_ROLE).includes(decoded.role as USER_ROLE)) {
      res.status(401).json({ message: "Unauthorized: Invalid role in token" });
      return;
    }

    req.user = {
      id: decoded.id,
      role: decoded.role as USER_ROLE,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
