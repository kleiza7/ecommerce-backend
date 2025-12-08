import { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!parsed.success) {
        return res.status(400).json({
          message: "Validation error",
          errors: parsed.error.format(),
        });
      }

      const data = parsed.data as {
        body?: any;
        params?: any;
        query?: any;
      };

      if (data.body) req.body = data.body;
      if (data.params) req.params = data.params;
      if (data.query) req.query = data.query;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: err.format(),
        });
      }

      return res.status(500).json({
        message: "Unexpected validation error",
      });
    }
  };
