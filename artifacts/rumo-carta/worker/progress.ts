import { eq, and, desc } from "drizzle-orm";
import { getDb, type Env } from "../functions/_shared/db";
import { users, attempts, userCategoryStats, userDailyStats } from "../functions/_shared/schema";
import { generateId } from "../functions/_shared/auth-crypto";
import { getCurrentUser, type PublicUser } from "./auth";

// ---------- Regras de gamificação (espelham src/lib/gamification.ts e
// src/lib/daily-missions.ts do frontend — ver nota nesses ficheiros) ----------

function getLevelFromXP(xp: number): number {
  if (xp >= 1500) return 5;
  if (xp >= 700) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;
  return 1;
}

const ACHIEVEMENT_DEFS = [
  { slug: "primeiro-simulado", check: (u: typeof users.$inferSelect) => u.totalSimulados >= 1 },
  { slug: "primeira-aprovacao", check: (u: typeof users.$inferSelect) => u.bestScore >= 80 },
  { slug: "streak-7", check: (u: typeof users.$inferSelect) => u.streakCurrent >= 7 },
  { slug: "expert", check: (u: typeof users.$inferSelect) => u.level >= 4 },
  { slug: "perfeito", check: (u: typeof users.$inferSelect) => u.bestScore === 100 },
];

const MISSION_DEFS = [
  { id: "simulado", xp: 50, target: 1, progress: (s: { simulados: number }) => s.simulados },
  { id: "categorias", xp: 30, target: 2, progress: (s: { categoriesStudied: string[] }) => s.categoriesStudied.length },
  { id: "streak15", xp: 100, target: 15, progress: (s: { maxCorrectStreak: number }) => s.maxCorrectStreak },
];

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function yesterdayKey(): string {
  return new Date(Date.now() - 86400000).toISOString().split("T")[0];
}

interface AttemptPayload {
  categoryId?: string;
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number;
  categoryProgress: Record<string, { seen: number; correct: number }>;
  longestCorrectStreak: number;
}

