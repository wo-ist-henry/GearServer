import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { gearRoutes } from "./gear.js";
import { userRoutes } from "./user.js";

export const api = new OpenAPIHono().basePath("/api");

// Swagger UI
api.get("/ui", swaggerUI({ url: "/api/doc" }));

// OpenAPI JSON spec
api.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Gear API",
    description: "API for managing gear",
  },
  tags: [
    { name: "Gear", description: "CRUD operations for gear" },
    { name: "User", description: "CRUD operations for users" },
  ],
});

api.route("/gear", gearRoutes);
api.route("/user", userRoutes);
