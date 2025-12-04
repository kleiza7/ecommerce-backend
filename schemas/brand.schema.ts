import { z } from "zod";

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
});

export const updateBrandSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const brandIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
