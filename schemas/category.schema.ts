import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    parent_id: z.number().nullable().optional(),
    description: z.string().nullable().optional(),
    display_order: z.number(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    parent_id: z.number().nullable().optional(),
    description: z.string().nullable().optional(),
    display_order: z.number().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
