import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({}),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive("Invalid order ID"),
  }),
});
