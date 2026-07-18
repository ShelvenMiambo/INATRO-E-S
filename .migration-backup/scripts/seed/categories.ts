export const CATEGORY_DEFS = [
  { slug: "sinais", name: "Sinais", icon: "octagon-alert" },
  { slug: "prioridades", name: "Prioridades", icon: "signpost" },
  { slug: "estacionamento", name: "Estacionamento", icon: "square-parking" },
  { slug: "ultrapassagem", name: "Ultrapassagem", icon: "move-right" },
  { slug: "seguranca-rodoviaria", name: "Segurança Rodoviária", icon: "shield-check" },
  { slug: "mecanica", name: "Mecânica", icon: "wrench" },
  { slug: "primeiros-socorros", name: "Primeiros Socorros", icon: "heart-pulse" },
  { slug: "legislacao", name: "Legislação", icon: "scale" },
  { slug: "outros", name: "Outros", icon: "help-circle" },
] as const;

export function categorySlugFromGuess(guess: string): string {
  const map: Record<string, string> = {
    "Sinais": "sinais",
    "Prioridades": "prioridades",
    "Estacionamento": "estacionamento",
    "Ultrapassagem": "ultrapassagem",
    "Segurança Rodoviária": "seguranca-rodoviaria",
    "Mecânica": "mecanica",
    "Primeiros Socorros": "primeiros-socorros",
    "Legislação": "legislacao",
    "Outros": "outros",
  };
  return map[guess] ?? "outros";
}
