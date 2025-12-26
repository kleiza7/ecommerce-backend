import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive("Invalid product ID"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  }),
});

export const updateCartQuantitySchema = z.object({
  body: z.object({
    itemId: z.coerce.number().int().positive("Invalid cart item ID"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  }),
});

export const mergeGuestCartSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          productId: z.coerce.number().int().positive("Invalid product ID"),
          quantity: z.coerce
            .number()
            .int()
            .min(1, "Quantity must be at least 1"),
        })
      )
      .min(1, "Guest cart items cannot be empty"),
  }),
});

export const removeItemSchema = z.object({
  params: z.object({
    itemId: z.string().regex(/^\d+$/, "Invalid cart item ID"),
  }),
});
