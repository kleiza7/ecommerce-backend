import { z } from "zod";

export const createCurrencySchema = z.object({
  body: z.object({
    code: z
      .string()
      .trim()
      .min(1, "Currency code is required")
      .length(3, "Currency code must be 3 characters")
      .toUpperCase(),
    symbol: z.string().trim().min(1, "Currency symbol is required"),
  }),
});

export const updateCurrencySchema = z.object({
  body: z.object({
    id: z.coerce.number().int().positive("Invalid currency ID"),
    code: z
      .string()
      .trim()
      .min(1, "Currency code is required")
      .length(3, "Currency code must be 3 characters")
      .toUpperCase(),
    symbol: z.string().trim().min(1, "Currency symbol is required"),
  }),
});

export const currencyIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid currency ID"),
  }),
});
