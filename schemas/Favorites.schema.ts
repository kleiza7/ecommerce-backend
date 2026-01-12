import { z } from "zod";

export const toggleFavoriteSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive("Invalid product ID"),
  }),
});

export const mergeGuestFavoritesSchema = z.object({
  body: z.object({
    productIds: z
      .array(z.coerce.number().int().positive())
      .min(1, "Favorites list cannot be empty"),
  }),
});
