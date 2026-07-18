import { readFileSync } from "node:fs";
import { join } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../../src/lib/db/schema";
import { CATEGORY_DEFS, categorySlugFromGuess } from "./categories";
import { ACHIEVEMENT_DEFS } from "./achievements";

type RawOption = { label: string; text: string; correct: boolean };
type RawQuestion = {
  id: string;
  question_text: string;
  media_type: "sinal" | "foto" | "nenhum";
  image: string | null;
  category_guess: string;
  options: RawOption[];
};

const DB_PATH = process.env.LOCAL_DB_PATH ?? "./data/local.db";
const sqlite = new Database(DB_PATH);
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema });

function main() {
  const raw: RawQuestion[] = JSON.parse(
    readFileSync(join(process.cwd(), "data", "processed", "questions.json"), "utf-8")
  );

  console.log(`A semear ${raw.length} perguntas...`);

  const categoryIdBySlug = new Map<string, string>();
  for (const cat of CATEGORY_DEFS) {
    const id = `cat_${cat.slug}`;
    categoryIdBySlug.set(cat.slug, id);
    db.insert(schema.categories)
      .values({ id, slug: cat.slug, name: cat.name, icon: cat.icon })
      .onConflictDoNothing()
      .run();
  }

  for (const ach of ACHIEVEMENT_DEFS) {
    db.insert(schema.achievements)
      .values({
        id: `ach_${ach.slug}`,
        slug: ach.slug,
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        xpReward: ach.xpReward,
      })
      .onConflictDoNothing()
      .run();
  }

  let inserted = 0;
  for (const q of raw) {
    const categorySlug = categorySlugFromGuess(q.category_guess);
    const categoryId = categoryIdBySlug.get(categorySlug)!;
    const imagePath = q.image ? `/questions/${q.image.replace(/\.png$/, ".webp")}` : null;

    db.insert(schema.questions)
      .values({
        id: q.id,
        questionText: q.question_text,
        mediaType: q.media_type,
        imagePath,
        categoryId,
        active: true,
      })
      .onConflictDoNothing()
      .run();

    for (const [idx, opt] of q.options.entries()) {
      db.insert(schema.options)
        .values({
          id: `${q.id}_${opt.label}`,
          questionId: q.id,
          label: opt.label,
          text: opt.text,
          correct: opt.correct,
          sortOrder: idx,
        })
        .onConflictDoNothing()
        .run();
    }
    inserted++;
  }

  console.log(`Concluído: ${inserted} perguntas, ${CATEGORY_DEFS.length} categorias, ${ACHIEVEMENT_DEFS.length} conquistas.`);
}

main();
