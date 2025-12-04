import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR:", err);

  // -------------------------
  // ZOD VALIDATION ERRORS
  // -------------------------
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: err.issues.map((issue) => issue.message),
    });
  }

  // -------------------------
  // CUSTOM APP ERROR
  // -------------------------
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // -------------------------
  // JWT ERRORS
  // -------------------------
  if (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as any).name === "JsonWebTokenError"
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as any).name === "TokenExpiredError"
  ) {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // -------------------------
  // SEQUELIZE ERRORS
  // -------------------------
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Database validation error",
      details: err.errors.map((e) => e.message),
    });
  }

  // -------------------------
  // FALLBACK
  // -------------------------
  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};
