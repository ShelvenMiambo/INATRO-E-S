import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useGamification, getXPForNextLevel, getLevelName } from "@/lib/gamification";
import { getMissionsStatus, claimNewlyCompletedMissions, type MissionStatus } from "@/lib/daily-missions";
import { Navigation } from "@/components/navigation";
import { Flame, Star, Trophy, Target, ChevronRight, Lock, CheckCircle2, Play, CarFront } from "lucide-react";
import { useGetCategorias } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const ACHIEVEMENTS = [
  { slug: "primeiro-simulado", name: "Primeiro Passo", desc: "Completou 1 simulado" },
  { slug: "primeira-aprovacao", name: "Aprovado!", desc: "Atingiu 80% num simulado" },
  { slug: "streak-7", name: "Consistente", desc: "7 dias seguidos de estudo" },
  { slug: "expert", name: "Expert", desc: "Atingiu o Nível 4" },
  { slug: "perfeito", name: "Perfeição", desc: "Marcou 100% num simulado" },
];

export default function Dashboard() {
  const { state, checkAndUpdateStreak, addXP } = useGamification();
  const { data: categorias, isLoading } = useGetCategorias();

  const [missions, setMissions] = useState<MissionStatus[]>(() => getMissionsStatus());

  useEffect(() => {
    checkAndUpdateStreak();

    const newlyDone = claimNewlyCompletedMissions();
    setMissions(getMissionsStatus());
    newlyDone.forEach((m) => addXP(m.xp, `Missão: ${m.title}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAndUpdateStreak]);

  const xpNeeded = getXPForNextLevel(state.level);
  const xpProgress = Math.min(100, Math.round((state.xp / xpNeeded) * 100));

  return (
    <Navigation>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 md:col-span-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-6 border border-primary/20 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2">Nível {state.level}</span>
            <div className="flex items-baseline gap-2 mb-3">
              <h2 className="text-3xl font-black">{getLevelName(state.level)}</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>{state.xp} XP</span>
                <span className="text-muted-foreground">{xpNeeded} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-primary/20" />
            </div>
          </div>

          <div className="bg-card rounded-3xl p-6 border border-border/50 flex flex-col items-center justify-center text-center shadow-sm">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${state.streak > 0 ? 'bg-accent/20 text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
              <Flame className={`w-7 h-7 ${state.streak > 0 ? 'fill-accent-foreground/20' : ''}`} />
            </div>
            <span className="text-3xl font-black mb-1">{state.streak}</span>
            <span className="text-sm font-medium text-muted-foreground">{state.streak === 1 ? 'Dia seguido' : 'Dias seguidos'}</span>
          </div>

          <div className="bg-card rounded-3xl p-6 border border-border/50 flex flex-col items-center justify-center text-center shadow-sm">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${state.bestScore >= 80 ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
              <Trophy className="w-7 h-7" />
            </div>
            <span className="text-3xl font-black mb-1">{state.bestScore}%</span>
            <span className="text-sm font-medium text-muted-foreground">Melhor Simulado</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/simulado">
            <Button size="lg" className="w-full h-20 text-xl rounded-3xl gap-3 shadow-lg shadow-primary/20 group">
              <Play className="w-6 h-6 fill-current" />
              Simulado Completo
              <ChevronRight className="w-5 h-5 ml-auto opacity-50 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/categorias">
            <Button size="lg" variant="secondary" className="w-full h-20 text-xl rounded-3xl gap-3 group">
              <Target className="w-6 h-6" />
              Praticar por Categoria
              <ChevronRight className="w-5 h-5 ml-auto opacity-50 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Daily Missions */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Missões Diárias
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <div key={mission.id} className={`p-5 rounded-3xl border-2 transition-all ${mission.done ? 'bg-success/5 border-success/20' : 'bg-card border-border/50'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${mission.done ? 'bg-success text-success-foreground border-success' : 'border-muted-foreground/30'}`}>
                    {mission.done && <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <span className="text-xs font-bold text-accent-foreground bg-accent/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent-foreground" /> +{mission.xp}
                  </span>
                </div>
                <p className={`font-medium ${mission.done ? 'text-muted-foreground line-through' : ''}`}>{mission.title}</p>
                {!mission.done && (
                  <div className="mt-3 flex items-center gap-2">
                    <Progress value={(mission.current / mission.target) * 100} className="h-1.5 flex-1" />
                    <span className="text-[10px] font-semibold text-muted-foreground shrink-0">
                      {mission.current}/{mission.target}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Category Progress */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> O teu Progresso
            </h3>
            <Link href="/categorias" className="text-primary text-sm font-bold flex items-center">
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-3xl"></div>
              ))
            ) : categorias?.slice(0, 4).map((cat) => {
              const progress = state.categoryProgress[cat.id];
              const accuracy = progress && progress.seen > 0 
                ? Math.round((progress.correct / progress.seen) * 100) 
                : 0;

              return (
                <Link key={cat.id} href={`/simulado?categoryId=${cat.id}`}>
                  <div className="bg-card p-5 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors h-full flex flex-col">
                    <span className="font-bold text-sm leading-tight mb-auto">{cat.name}</span>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5 font-medium text-muted-foreground">
                        <span>Precisão</span>
                        <span>{accuracy}%</span>
                      </div>
                      <Progress value={accuracy} className="h-2" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Achievements Shelf */}
        <div>
          <h3 className="text-xl font-bold mb-4 px-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent-foreground" /> Conquistas
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 -mx-2">
            {ACHIEVEMENTS.map((ach) => {
              const earned = state.achievements.includes(ach.slug);
              return (
                <div 
                  key={ach.slug} 
                  className={`snap-center shrink-0 w-40 p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
                    earned ? 'bg-accent/10 border-accent/30' : 'bg-muted/30 border-dashed border-border/50 opacity-60'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${earned ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20' : 'bg-muted text-muted-foreground'}`}>
                    {earned ? <Trophy className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <h4 className="font-bold text-sm mb-1">{ach.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight">{ach.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Image */}
        <div className="mt-8">
          <div className="w-full h-48 rounded-3xl border border-border/50 overflow-hidden relative shadow-sm">
            <img 
              src="/images/hero_dashboard.png" 
              alt="Carro a conduzir em estrada moçambicana" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </Navigation>
  );
}
