import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const gearsTable = pgTable("gear", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    yearOfProduction: integer().notNull(),
    type: varchar({ length: 255 }).notNull(),
});
