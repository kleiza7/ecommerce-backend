import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Category name is required"),
    parentId: z.coerce.number().int().positive().nullable().optional(),
    description: z.string().trim().nullable().optional(),
    displayOrder: z.coerce.number().int(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid category ID"),
  }),
  body: z.object({
    name: z.string().trim().min(1).optional(),
    parentId: z.coerce.number().int().positive().nullable().optional(),
    description: z.string().trim().nullable().optional(),
    displayOrder: z.coerce.number().int().optional(),
  }),
});

export const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid category ID"),
  }),
});
