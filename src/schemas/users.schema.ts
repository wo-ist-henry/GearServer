import {z} from "@hono/zod-openapi";

export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.email(),
    passwordHash: z.string(),
})