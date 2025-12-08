import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive("Invalid product ID"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  }),
});

export const updateCartQuantitySchema = z.object({
  params: z.object({
    itemId: z.string().regex(/^\d+$/, "Invalid cart item ID"),
  }),
  body: z.object({
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  }),
});

export const removeItemSchema = z.object({
  params: z.object({
    itemId: z.string().regex(/^\d+$/, "Invalid cart item ID"),
  }),
});