export async function handleRecordAttempt(request: Request, env: Env): Promise<Response> {
  const user = await getCurrentUser(request, env);
  if (!user) return Response.json({ error: "Não autenticado." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as AttemptPayload | null;
  if (!body || !body.totalQuestions || body.correctCount === undefined) {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const db = getDb(env);
  const percentage = Math.round((body.correctCount / body.totalQuestions) * 100);
  const passed = percentage >= 80;

  await db.insert(attempts).values({
    id: generateId("att"),
    userId: user.id,
    categoryId: body.categoryId ?? null,
    totalQuestions: body.totalQuestions,
    correctCount: body.correctCount,
    durationSeconds: Math.round(body.durationSeconds ?? 0),
    percentage,
    passed,
  });

  // Estatísticas por categoria (upsert manual: D1/SQLite suporta
  // ON CONFLICT, mas com chave composta é mais simples 1 select + insert/update)
  for (const [categoryId, stats] of Object.entries(body.categoryProgress ?? {})) {
    const [existing] = await db
      .select()
      .from(userCategoryStats)
      .where(and(eq(userCategoryStats.userId, user.id), eq(userCategoryStats.categoryId, categoryId)));

    if (existing) {
      await db
        .update(userCategoryStats)
        .set({ seen: existing.seen + stats.seen, correct: existing.correct + stats.correct })
        .where(and(eq(userCategoryStats.userId, user.id), eq(userCategoryStats.categoryId, categoryId)));
    } else {
      await db.insert(userCategoryStats).values({
        userId: user.id,
        categoryId,
        seen: stats.seen,
        correct: stats.correct,
      });
    }
  }

  // XP, nível, melhor nota, total de simulados
  let xpEarned = 50;
  if (percentage >= 80) xpEarned += 100;
  const newXp = user.xp + xpEarned;
  const newLevel = getLevelFromXP(newXp);
  const newBestScore = Math.max(user.bestScore, percentage);
  const newTotalSimulados = user.totalSimulados + 1;

  // Streak diário (mesma lógica de checkAndUpdateStreak no frontend)
  const today = todayKey();
  let streakCurrent = user.streakCurrent;
  if (user.lastActiveDate !== today) {
    streakCurrent = user.lastActiveDate === yesterdayKey() ? user.streakCurrent + 1 : 1;
  }
  const streakLongest = Math.max(user.streakLongest, streakCurrent);

  // Missões diárias
  const [dailyStats] = await db
    .select()
    .from(userDailyStats)
    .where(and(eq(userDailyStats.userId, user.id), eq(userDailyStats.date, today)));

  const prevCategoriesStudied: string[] = dailyStats ? JSON.parse(dailyStats.categoriesStudied) : [];
  const categorySet = new Set(prevCategoriesStudied);
  Object.keys(body.categoryProgress ?? {}).forEach((c) => categorySet.add(c));

  const updatedDaily = {
    simulados: (dailyStats?.simulados ?? 0) + 1,
    categoriesStudied: Array.from(categorySet),
    maxCorrectStreak: Math.max(dailyStats?.maxCorrectStreak ?? 0, body.longestCorrectStreak ?? 0),
    awardedMissionIds: dailyStats ? (JSON.parse(dailyStats.awardedMissionIds) as string[]) : [],
  };

  const newlyCompletedMissions = MISSION_DEFS.filter(
    (m) => m.progress(updatedDaily as any) >= m.target && !updatedDaily.awardedMissionIds.includes(m.id)
  );
  const missionXp = newlyCompletedMissions.reduce((acc, m) => acc + m.xp, 0);
  updatedDaily.awardedMissionIds = [...updatedDaily.awardedMissionIds, ...newlyCompletedMissions.map((m) => m.id)];

  const finalXp = newXp + missionXp;
  const finalLevel = getLevelFromXP(finalXp);

  if (dailyStats) {
    await db
      .update(userDailyStats)
      .set({
        simulados: updatedDaily.simulados,
        categoriesStudied: JSON.stringify(updatedDaily.categoriesStudied),
        maxCorrectStreak: updatedDaily.maxCorrectStreak,
        awardedMissionIds: JSON.stringify(updatedDaily.awardedMissionIds),
      })
      .where(and(eq(userDailyStats.userId, user.id), eq(userDailyStats.date, today)));
  } else {
    await db.insert(userDailyStats).values({
      userId: user.id,
      date: today,
      simulados: updatedDaily.simulados,
      categoriesStudied: JSON.stringify(updatedDaily.categoriesStudied),
      maxCorrectStreak: updatedDaily.maxCorrectStreak,
      awardedMissionIds: JSON.stringify(updatedDaily.awardedMissionIds),
    });
  }

  // Conquistas
  const prevAchievements: string[] = JSON.parse(user.achievements);
  const virtualUser = {
    ...user,
    xp: finalXp,
    level: finalLevel,
    bestScore: newBestScore,
    totalSimulados: newTotalSimulados,
    streakCurrent,
  } as typeof users.$inferSelect;
  const newlyEarnedAchievements = ACHIEVEMENT_DEFS.filter(
    (a) => a.check(virtualUser) && !prevAchievements.includes(a.slug)
  ).map((a) => a.slug);
  const finalAchievements = [...prevAchievements, ...newlyEarnedAchievements];

  await db
    .update(users)
    .set({
      xp: finalXp,
      level: finalLevel,
      bestScore: newBestScore,
      totalSimulados: newTotalSimulados,
      streakCurrent,
      streakLongest,
      lastActiveDate: today,
      achievements: JSON.stringify(finalAchievements),
    })
    .where(eq(users.id, user.id));

  const [updatedUser] = await db.select().from(users).where(eq(users.id, user.id));
  const { passwordHash, ...publicUser } = updatedUser;

  return Response.json({
    user: publicUser as PublicUser,
    newlyEarnedAchievements,
    newlyCompletedMissions: newlyCompletedMissions.map((m) => ({ id: m.id, xp: m.xp })),
  });
}

export async function handleGetState(request: Request, env: Env): Promise<Response> {
  const user = await getCurrentUser(request, env);
  if (!user) return Response.json({ error: "Não autenticado." }, { status: 401 });

  const db = getDb(env);
  const today = todayKey();

  const [categoryStats, history, dailyStats] = await Promise.all([
    db.select().from(userCategoryStats).where(eq(userCategoryStats.userId, user.id)),
    db.select().from(attempts).where(eq(attempts.userId, user.id)).orderBy(desc(attempts.createdAt)).limit(50),
    db
      .select()
      .from(userDailyStats)
      .where(and(eq(userDailyStats.userId, user.id), eq(userDailyStats.date, today))),
  ]);

  const stats = dailyStats[0]
    ? {
        simulados: dailyStats[0].simulados,
        categoriesStudied: JSON.parse(dailyStats[0].categoriesStudied) as string[],
        maxCorrectStreak: dailyStats[0].maxCorrectStreak,
        awardedMissionIds: JSON.parse(dailyStats[0].awardedMissionIds) as string[],
      }
    : { simulados: 0, categoriesStudied: [], maxCorrectStreak: 0, awardedMissionIds: [] };

  const missions = MISSION_DEFS.map((m) => {
    const current = Math.min(m.progress(stats as any), m.target);
    return { id: m.id, xp: m.xp, target: m.target, current, done: current >= m.target };
  });

  return Response.json({
    user,
    categoryStats: categoryStats.map((c) => ({ categoryId: c.categoryId, seen: c.seen, correct: c.correct })),
    history: history.map((h) => ({
      date: h.createdAt,
      score: h.percentage,
      correct: h.correctCount,
      total: h.totalQuestions,
      categoryId: h.categoryId,
    })),
    missions,
  });
}
