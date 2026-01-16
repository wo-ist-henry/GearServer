import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { gearsTable, userGearsTable } from "../db/schema.js";
import {
  GearSchema,
  CreateGearSchema,
  GearParamsSchema,
  ErrorSchema,
  DeleteResponseSchema,
  GearResponseSchema,
  GearUserParamsSchema,
} from "../schemas/gear.schema.js";

export const gearRoutes = new OpenAPIHono();

// GET /:id
const getGearRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Gear"],
  summary: "Get gear by ID",
  description: "Retrieves a single gear by its ID",
  request: {
    params: GearParamsSchema,
  },
  responses: {
    200: {
      description: "Gear found",
      content: { "application/json": { schema: GearSchema } },
    },
    404: {
      description: "Gear not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

gearRoutes.openapi(getGearRoute, async (c) => {
  const id = parseInt(c.req.param("id"));
  const gear = await db.select().from(gearsTable).where(eq(gearsTable.id, id));

  if (gear.length === 0) {
    return c.json({ error: "Gear not found" }, 404);
  }
  return c.json(gear[0], 200);
});

// GET user gear by ID
const getUserGearRoute = createRoute({
  method: "get",
  path: "/user/{userId}",
  tags: ["Gear"],
  summary: "Get gear by User ID",
  description: "Retrieves gear associated with a specific user ID",
  request: {
    params: GearUserParamsSchema,
  },
  responses: {
    200: {
      description: "Gear found",
      content: { "application/json": { schema: GearSchema.array() } },
    },
    404: {
      description: "Gear not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

gearRoutes.openapi(getUserGearRoute, async (c) => {
  const userId = parseInt(c.req.param("userId"));

  const userGears = await db
    .select({
      id: gearsTable.id,
      name: gearsTable.name,
      type: gearsTable.type,
      yearOfProduction: gearsTable.yearOfProduction,
    })
    .from(gearsTable)
    .innerJoin(userGearsTable, eq(gearsTable.id, userGearsTable.gearId))
    .where(eq(userGearsTable.userId, userId));

  return c.json(userGears, 200);
});

// POST /
const createGearRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Gear"],
  summary: "Create gear",
  description: "Creates a new gear entry",
  request: {
    body: {
      content: { "application/json": { schema: CreateGearSchema } },
    },
  },
  responses: {
    201: {
      description: "Gear created",
      content: { "application/json": { schema: GearResponseSchema } },
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

gearRoutes.openapi(createGearRoute, async (c) => {
  try {
    const { name, type, yearOfProduction } = c.req.valid("json");

    if (!name || !type || !yearOfProduction) {
      return c.json({ error: "Invalid input data" }, 400);
    }
    const insertedGear = await db
      .insert(gearsTable)
      .values({ name, type, yearOfProduction })
      .returning();

    await db.insert(userGearsTable).values({
      userId: c.req.valid("json").userId,
      gearId: insertedGear[0].id,
    });

    return c.json({ gear: insertedGear[0] }, 201);
  } catch (error) {
    console.error(`Creating gear failed with error: ${error}`);
    return c.json({ error: "Failed to create gear" }, 500);
  }
});

// PUT /:id
const updateGearRoute = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["Gear"],
  summary: "Update gear",
  description: "Updates an existing gear by ID",
  request: {
    params: GearParamsSchema,
    body: {
      content: { "application/json": { schema: CreateGearSchema } },
    },
  },
  responses: {
    200: {
      description: "Gear updated",
      content: { "application/json": { schema: GearResponseSchema } },
    },
    404: {
      description: "Gear not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
    500: {
      description: "Server error",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

gearRoutes.openapi(updateGearRoute, async (c) => {
  const id = parseInt(c.req.param("id"));
  const { name, type, yearOfProduction } = c.req.valid("json");

  try {
    const updatedGear = await db
      .update(gearsTable)
      .set({ name, type, yearOfProduction })
      .where(eq(gearsTable.id, id))
      .returning();

    if (updatedGear.length === 0) {
      return c.json({ error: "Gear not found" }, 404);
    }

    return c.json({ gear: updatedGear[0] }, 200);
  } catch (error) {
    console.error(`Updating gear failed with error: ${error}`);
    return c.json({ error: "Failed to update gear" }, 500);
  }
});

// DELETE /:id
const deleteGearRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Gear"],
  summary: "Delete gear",
  description: "Deletes an existing gear by ID",
  request: {
    params: GearParamsSchema,
  },
  responses: {
    200: {
      description: "Gear deleted",
      content: { "application/json": { schema: DeleteResponseSchema } },
    },
    404: {
      description: "Gear not found",
      content: { "application/json": { schema: ErrorSchema } },
    },
    500: {
      description: "Server error",
      content: { "application/json": { schema: ErrorSchema } },
    },
  },
});

gearRoutes.openapi(deleteGearRoute, async (c) => {
  const id = parseInt(c.req.param("id"));
  // const userId = parseInt(c.req.param("userId"));

  try {
    const deletedGear = await db
      .delete(gearsTable)
      .where(eq(gearsTable.id, id))
      .returning();

    await db.delete(userGearsTable).where(eq(userGearsTable.gearId, id));

    if (deletedGear.length === 0) {
      return c.json({ error: "Gear not found" }, 404);
    }

    return c.json({ message: "Gear deleted successfully", id }, 200);
  } catch (error) {
    console.error(`Deleting gear failed with error: ${error}`);
    return c.json({ error: "Failed to delete gear" }, 500);
  }
});
