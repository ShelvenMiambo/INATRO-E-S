/**
 * Seed script for RumoCarta — imports questions from .migration-backup/data/processed/questions.json
 * Run with: pnpm --filter @workspace/scripts run seed-rumo-carta
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { categories, questions, options } from "../../lib/db/src/schema/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Category definitions
const CATEGORY_DATA = [
  { slug: "sinais", name: "Sinais de Trânsito", icon: "🚦", sortOrder: 1 },
  { slug: "prioridades", name: "Prioridades", icon: "⚠️", sortOrder: 2 },
  { slug: "estacionamento", name: "Estacionamento", icon: "🅿️", sortOrder: 3 },
  { slug: "legislacao", name: "Legislação", icon: "📋", sortOrder: 4 },
  { slug: "primeiros-socorros", name: "Primeiros Socorros", icon: "🚑", sortOrder: 5 },
  { slug: "ultrapassagem", name: "Ultrapassagem", icon: "↔️", sortOrder: 6 },
  { slug: "mecanica", name: "Mecânica", icon: "🔧", sortOrder: 7 },
  { slug: "seguranca-rodoviaria", name: "Segurança Rodoviária", icon: "🛡️", sortOrder: 8 },
];

const CATEGORY_NAME_MAP: Record<string, string> = {
  Sinais: "sinais",
  Prioridades: "prioridades",
  Estacionamento: "estacionamento",
  "Legislação": "legislacao",
  "Primeiros Socorros": "primeiros-socorros",
  Ultrapassagem: "ultrapassagem",
  "Mecânica": "mecanica",
  "Segurança Rodoviária": "seguranca-rodoviaria",
};

interface RawOption {
  label: string;
  text: string;
  correct: boolean;
}

interface RawQuestion {
  id: string;
  question_text: string;
  media_type: string;
  image: string | null;
  category_guess: string;
  options: RawOption[];
  explanation?: string | null;
}

async function main() {
  const dataPath = join(__dirname, "../../.migration-backup/data/processed/questions.json");
  const raw: RawQuestion[] = JSON.parse(readFileSync(dataPath, "utf8"));

  console.log(`Seeding ${raw.length} questions...`);

  // Upsert categories
  const catRows = CATEGORY_DATA.map((c) => ({ id: c.slug, ...c }));
  await db.insert(categories).values(catRows).onConflictDoNothing();
  console.log(`✓ ${catRows.length} categories`);

  // Upsert questions
  let questionCount = 0;
  let optionCount = 0;

  for (const q of raw) {
    const categorySlug = CATEGORY_NAME_MAP[q.category_guess] ?? "sinais";
    const imagePath = q.image ? `/questions/${q.image.replace(/\.png$/, ".webp")}` : null;

    await db.insert(questions).values({
      id: q.id,
      questionText: q.question_text,
      mediaType: q.media_type as "sinal" | "foto" | "nenhum",
      imagePath,
      categoryId: categorySlug,
      explanation: q.explanation ?? null,
      difficulty: 2,
      active: true,
    }).onConflictDoNothing();

    questionCount++;

    const opts = q.options.map((o, i) => ({
      id: `${q.id}-${o.label.toLowerCase()}`,
      questionId: q.id,
      label: o.label,
      text: o.text,
      correct: o.correct,
      sortOrder: i,
    }));

    await db.insert(options).values(opts).onConflictDoNothing();
    optionCount += opts.length;
  }

  console.log(`✓ ${questionCount} questions, ${optionCount} options`);
  console.log("Seeding complete!");
  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
