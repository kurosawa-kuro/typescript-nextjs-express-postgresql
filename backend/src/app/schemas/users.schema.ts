// backend/src/app/schemas/users.schema.ts

import { z } from "zod";

export const usersSchemaGet = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const usersSchemaCreate = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password_hash: z.string().min(6),
    is_admin: z.boolean().optional(),
    memo: z.string().optional(),
  }),
});

export const usersSchemaUpdate = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password_hash: z.string().min(6).optional(),
    is_admin: z.boolean().optional(),
    memo: z.string().optional(),
  }),
});

export const usersSchemaDelete = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});