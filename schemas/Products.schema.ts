import { z } from "zod";

export const productListSchema = z.object({
  body: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),

    brandIds: z
      .array(z.coerce.number().int().positive())
      .optional()
      .default([]),

    categoryIds: z
      .array(z.coerce.number().int().positive())
      .optional()
      .default([]),

    sellerIds: z
      .array(z.coerce.number().int().positive())
      .optional()
      .default([]),

    // 🔜 currency filter (Phase 3)
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Product name is required"),
    description: z.string().trim().min(1, "Description is required"),
    stockCount: z.coerce
      .number()
      .int()
      .min(0, "Stock count must be 0 or greater"),
    price: z.coerce.number().min(0, "Price must be 0 or greater"),
    brandId: z.coerce.number().int().positive("Invalid brand ID"),
    categoryId: z.coerce.number().int().positive("Invalid category ID"),
    currencyId: z.coerce.number().int().positive("Invalid currency ID"),

    // ⚠️ Images are NOT validated here — handled by Multer
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    id: z.coerce.number().int().positive("Invalid product ID"),
    name: z.string().trim().min(1, "Product name is required"),
    description: z.string().trim().min(1, "Description is required"),
    stockCount: z.coerce
      .number()
      .int()
      .min(0, "Stock count must be 0 or greater"),
    price: z.coerce.number().min(0, "Price must be 0 or greater"),
    brandId: z.coerce.number().int().positive("Invalid brand ID"),
    categoryId: z.coerce.number().int().positive("Invalid category ID"),
    currencyId: z.coerce.number().int().positive("Invalid currency ID"),

    // ⚠️ Images optional & handled by Multer
  }),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid product ID"),
  }),
});
