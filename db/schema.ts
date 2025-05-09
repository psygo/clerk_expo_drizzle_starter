import { integer, pgTable, pgTableCreator, varchar } from "drizzle-orm/pg-core"

export const createTable = pgTableCreator((name) => `lang101_${name}`)

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
})
