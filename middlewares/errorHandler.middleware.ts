import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 🔑 Eğer response zaten gönderildiyse zinciri kırma
  if (res.headersSent) {
    return next(err);
  }

  console.error("🔥 ERROR:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      details: err.issues,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    });
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as any).name === "JsonWebTokenError"
  ) {
    return res.status(401).json({
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
      message: "Token expired",
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let message = "Database error";

    switch (err.code) {
      case "P2002":
        message = "Unique constraint failed";
        break;
      case "P2003":
        message = "Foreign key constraint failed";
        break;
      case "P2025":
        message = "Record not found";
        break;
    }

    return res.status(400).json({
      message,
      meta: err.meta,
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Invalid data provided to database",
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      message: "Database initialization error",
    });
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({
      message: "Critical database panic",
    });
  }

  // 🔑 En sonda mutlaka generic error
  return res.status(500).json({
    message: "Something went wrong",
  });
};
