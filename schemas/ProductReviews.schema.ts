import { z } from "zod";

export const createProductReviewSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive("Invalid product ID"),
    rating: z.coerce
      .number()
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be greater than 5"),
    comment: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty")
      .max(1000, "Comment is too long")
      .optional(),
  }),
});

export const updateProductReviewSchema = z.object({
  body: z.object({
    productId: z.coerce.number().int().positive("Invalid product ID"),
    rating: z.coerce
      .number()
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be greater than 5"),
    comment: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty")
      .max(1000, "Comment is too long")
      .optional(),
  }),
});

export const productReviewProductIdParamSchema = z.object({
  params: z.object({
    productId: z.coerce.number().int().positive("Invalid product ID"),
  }),
});

export const productReviewIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid review ID"),
  }),
});
