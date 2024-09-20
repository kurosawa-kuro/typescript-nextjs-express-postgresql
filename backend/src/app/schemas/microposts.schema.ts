// src/app/schemas/microposts.schema.ts

import { z } from "zod";

export const micropostsSchemaGet = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const micropostsSchemaCreate = z.object({
  body: z.object({
    user_id: z.number(),
    title: z.string().min(1),
    content: z.string().min(1),
    image_path: z.string().optional(),
  }),
});