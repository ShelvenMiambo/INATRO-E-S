import { useEffect, useState, useCallback } from "react";
import type { User } from "@/contexts/auth";

export interface CategoryStat {
  categoryId: string;
  seen: number;
  correct: number;
}

export interface HistoryEntry {
  date: string;
  score: number;
  correct: number;
  total: number;
  categoryId: string | null;
}

export interface MissionStatus {
  id: string;
  xp: number;
  target: number;
  current: number;
  done: boolean;
  title?: string; // não vem do servidor — o dashboard usa MISSION_TITLES como fallback
}

export interface ServerState {
  user: User;
  categoryStats: CategoryStat[];
  history: HistoryEntry[];
  missions: MissionStatus[];
}

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Erro inesperado.");
  return data;
}

export interface RecordAttemptPayload {
  categoryId?: string;
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number;
  categoryProgress: Record<string, { seen: number; correct: number }>;
  longestCorrectStreak: number;
}

export interface RecordAttemptResult {
  user: User;
  newlyEarnedAchievements: string[];
  newlyCompletedMissions: { id: string; xp: number }[];
}

/** Regista um simulado terminado no servidor (só chamar quando autenticado). */
export function recordAttemptOnServer(payload: RecordAttemptPayload): Promise<RecordAttemptResult> {
  return api<RecordAttemptResult>("/api/me/attempts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Dashboard/Histórico: estado agregado (utilizador + categorias + histórico + missões) guardado no servidor. */
export function useServerState(enabled: boolean) {
  const [state, setState] = useState<ServerState | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);

  const refresh = useCallback(() => {
    if (!enabled) {
      setState(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    api<ServerState>("/api/me/state")
      .then(setState)
      .catch(() => setState(null))
      .finally(() => setIsLoading(false));
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { state, isLoading, refresh };
}
