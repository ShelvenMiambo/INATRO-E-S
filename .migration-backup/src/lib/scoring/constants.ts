// Parâmetros do exame teórico do INATRO. Ajustável caso a norma oficial
// mude ou o utilizador confirme valores diferentes — mantidos num único
// sítio para não ficarem espalhados pelo código.
export const EXAME = {
  totalQuestoes: 30,
  duracaoSegundos: 20 * 60, // 20 minutos
  percentagemAprovacao: 80, // >= 80% para passar
} as const;

export const SIMULADO_RAPIDO = {
  totalQuestoes: 10,
  duracaoSegundos: 8 * 60,
} as const;
