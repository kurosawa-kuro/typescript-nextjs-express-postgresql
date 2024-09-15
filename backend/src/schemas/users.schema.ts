import { z } from "zod";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  birthDate: Date;
}

export const usersSchemaGet = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const usersSchemaCreate = z.object({
  body: z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    birthDate: z.string().datetime(),
  }),
});

export const usersSchemaUpdate = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    birthDate: z.string().datetime(),
  }),
});

export const usersSchemaDelete = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
