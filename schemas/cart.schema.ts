import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    product_id: z.number(),
    quantity: z.number().min(1),
  }),
});

export const updateCartQuantitySchema = z.object({
  body: z.object({
    quantity: z.number(),
  }),
  params: z.object({
    itemId: z.string(),
  }),
});

export const removeItemSchema = z.object({
  params: z.object({
    itemId: z.string(),
  }),
});
