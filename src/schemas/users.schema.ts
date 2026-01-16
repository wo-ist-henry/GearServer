import { z } from "@hono/zod-openapi";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  passwordHash: z.string(),
});

export const CreateUserSchema = z.object({
  username: z.string(),
  email: z.email(),
  passwordHash: z.string(),
});

export const UserParamsSchema = z.object({
  id: z.string(),
});

export const UserResponseSchema = z.object({
  user: UserSchema,
});
