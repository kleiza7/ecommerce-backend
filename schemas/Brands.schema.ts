import { z } from "zod";

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Brand name is required"),
  }),
});

export const updateBrandSchema = z.object({
  body: z.object({
    id: z.coerce.number().int().positive("Invalid brand ID"),
    name: z.string().trim().min(1, "Brand name is required"),
  }),
});

export const brandIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid brand ID"),
  }),
});
