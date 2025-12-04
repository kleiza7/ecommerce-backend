import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
    brandId: z.number(),
    categoryId: z.number(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().min(0).optional(),
    brandId: z.number().optional(),
    categoryId: z.number().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
