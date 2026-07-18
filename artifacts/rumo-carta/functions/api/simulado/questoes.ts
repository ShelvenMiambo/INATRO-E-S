import { eq, inArray } from "drizzle-orm";
import { getDb, type Env } from "../../_shared/db";
import { questions, options, categories } from "../../_shared/schema";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
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
};
