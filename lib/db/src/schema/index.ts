import { sql } from "drizzle-orm";
import { pgTable, text, integer, real, boolean, index, uniqueIndex, timestamp } from "drizzle-orm/pg-core";

// ---------- Content (questions) ----------

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const questions = pgTable("questions", {
  id: text("id").primaryKey(),
  questionText: text("question_text").notNull(),
  mediaType: text("media_type").notNull().default("nenhum"), // "sinal" | "foto" | "nenhum"
  imagePath: text("image_path"),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  explanation: text("explanation"),
  difficulty: integer("difficulty").notNull().default(2),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("questions_category_idx").on(t.categoryId),
]);

export const options = pgTable("options", {
  id: text("id").primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  label: text("label").notNull(), // A, B, C, D
  text: text("text").notNull(),
  correct: boolean("correct").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => [
  index("options_question_idx").on(t.questionId),
]);

export type Category = typeof categories.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Option = typeof options.$inferSelect;
