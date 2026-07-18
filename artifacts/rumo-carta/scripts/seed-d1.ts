/**
 * Gera um .sql com as 208 perguntas de .migration-backup/data/processed/questions.json
 * e aplica-o à D1 via `wrangler d1 execute` (D1 só é acessível por bindings
 * de Workers ou pelo wrangler CLI — não há driver Node direto como o `pg`).
 *
 * Uso: tsx scripts/seed-d1.ts --local   (D1 local, para `npm run cf:dev`)
 *      tsx scripts/seed-d1.ts --remote  (D1 real na Cloudflare)
 */
import { readFileSync, writeFileSync, mkdtempSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const mode = process.argv.includes("--remote") ? "--remote" : "--local";

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

interface RawOption { label: string; text: string; correct: boolean }
interface RawQuestion {
  id: string;
  question_text: string;
  media_type: string;
  image: string | null;
  category_guess: string;
  options: RawOption[];
  explanation?: string | null;
}

function sqlStr(v: string | null | undefined): string {
  if (v === null || v === undefined) return "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}

function main() {
  const dataPath = join(projectRoot, "..", "..", ".migration-backup", "data", "processed", "questions.json");
  const raw: RawQuestion[] = JSON.parse(readFileSync(dataPath, "utf-8"));

  const lines: string[] = [];

  for (const c of CATEGORY_DATA) {
    lines.push(
      `INSERT OR IGNORE INTO categories (id, slug, name, icon, sort_order) VALUES (${sqlStr(c.slug)}, ${sqlStr(c.slug)}, ${sqlStr(c.name)}, ${sqlStr(c.icon)}, ${c.sortOrder});`
    );
  }

  let questionCount = 0;
  let optionCount = 0;

  for (const q of raw) {
    const categorySlug = CATEGORY_NAME_MAP[q.category_guess] ?? "sinais";
    const imagePath = q.image ? `/questions/${q.image.replace(/\.png$/, ".webp")}` : null;

    lines.push(
      `INSERT OR IGNORE INTO questions (id, question_text, media_type, image_path, category_id, explanation, difficulty, active) VALUES (${sqlStr(q.id)}, ${sqlStr(q.question_text)}, ${sqlStr(q.media_type)}, ${sqlStr(imagePath)}, ${sqlStr(categorySlug)}, ${sqlStr(q.explanation ?? null)}, 2, 1);`
    );
    questionCount++;

    q.options.forEach((o, i) => {
      const optId = `${q.id}-${o.label.toLowerCase()}`;
      lines.push(
        `INSERT OR IGNORE INTO options (id, question_id, label, text, correct, sort_order) VALUES (${sqlStr(optId)}, ${sqlStr(q.id)}, ${sqlStr(o.label)}, ${sqlStr(o.text)}, ${o.correct ? 1 : 0}, ${i});`
      );
      optionCount++;
    });
  }

  const tmpDir = mkdtempSync(join(tmpdir(), "rumocarta-d1-seed-"));
  const sqlPath = join(tmpDir, "seed.sql");
  writeFileSync(sqlPath, lines.join("\n"), "utf-8");

  console.log(`Gerado ${sqlPath} (${questionCount} perguntas, ${optionCount} opções). A aplicar via wrangler (${mode})...`);

  execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "rumocarta-db", mode, `--file=${sqlPath}`],
    { cwd: projectRoot, stdio: "inherit", shell: true }
  );

  console.log("Seed D1 concluído.");
}

main();
