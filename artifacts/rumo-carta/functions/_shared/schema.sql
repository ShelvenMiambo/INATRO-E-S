-- Schema D1 (SQLite) para o deployment Cloudflare Pages.
-- Espelha functions/_shared/schema.ts (Drizzle). Gerado à mão porque o
-- schema é pequeno e estável; se crescer, passar a usar `drizzle-kit generate`.

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question_text TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'nenhum',
  image_path TEXT,
  category_id TEXT NOT NULL REFERENCES categories(id),
  explanation TEXT,
  difficulty INTEGER NOT NULL DEFAULT 2,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (current_timestamp)
);

CREATE INDEX IF NOT EXISTS questions_category_idx ON questions(category_id);

CREATE TABLE IF NOT EXISTS options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  text TEXT NOT NULL,
  correct INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS options_question_idx ON options(question_id);
