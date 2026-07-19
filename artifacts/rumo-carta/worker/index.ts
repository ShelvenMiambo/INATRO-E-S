import { eq, inArray, asc, sql } from "drizzle-orm";
import { getDb, type Env as DbEnv } from "../functions/_shared/db";
import { categories, questions, options } from "../functions/_shared/schema";
import { handleRegister, handleLogin, handleLogout, handleMe } from "./auth";
import { handleRecordAttempt, handleGetState } from "./progress";

export interface Env extends DbEnv {
  ASSETS: Fetcher;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function handleHealthz(): Promise<Response> {
  return Response.json({ status: "ok" });
}

async function handleCategorias(env: Env): Promise<Response> {
  try {
    const db = getDb(env);
    const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    return Response.json(cats);
  } catch (err) {
    console.error("Failed to fetch categories", err);
    return Response.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

async function handleSimuladoCount(env: Env): Promise<Response> {
  try {
    const db = getDb(env);
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(questions)
      .where(eq(questions.active, true));
    return Response.json({ count });
  } catch (err) {
    console.error("Failed to count questions", err);
    return Response.json({ error: "Failed to count questions" }, { status: 500 });
  }
}

async function handleSimuladoQuestoes(env: Env, url: URL): Promise<Response> {
  const count = Number(url.searchParams.get("count")) || 30;
  const categoryId = url.searchParams.get("categoryId") ?? undefined;
  const onlyIds = url.searchParams.get("onlyIds") ?? undefined;

  try {
    const db = getDb(env);

    let rows = await db
      .select({
        id: questions.id,
        questionText: questions.questionText,
        mediaType: questions.mediaType,
        imagePath: questions.imagePath,
        categoryId: questions.categoryId,
        categoryName: categories.name,
        explanation: questions.explanation,
      })
      .from(questions)
      .innerJoin(categories, eq(questions.categoryId, categories.id))
      .where(categoryId ? eq(questions.categoryId, categoryId) : undefined);

    if (onlyIds) {
      const idSet = new Set(onlyIds.split(",").map((s) => s.trim()).filter(Boolean));
      rows = rows.filter((r) => idSet.has(r.id));
    }

    const selected = shuffle(rows).slice(0, count);
    if (selected.length === 0) return Response.json([]);

    const selectedIds = selected.map((q) => q.id);
    const allOptions = await db.select().from(options).where(inArray(options.questionId, selectedIds));

    const optionsByQuestion = new Map<string, typeof allOptions>();
    for (const opt of allOptions) {
      const list = optionsByQuestion.get(opt.questionId) ?? [];
      list.push(opt);
      optionsByQuestion.set(opt.questionId, list);
    }

    const result = selected.map((q) => {
      const opts = shuffle(optionsByQuestion.get(q.id) ?? []);
      const correct = opts.find((o) => o.correct);
      return {
        id: q.id,
        questionText: q.questionText,
        mediaType: q.mediaType,
        imagePath: q.imagePath,
        categoryId: q.categoryId,
        categoryName: q.categoryName,
        explanation: q.explanation,
        options: opts.map((o) => ({ id: o.id, label: o.label, text: o.text })),
        correctOptionId: correct?.id ?? "",
      };
    });

    return Response.json(result);
  } catch (err) {
    console.error("Failed to fetch simulado questions", err);
    return Response.json({ error: "Failed to load questions" }, { status: 500 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/healthz") return handleHealthz();
    if (url.pathname === "/api/categorias") return handleCategorias(env);
    if (url.pathname === "/api/simulado/count") return handleSimuladoCount(env);
    if (url.pathname === "/api/simulado/questoes") return handleSimuladoQuestoes(env, url);

    if (url.pathname === "/api/auth/register" && request.method === "POST") return handleRegister(request, env);
    if (url.pathname === "/api/auth/login" && request.method === "POST") return handleLogin(request, env);
    if (url.pathname === "/api/auth/logout" && request.method === "POST") return handleLogout(request, env);
    if (url.pathname === "/api/auth/me" && request.method === "GET") return handleMe(request, env);

    if (url.pathname === "/api/me/attempts" && request.method === "POST") return handleRecordAttempt(request, env);
    if (url.pathname === "/api/me/state" && request.method === "GET") return handleGetState(request, env);

    // Tudo o resto: ficheiros estáticos do build do Vite (dist/public).
    return env.ASSETS.fetch(request);
  },
};
