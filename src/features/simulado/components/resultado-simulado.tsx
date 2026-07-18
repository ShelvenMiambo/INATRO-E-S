"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, ListX, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuestaoComResposta, ResultadoSimulado } from "@/types/questao";

function formatarTempo(totalSegundos: number) {
  const m = Math.floor(totalSegundos / 60);
  const s = Math.round(totalSegundos % 60);
  return `${m}m ${s}s`;
}

export function ResultadoSimuladoView({
  resultado,
  questoes,
}: {
  resultado: ResultadoSimulado;
  questoes: QuestaoComResposta[];
}) {
  const erradas = resultado.respostas.filter((r) => !r.correct);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <div
          className={cn(
            "flex size-20 items-center justify-center rounded-full",
            resultado.passed ? "bg-success/15" : "bg-destructive/15"
          )}
        >
          <Trophy
            className={cn("size-10", resultado.passed ? "text-success" : "text-destructive")}
          />
        </div>
        <h1 className="text-2xl font-extrabold">
          {resultado.passed ? "Estás pronto! 🎉" : "Quase lá — continua a treinar"}
        </h1>
        <p className="text-muted-foreground">
          {resultado.correctCount} de {resultado.totalQuestions} corretas
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="items-center text-center">
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-extrabold text-primary">{resultado.percentage}%</span>
            <span className="text-xs font-medium text-muted-foreground">Percentagem</span>
          </CardContent>
        </Card>
        <Card className="items-center text-center">
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-extrabold">{formatarTempo(resultado.durationSeconds)}</span>
            <span className="text-xs font-medium text-muted-foreground">Tempo gasto</span>
          </CardContent>
        </Card>
        <Card className="items-center text-center">
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-extrabold text-success">{resultado.correctCount}</span>
            <span className="text-xs font-medium text-muted-foreground">Acertos</span>
          </CardContent>
        </Card>
        <Card className="items-center text-center">
          <CardContent className="flex flex-col gap-1">
            <span className="text-3xl font-extrabold text-destructive">{erradas.length}</span>
            <span className="text-xs font-medium text-muted-foreground">Erros</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Probabilidade estimada de aprovação</p>
            <p className="text-xs text-muted-foreground">Com base neste resultado</p>
          </div>
          <span className="text-3xl font-extrabold text-primary">
            {resultado.passProbability}%
          </span>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <Button size="lg" asChild>
          <Link href="/simulado">
            <RotateCcw className="size-5" />
            Repetir simulado completo
          </Link>
        </Button>
        {erradas.length > 0 && (
          <Button size="lg" variant="secondary" asChild>
            <Link href={`/simulado?apenasErradas=${erradas.map((e) => e.questionId).join(",")}`}>
              <ListX className="size-5" />
              Repetir só as {erradas.length} perguntas erradas
            </Link>
          </Button>
        )}
        <Button size="lg" variant="ghost" asChild>
          <Link href="/">
            <Home className="size-5" />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </div>
  );
}
