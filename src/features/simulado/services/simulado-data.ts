import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { questions, options, categories } from "@/lib/db/schema";
import type { Questao, QuestaoComResposta } from "@/types/questao";

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Carrega N perguntas aleatórias (com opções embaralhadas) para um simulado.
 * `categoryId` restringe a uma categoria (usado no modo "categoria"/revisão).
 */
export async function carregarQuestoesSimulado(params: {
  count: number;
  categoryId?: string;
  onlyIds?: string[];
}): Promise<QuestaoComResposta[]> {
  const rows = await db
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
    .where(params.categoryId ? eq(questions.categoryId, params.categoryId) : undefined);

  let pool = rows;
  if (params.onlyIds?.length) {
    const idSet = new Set(params.onlyIds);
    pool = pool.filter((r) => idSet.has(r.id));
  }
  const escolhidas = embaralhar(pool).slice(0, params.count);

  const allOptions = await db.select().from(options);
  const optionsByQuestion = new Map<string, typeof allOptions>();
  for (const o of allOptions) {
    const list = optionsByQuestion.get(o.questionId) ?? [];
    list.push(o);
    optionsByQuestion.set(o.questionId, list);
  }

  return escolhidas.map((q) => {
    const opts = embaralhar(optionsByQuestion.get(q.id) ?? []);
    const correct = opts.find((o) => o.correct);
    return {
      id: q.id,
      questionText: q.questionText,
      mediaType: q.mediaType as Questao["mediaType"],
      imagePath: q.imagePath,
      categoryId: q.categoryId,
      categoryName: q.categoryName,
      explanation: q.explanation,
      options: opts.map((o) => ({ id: o.id, label: o.label, text: o.text })),
      correctOptionId: correct!.id,
    };
  });
}
