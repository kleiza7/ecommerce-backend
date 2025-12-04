import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = parsed.body;
      req.params = parsed.params;
      req.query = parsed.query;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: err.issues,
        });
      }

      return res.status(500).json({
        message: "Unexpected error during validation",
      });
    }
  };
