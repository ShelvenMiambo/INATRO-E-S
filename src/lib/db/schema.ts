import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";

// ---------- Conteúdo (perguntas) ----------

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
  difficulty: integer("difficulty").notNull().default(2), // 1 fácil .. 3 difícil, recalibrado por dados de acerto
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
}, (t) => ({
  categoryIdx: index("questions_category_idx").on(t.categoryId),
}));

export const options = sqliteTable("options", {
  id: text("id").primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  label: text("label").notNull(), // A, B, C, D
  text: text("text").notNull(),
  correct: integer("correct", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
}, (t) => ({
  questionIdx: index("options_question_idx").on(t.questionId),
}));

// ---------- Utilizadores ----------

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  nickname: text("nickname").notNull(),
  avatarSeed: text("avatar_seed").notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streakCurrent: integer("streak_current").notNull().default(0),
  streakLongest: integer("streak_longest").notNull().default(0),
  streakFreezeCount: integer("streak_freeze_count").notNull().default(1),
  lastActiveDate: text("last_active_date"), // YYYY-MM-DD, fuso local do utilizador
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // token de sessão (hash)
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
}, (t) => ({
  userIdx: index("sessions_user_idx").on(t.userId),
}));

// ---------- Simulados e respostas ----------

export const attempts = sqliteTable("attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mode: text("mode", { enum: ["simulado", "revisao_erros", "revisao_dificeis", "categoria"] })
    .notNull()
    .default("simulado"),
  categoryId: text("category_id").references(() => categories.id),
  totalQuestions: integer("total_questions").notNull(),
  correctCount: integer("correct_count").notNull().default(0),
  durationSeconds: integer("duration_seconds").notNull().default(0),
  passProbability: real("pass_probability"),
  passed: integer("passed", { mode: "boolean" }),
  startedAt: text("started_at").notNull().default(sql`(current_timestamp)`),
  finishedAt: text("finished_at"),
}, (t) => ({
  userIdx: index("attempts_user_idx").on(t.userId),
}));

export const attemptAnswers = sqliteTable("attempt_answers", {
  id: text("id").primaryKey(),
  attemptId: text("attempt_id")
    .notNull()
    .references(() => attempts.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id),
  selectedOptionId: text("selected_option_id").references(() => options.id),
  correct: integer("correct", { mode: "boolean" }).notNull(),
  timeSpentSeconds: real("time_spent_seconds").notNull().default(0),
}, (t) => ({
  attemptIdx: index("attempt_answers_attempt_idx").on(t.attemptId),
  questionIdx: index("attempt_answers_question_idx").on(t.questionId),
}));

// Agregado por utilizador+pergunta para alimentar "perguntas difíceis" e categorias fortes/fracas
export const userQuestionStats = sqliteTable("user_question_stats", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  timesSeen: integer("times_seen").notNull().default(0),
  timesCorrect: integer("times_correct").notNull().default(0),
  lastSeenAt: text("last_seen_at"),
}, (t) => ({
  pk: uniqueIndex("user_question_stats_pk").on(t.userId, t.questionId),
}));

// ---------- Gamificação ----------

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
});

export const userAchievements = sqliteTable("user_achievements", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementId: text("achievement_id")
    .notNull()
    .references(() => achievements.id, { onDelete: "cascade" }),
  earnedAt: text("earned_at").notNull().default(sql`(current_timestamp)`),
}, (t) => ({
  pk: uniqueIndex("user_achievements_pk").on(t.userId, t.achievementId),
}));

export const dailyMissions = sqliteTable("daily_missions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // YYYY-MM-DD
  kind: text("kind", {
    enum: ["responder_n", "acertar_categoria", "tempo_estudo", "simulado_completo"],
  }).notNull(),
  categoryId: text("category_id").references(() => categories.id),
  target: integer("target").notNull(),
  progress: integer("progress").notNull().default(0),
  xpReward: integer("xp_reward").notNull().default(20),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
}, (t) => ({
  userDateIdx: index("daily_missions_user_date_idx").on(t.userId, t.date),
}));
