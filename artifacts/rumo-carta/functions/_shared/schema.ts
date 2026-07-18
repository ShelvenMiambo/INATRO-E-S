import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Schema D1 (SQLite) usado apenas pelo deployment Cloudflare Pages.
 * Espelha lib/db/src/schema/index.ts (Postgres, usado pelo Replit) —
 * mesma forma lógica, dialecto diferente. Ver docs/CLOUDFLARE.md para o
 * porquê de existirem dois schemas em paralelo.
 */

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const questions = sqliteTable("questions", {
  id: text("id").primaryKey(),
  questionText: text("question_text").notNull(),
  mediaType: text("media_type", { enum: ["sinal", "foto", "nenhum"] })
    .notNull()
    .default("nenhum"),
  imagePath: text("image_path"),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  explanation: text("explanation"),
  difficulty: integer("difficulty").notNull().default(2),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const options = sqliteTable("options", {
  id: text("id").primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  text: text("text").notNull(),
  correct: integer("correct", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Category = typeof categories.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Option = typeof options.$inferSelect;
