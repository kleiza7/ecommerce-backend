import { z } from "zod";

//////////////////////////////////////////////////////
// PRODUCT LIST
//////////////////////////////////////////////////////

export const productListSchema = z.object({
  body: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    brandId: z.coerce.number().int().positive().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
  }),
});

//////////////////////////////////////////////////////
// CREATE PRODUCT
//////////////////////////////////////////////////////

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

    // ⚠️ Images are NOT validated here — handled by Multer
  }),
});

//////////////////////////////////////////////////////
// UPDATE PRODUCT
//////////////////////////////////////////////////////

export const updateProductSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid product ID"),
  }),
  body: z.object({
    name: z.string().trim().optional(),
    description: z.string().trim().optional(),
    stockCount: z.coerce
      .number()
      .int()
      .min(0, "Stock count must be 0 or greater")
      .optional(),
    price: z.coerce.number().min(0, "Price must be 0 or greater").optional(),
    brandId: z.coerce.number().int().positive().optional(),
    categoryId: z.coerce.number().int().positive().optional(),

    // ⚠️ Images optional & handled by Multer
  }),
});

//////////////////////////////////////////////////////
// PRODUCT ID PARAM
//////////////////////////////////////////////////////

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid product ID"),
  }),
});
