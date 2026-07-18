export type MediaType = "sinal" | "foto" | "nenhum";

export interface Opcao {
  id: string;
  label: string;
  text: string;
}

export interface Questao {
  id: string;
  questionText: string;
  mediaType: MediaType;
  imagePath: string | null;
  categoryId: string;
  categoryName: string;
  explanation: string | null;
  options: Opcao[];
}

export interface QuestaoComResposta extends Questao {
  correctOptionId: string;
}

export type ModoSimulado = "simulado" | "revisao_erros" | "revisao_dificeis" | "categoria";

export interface RespostaUtilizador {
  questionId: string;
  selectedOptionId: string | null;
  correct: boolean;
  timeSpentSeconds: number;
}

export interface ResultadoSimulado {
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  durationSeconds: number;
  passProbability: number;
  passed: boolean;
  respostas: RespostaUtilizador[];
}
