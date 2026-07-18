import { EXAME } from "./constants";

export interface HistoricoCategoria {
  categoryId: string;
  acertos: number;
  total: number;
}

interface EstimarProbabilidadeInput {
  /** Percentagem de acerto (0-100) do simulado atual. */
  percentagemAtual: number;
  /** Percentagens (0-100) dos últimos simulados, mais recentes primeiro. */
  historicoRecente?: number[];
  /** Desempenho por categoria, para penalizar lacunas mesmo com boa média geral. */
  porCategoria?: HistoricoCategoria[];
}

/**
 * Estima a probabilidade de aprovação combinando o resultado atual com o
 * histórico recente (dá mais peso às tentativas mais recentes — sinal de
 * progresso) e uma penalização por categorias fracas (o exame real cobre
 * todas as categorias, por isso uma média geral alta pode esconder um
 * ponto cego que reprova sozinho).
 */
export function estimarProbabilidadeAprovacao({
  percentagemAtual,
  historicoRecente = [],
  porCategoria = [],
}: EstimarProbabilidadeInput): number {
  const amostras = [percentagemAtual, ...historicoRecente].slice(0, 5);
  const pesos = amostras.map((_, i) => 1 / (i + 1));
  const somaPesos = pesos.reduce((a, b) => a + b, 0);
  const mediaPonderada =
    amostras.reduce((acc, v, i) => acc + v * pesos[i], 0) / somaPesos;

  const categoriasFracas = porCategoria.filter(
    (c) => c.total >= 3 && c.acertos / c.total < 0.5
  );
  const penalizacao = Math.min(categoriasFracas.length * 6, 25);

  // Curva logística centrada um pouco abaixo da nota de aprovação: bater
  // exatamente na nota mínima já dá confiança razoável (~65%), e ficar bem
  // acima satura perto de 95-99% (nunca prometemos 100% de certeza).
  const centro = EXAME.percentagemAprovacao - 6;
  const k = 0.13;
  const base = 100 / (1 + Math.exp(-k * (mediaPonderada - centro)));

  const final = Math.max(2, Math.min(98, base - penalizacao));
  return Math.round(final);
}
