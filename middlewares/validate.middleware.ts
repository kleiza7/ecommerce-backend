import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validate =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!parsed.success) {
        return res.status(400).json({
          message: "Validation error",
          errors: parsed.error.issues,
        });
      }

      const data = parsed.data;

      if (data.body) req.body = data.body;
      if (data.params) req.params = data.params as any;
      if (data.query) req.query = data.query as any;

      next();
    } catch (err) {
      return res.status(500).json({
        message: "Unexpected error during validation",
      });
    }
  };
