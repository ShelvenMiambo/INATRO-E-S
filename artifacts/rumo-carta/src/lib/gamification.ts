import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  totalSimulados: number;
  bestScore: number;
  categoryProgress: Record<string, { seen: number; correct: number }>;
  achievements: string[];
}

const defaultState: GamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: '',
  totalSimulados: 0,
  bestScore: 0,
  categoryProgress: {},
  achievements: [],
};

const STORAGE_KEY = 'rumocarta_gamification';

function loadState(): GamificationState {
  if (typeof window === 'undefined') return defaultState;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return { ...defaultState, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to parse gamification state', e);
    }
  }
  return defaultState;
}

function saveState(state: GamificationState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function getLevelFromXP(xp: number): number {
  if (xp >= 1500) return 5; // Mestre
  if (xp >= 700) return 4;  // Expert
  if (xp >= 300) return 3;  // Condutor
  if (xp >= 100) return 2;  // Aprendiz
  return 1;                 // Iniciante
}

export function getLevelName(level: number): string {
  switch (level) {
    case 5: return 'Mestre';
    case 4: return 'Expert';
    case 3: return 'Condutor';
    case 2: return 'Aprendiz';
    case 1:
    default: return 'Iniciante';
  }
}

export function getXPForNextLevel(currentLevel: number): number {
  switch (currentLevel) {
    case 1: return 100;
    case 2: return 300;
    case 3: return 700;
    case 4: return 1500;
    case 5: return 1500; // Max level
    default: return 100;
  }
}

export function useGamification() {
  const [state, setState] = useState<GamificationState>(loadState);

  // Sync state changes to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addXP = useCallback((amount: number, reason?: string) => {
    setState((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = getLevelFromXP(newXp);
      
      if (newLevel > prev.level) {
        toast.success(`Parabéns! Alcançaste o nível ${newLevel}: ${getLevelName(newLevel)}! 🚀`);
      }
      
      if (reason) {
        toast(`+${amount} XP: ${reason}`, {
          icon: '✨',
        });
      }

      return { ...prev, xp: newXp, level: newLevel };
    });
  }, []);

  const checkAchievements = useCallback((newState: GamificationState) => {
    const newAchievements = [...newState.achievements];
    let earned = false;

    const earn = (slug: string, name: string) => {
      if (!newAchievements.includes(slug)) {
        newAchievements.push(slug);
        toast.success(`Conquista desbloqueada: ${name}! 🏆`, { duration: 5000 });
        earned = true;
      }
    };

    if (newState.totalSimulados >= 1) earn('primeiro-simulado', 'Primeiro Simulado');
    if (newState.bestScore >= 80) earn('primeira-aprovacao', 'Primeira Aprovação');
    if (newState.streak >= 7) earn('streak-7', '7 Dias Seguidos');
    if (newState.level >= 4) earn('expert', 'Expert');
    if (newState.bestScore === 100) earn('perfeito', 'Perfeito');

    if (earned) {
      setState((prev) => ({ ...prev, achievements: newAchievements }));
    }
  }, []);

  const recordSimulado = useCallback((score: number, categoryProgress: Record<string, { seen: number; correct: number }>) => {
    setState((prev) => {
      const isNewBest = score > prev.bestScore;
      
      // Merge category progress
      const mergedProgress = { ...prev.categoryProgress };
      Object.entries(categoryProgress).forEach(([catId, stats]) => {
        if (!mergedProgress[catId]) {
          mergedProgress[catId] = { seen: 0, correct: 0 };
        }
        mergedProgress[catId].seen += stats.seen;
        mergedProgress[catId].correct += stats.correct;
      });

      const newState = {
        ...prev,
        totalSimulados: prev.totalSimulados + 1,
        bestScore: isNewBest ? score : prev.bestScore,
        categoryProgress: mergedProgress,
      };

      // Add XP
      let xpEarned = 50; // base for completing
      if (score >= 80) xpEarned += 100; // bonus

      newState.xp += xpEarned;
      newState.level = getLevelFromXP(newState.xp);

      setTimeout(() => checkAchievements(newState), 1000);

      if (newState.level > prev.level) {
        setTimeout(() => {
          toast.success(`Parabéns! Alcançaste o nível ${newState.level}: ${getLevelName(newState.level)}! 🚀`);
        }, 1500);
      }

      return newState;
    });
  }, [checkAchievements]);

  const checkAndUpdateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    
    setState((prev) => {
      if (prev.lastStudyDate === today) {
        return prev; // already studied today
      }

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      let newStreak = prev.streak;
      if (prev.lastStudyDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1; // reset streak if missed a day (or first time)
      }

      return {
        ...prev,
        streak: newStreak,
        lastStudyDate: today,
      };
    });
  }, []);

  return {
    state,
    addXP,
    recordSimulado,
    checkAndUpdateStreak,
  };
}
