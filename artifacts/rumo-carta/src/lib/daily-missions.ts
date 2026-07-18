/**
 * Missões diárias com progresso real, derivado dos simulados que o
 * utilizador de facto completou hoje (guardado em localStorage, tal como o
 * resto do estado de gamificação — ver lib/gamification.ts).
 */

export interface DailyStats {
  simulados: number;
  categoriesStudied: string[];
  maxCorrectStreak: number;
  awardedMissionIds: string[];
}

const STORAGE_KEY = "rumocarta_daily_stats";

const emptyStats = (): DailyStats => ({
  simulados: 0,
  categoriesStudied: [],
  maxCorrectStreak: 0,
  awardedMissionIds: [],
});

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function loadAll(): Record<string, DailyStats> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(all: Record<string, DailyStats>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getTodayStats(): DailyStats {
  const all = loadAll();
  return all[todayKey()] ?? emptyStats();
}

function longestCorrectStreak(respostas: { correct: boolean }[]): number {
  let longest = 0;
  let current = 0;
  for (const r of respostas) {
    current = r.correct ? current + 1 : 0;
    longest = Math.max(longest, current);
  }
  return longest;
}

/** Chamar quando um simulado termina, com as respostas dadas nessa tentativa. */
export function recordSimuladoForMissions(respostas: { categoryId: string; correct: boolean }[]): DailyStats {
  const all = loadAll();
  const key = todayKey();
  const today = all[key] ?? emptyStats();

  const categorySet = new Set(today.categoriesStudied);
  respostas.forEach((r) => categorySet.add(r.categoryId));

  const updated: DailyStats = {
    simulados: today.simulados + 1,
    categoriesStudied: Array.from(categorySet),
    maxCorrectStreak: Math.max(today.maxCorrectStreak, longestCorrectStreak(respostas)),
    awardedMissionIds: today.awardedMissionIds,
  };

  all[key] = updated;
  saveAll(all);
  return updated;
}

export interface MissionDef {
  id: string;
  title: string;
  xp: number;
  target: number;
  progress: (s: DailyStats) => number;
}

export const DAILY_MISSIONS_DEFS: MissionDef[] = [
  { id: "simulado", title: "Completa 1 simulado hoje", xp: 50, target: 1, progress: (s) => s.simulados },
  { id: "categorias", title: "Estuda 2 categorias diferentes", xp: 30, target: 2, progress: (s) => s.categoriesStudied.length },
  { id: "streak15", title: "Acerta 15 questões seguidas", xp: 100, target: 15, progress: (s) => s.maxCorrectStreak },
];

export interface MissionStatus extends MissionDef {
  current: number;
  done: boolean;
}

export function getMissionsStatus(): MissionStatus[] {
  const stats = getTodayStats();
  return DAILY_MISSIONS_DEFS.map((def) => {
    const current = Math.min(def.progress(stats), def.target);
    return { ...def, current, done: current >= def.target };
  });
}

/** Marca como premiadas as missões concluídas ainda não premiadas hoje; devolve as que acabaram de ser premiadas. */
export function claimNewlyCompletedMissions(): MissionStatus[] {
  const all = loadAll();
  const key = todayKey();
  const today = all[key] ?? emptyStats();
  const statuses = getMissionsStatus();

  const newlyDone = statuses.filter((m) => m.done && !today.awardedMissionIds.includes(m.id));
  if (newlyDone.length > 0) {
    all[key] = {
      ...today,
      awardedMissionIds: [...today.awardedMissionIds, ...newlyDone.map((m) => m.id)],
    };
    saveAll(all);
  }
  return newlyDone;
}
