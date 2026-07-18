"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { estimarProbabilidadeAprovacao } from "@/lib/scoring/probability";
import { EXAME } from "@/lib/scoring/constants";
import type { QuestaoComResposta, RespostaUtilizador, ResultadoSimulado } from "@/types/questao";
import { ResultadoSimuladoView } from "./resultado-simulado";

function useCronometro(ativo: boolean) {
  const [segundos, setSegundos] = React.useState(0);
  React.useEffect(() => {
    if (!ativo) return;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [ativo]);
  return segundos;
}

function formatarTempo(totalSegundos: number) {
  const m = Math.floor(totalSegundos / 60);
  const s = totalSegundos % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function explicacaoFallback(q: QuestaoComResposta): string {
  const correta = q.options.find((o) => o.id === q.correctOptionId);
  return `A resposta correta é "${correta?.text}". Esta questão pertence à categoria ${q.categoryName} — revê este tema no material de estudo para reforçar o porquê.`;
}

export function SimuladoRunner({ questoes }: { questoes: QuestaoComResposta[] }) {
  const [indice, setIndice] = React.useState(0);
  const [selecionada, setSelecionada] = React.useState<string | null>(null);
  const [revelada, setRevelada] = React.useState(false);
  const [respostas, setRespostas] = React.useState<RespostaUtilizador[]>([]);
  const [inicioQuestao, setInicioQuestao] = React.useState(() => Date.now());
  const [terminou, setTerminou] = React.useState(false);

  const tempoTotal = useCronometro(!terminou);
  const questaoAtual = questoes[indice];
  const progresso = Math.round((indice / questoes.length) * 100);

  function escolher(optionId: string) {
    if (revelada) return;
    setSelecionada(optionId);
    setRevelada(true);
    const correct = optionId === questaoAtual.correctOptionId;
    const timeSpentSeconds = (Date.now() - inicioQuestao) / 1000;
    setRespostas((prev) => [
      ...prev,
      { questionId: questaoAtual.id, selectedOptionId: optionId, correct, timeSpentSeconds },
    ]);
  }

  function proxima() {
    if (indice + 1 >= questoes.length) {
      setTerminou(true);
      return;
    }
    setIndice((i) => i + 1);
    setSelecionada(null);
    setRevelada(false);
    setInicioQuestao(Date.now());
  }

  if (terminou) {
    const correctCount = respostas.filter((r) => r.correct).length;
    const percentage = Math.round((correctCount / questoes.length) * 100);
    const resultado: ResultadoSimulado = {
      totalQuestions: questoes.length,
      correctCount,
      percentage,
      durationSeconds: tempoTotal,
      passProbability: estimarProbabilidadeAprovacao({ percentagemAtual: percentage }),
      passed: percentage >= EXAME.percentagemAprovacao,
      respostas,
    };
    return <ResultadoSimuladoView resultado={resultado} questoes={questoes} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6">
      <div className="flex items-center gap-3">
        <Progress value={progresso} className="h-2.5 flex-1" />
        <span className="shrink-0 text-sm font-semibold text-muted-foreground">
          {indice + 1}/{questoes.length}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="secondary">{questaoAtual.categoryName}</Badge>
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Clock className="size-4" />
          {formatarTempo(tempoTotal)}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questaoAtual.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          {questaoAtual.imagePath && (
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
              <Image
                src={questaoAtual.imagePath}
                alt=""
                width={640}
                height={360}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-xl font-bold leading-snug">{questaoAtual.questionText}</h1>

          <div className="flex flex-col gap-2.5">
            {questaoAtual.options.map((opt) => {
              const isSelected = selecionada === opt.id;
              const isCorrect = opt.id === questaoAtual.correctOptionId;
              return (
                <button
                  key={opt.id}
                  onClick={() => escolher(opt.id)}
                  disabled={revelada}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all",
                    !revelada && "border-border hover:border-primary/50 hover:bg-secondary",
                    revelada && isCorrect && "border-success bg-success/10 text-success-foreground",
                    revelada && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                    revelada && !isSelected && !isCorrect && "border-border opacity-50"
                  )}
                >
                  <span>{opt.text}</span>
                  {revelada && isCorrect && <Check className="size-5 shrink-0 text-success" />}
                  {revelada && isSelected && !isCorrect && (
                    <X className="size-5 shrink-0 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>

          {revelada && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl bg-secondary p-4 text-sm text-secondary-foreground"
            >
              <p className="mb-1 font-bold">
                {selecionada === questaoAtual.correctOptionId ? "Certo! 🎉" : "Não foi desta vez"}
              </p>
              <p className="text-muted-foreground">
                {questaoAtual.explanation ?? explicacaoFallback(questaoAtual)}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {revelada && (
        <Button size="lg" onClick={proxima} className="w-full">
          {indice + 1 >= questoes.length ? "Ver resultado" : "Continuar"}
          <ChevronRight className="size-5" />
        </Button>
      )}
    </div>
  );
}
