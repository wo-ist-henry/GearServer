import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  CreateUserSchema,
  UserParamsSchema,
  UserResponseSchema,
  UserSchema,
} from "../schemas/users.schema.js";
import { ErrorSchema } from "../schemas/gear.schema.js";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const userRoutes = new OpenAPIHono();

const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["User"],
  summary: "Get user by ID",
  description: "Retrieves a single user by its ID",
  request: {
    params: UserParamsSchema,
  },
  responses: {
    200: {
      description: "User found",
      content: { "application/json": { schema: UserSchema } },
    },
    404: {
      description: "User not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

userRoutes.openapi(getUserRoute, async (c) => {
  const id = parseInt(c.req.param("id"));
  const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

  if (user.length === 0) {
    return c.json({ error: "Gear not found" }, 404);
  }
  return c.json(user[0], 200);
});

// POST /
const createUserRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["User"],
  summary: "Create user",
  description: "Creates a new user entry",
  request: {
    body: {
      content: { "application/json": { schema: CreateUserSchema } },
    },
  },
  responses: {
    201: {
      description: "User created",
      content: { "application/json": { schema: UserResponseSchema } },
    },
    400: {
      description: "Validation error",
      content: { "application/json": { schema: ErrorSchema } },
    },
    500: {
      description: "Server error",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

userRoutes.openapi(createUserRoute, async (c) => {
  try {
    const { username, email, passwordHash } = c.req.valid("json");
    if (!username || !email || !passwordHash) {
      return c.json({ error: "Invalid input data" }, 400);
    }

    const newUser = await db
      .insert(usersTable)
      .values({ username, email, passwordHash })
      .returning();
    return c.json({ user: newUser[0] }, 201);
  } catch (error) {
    console.error(`Could not create user: ${error}`);
    return c.json({ error: "Server error" }, 500);
  }
});
