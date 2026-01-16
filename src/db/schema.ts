import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const gearsTable = pgTable("gear", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    yearOfProduction: integer().notNull(),
    type: varchar({ length: 255 }).notNull(),
});

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar({ length: 255 }).notNull(),
});

export const userGearsTable = pgTable("user_gears", {
    userId: integer().notNull().references(() => usersTable.id),
    gearId: integer().notNull().references(() => gearsTable.id),
}, (table) => ({
    primaryKey: [table.userId, table.gearId],
}));