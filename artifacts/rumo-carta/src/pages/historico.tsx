import { useMemo } from 'react';
import { Link } from 'wouter';
import { Navigation } from '@/components/navigation';
import { useGamification } from '@/lib/gamification';
import { useAuth } from '@/contexts/auth';
import { useServerState } from '@/lib/server-progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, Target, Calendar, TrendingUp, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SimuladoRecord {
  date: string;      // ISO date string
  score: number;     // 0–100
  correct: number;
  total: number;
  categoryId?: string;
}

const HISTORY_KEY = 'rumocarta_simulado_history';

function loadHistory(): SimuladoRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  return (
    <div className="bg-card border border-border/60 rounded-2xl px-4 py-3 shadow-xl text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className={`font-black text-xl ${score >= 70 ? 'text-primary' : 'text-destructive'}`}>
        {score}%
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {score >= 70 ? '✅ Aprovado' : '❌ Reprovado'}
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Historico() {
  const { state } = useGamification();
  const { user } = useAuth();
  const { state: serverState } = useServerState(!!user);
  const localHistory = useMemo(() => loadHistory(), []);

  const totalSimulados = user && serverState ? serverState.user.totalSimulados : state.totalSimulados;
  const bestScore = user && serverState ? serverState.user.bestScore : state.bestScore;

  const chartData = useMemo(() => {
    if (user && serverState) {
      return serverState.history
        .slice()
        .reverse()
        .slice(-20)
        .map((h) => ({
          date: new Date(h.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
          score: h.score,
        }));
    }

    if (localHistory.length > 0) {
      return localHistory.slice(-20).map((h) => ({
        date: new Date(h.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
        score: h.score,
      }));
    }

    // Sem sessão e sem histórico local: nada para mostrar (deixa de se
    // inventar dados de demonstração — enganava mais do que ajudava).
    return [];
  }, [user, serverState, localHistory]);

  const avgScore = chartData.length > 0
    ? Math.round(chartData.reduce((s, d) => s + d.score, 0) / chartData.length)
    : 0;

  const approved = chartData.filter((d) => d.score >= 70).length;
  const approvalRate = chartData.length > 0 ? Math.round((approved / chartData.length) * 100) : 0;

  return (
    <Navigation>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">

        {/* ── Header ────────────────────────────────────────── */}
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 -ml-4 gap-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Histórico</h1>
              <p className="text-muted-foreground">
                {user ? `O progresso de ${user.name}` : 'O teu progresso ao longo do tempo'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Stats ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Simulados',
              value: totalSimulados,
              icon: Target,
              color: 'text-primary',
              bg: 'bg-primary/10',
            },
            {
              label: 'Melhor Nota',
              value: `${bestScore}%`,
              icon: Trophy,
              color: 'text-yellow-500',
              bg: 'bg-yellow-500/10',
            },
            {
              label: 'Média',
              value: chartData.length > 0 ? `${avgScore}%` : '–',
              icon: Star,
              color: 'text-blue-400',
              bg: 'bg-blue-400/10',
            },
            {
              label: 'Taxa Aprovação',
              value: chartData.length > 0 ? `${approvalRate}%` : '–',
              icon: Calendar,
              color: 'text-emerald-400',
              bg: 'bg-emerald-400/10',
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/50 rounded-3xl p-5 flex flex-col gap-3 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Evolution Chart ───────────────────────────────── */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Evolução das Notas
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium">
              Últimos {chartData.length} simulados
            </span>
          </div>

          {chartData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Clock className="w-10 h-10 opacity-30" />
              <p className="text-sm font-medium">Ainda não fizeste nenhum simulado.</p>
              <Link href="/simulado">
                <Button size="sm" className="mt-2">Fazer primeiro simulado</Button>
              </Link>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Approval threshold line */}
                  <ReferenceLine
                    y={70}
                    stroke="hsl(var(--primary) / 0.5)"
                    strokeDasharray="4 4"
                    label={{ value: 'Aprovação (70%)', position: 'right', fontSize: 10, fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ r: 5, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ── Recent Results list ──────────────────────────── */}
        {chartData.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold px-1">Últimos Resultados</h2>
            {chartData
              .slice()
              .reverse()
              .slice(0, 8)
              .map((d, i) => {
                const passed = d.score >= 70;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 bg-card border border-border/50 rounded-2xl px-5 py-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${
                      passed ? 'bg-primary/15 text-primary' : 'bg-destructive/15 text-destructive'
                    }`}>
                      {d.score}%
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{d.date}</p>
                      <p className={`text-xs font-medium ${passed ? 'text-primary' : 'text-destructive'}`}>
                        {passed ? '✅ Aprovado' : '❌ Reprovado'}
                      </p>
                    </div>
                    <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${passed ? 'bg-primary' : 'bg-destructive'}`}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}

      </div>
    </Navigation>
  );
}
