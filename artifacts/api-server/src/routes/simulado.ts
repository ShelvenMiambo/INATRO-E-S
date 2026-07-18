import { Router, type IRouter } from "express";
import { eq, sql, inArray } from "drizzle-orm";
import { db } from "@workspace/db";
import { questions, options, categories } from "@workspace/db/schema";
import {
  GetSimuladoQuestoesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GET /api/simulado/questoes
router.get("/simulado/questoes", async (req, res) => {
  const parseResult = GetSimuladoQuestoesQueryParams.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { count, categoryId, onlyIds } = parseResult.data;

  try {
    // Build question rows query
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
      .where(
        categoryId
          ? eq(questions.categoryId, categoryId)
          : undefined
      );

    // Filter to only specified IDs if requested
    if (onlyIds) {
      const idSet = new Set(onlyIds.split(",").map((s) => s.trim()).filter(Boolean));
      rows = rows.filter((r) => idSet.has(r.id));
    }

    // Shuffle and limit
    const selected = shuffle(rows).slice(0, count);

    if (selected.length === 0) {
      res.json([]);
      return;
    }

    // Fetch all options for selected questions
    const selectedIds = selected.map((q) => q.id);
    const allOptions = await db
      .select()
      .from(options)
      .where(inArray(options.questionId, selectedIds));

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

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch simulado questions");
    res.status(500).json({ error: "Failed to load questions" });
  }
});

// GET /api/simulado/count
router.get("/simulado/count", async (req, res) => {
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(questions)
      .where(eq(questions.active, true));
    res.json({ count });
  } catch (err) {
    req.log.error({ err }, "Failed to count questions");
    res.status(500).json({ error: "Failed to count questions" });
  }
});

// GET /api/categorias
router.get("/categorias", async (req, res) => {
  try {
    const cats = await db
      .select()
      .from(categories)
      .orderBy(categories.sortOrder);
    res.json(cats);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch categories");
    res.status(500).json({ error: "Failed to load categories" });
  }
});

export default router;
