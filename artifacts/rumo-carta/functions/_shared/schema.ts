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

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  avatarSeed: text("avatar_seed").notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streakCurrent: integer("streak_current").notNull().default(0),
  streakLongest: integer("streak_longest").notNull().default(0),
  lastActiveDate: text("last_active_date"), // YYYY-MM-DD
  bestScore: integer("best_score").notNull().default(0),
  totalSimulados: integer("total_simulados").notNull().default(0),
  achievements: text("achievements").notNull().default("[]"), // JSON string[]
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // hash do token, nunca o token em si
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const attempts = sqliteTable("attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id),
  totalQuestions: integer("total_questions").notNull(),
  correctCount: integer("correct_count").notNull(),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  percentage: integer("percentage").notNull(),
  passed: integer("passed", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const userCategoryStats = sqliteTable("user_category_stats", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  seen: integer("seen").notNull().default(0),
  correct: integer("correct").notNull().default(0),
});

export const userDailyStats = sqliteTable("user_daily_stats", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  simulados: integer("simulados").notNull().default(0),
  categoriesStudied: text("categories_studied").notNull().default("[]"), // JSON string[]
  maxCorrectStreak: integer("max_correct_streak").notNull().default(0),
  awardedMissionIds: text("awarded_mission_ids").notNull().default("[]"), // JSON string[]
});

export type Category = typeof categories.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Option = typeof options.$inferSelect;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;
