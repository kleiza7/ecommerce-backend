import { z } from "zod";

// -------------------------------
// ADD TO CART
// -------------------------------
export const addToCartSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive("Invalid product ID"),

    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  }),
});

// -------------------------------
// UPDATE QUANTITY
// -------------------------------
export const updateCartQuantitySchema = z.object({
  params: z.object({
    itemId: z.string().regex(/^\d+$/, "Invalid cart item ID"),
  }),
  body: z.object({
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  }),
});

// -------------------------------
// REMOVE ITEM
// -------------------------------
export const removeItemSchema = z.object({
  params: z.object({
    itemId: z.string().regex(/^\d+$/, "Invalid cart item ID"),
  }),
});
