import { carregarQuestoesSimulado } from "@/features/simulado/services/simulado-data";
import { SimuladoRunner } from "@/features/simulado/components/simulado-runner";
import { EXAME } from "@/lib/scoring/constants";

export default async function SimuladoPage({
  searchParams,
}: {
  searchParams: Promise<{ apenasErradas?: string; categoria?: string; count?: string }>;
}) {
  const params = await searchParams;
  const onlyIds = params.apenasErradas ? params.apenasErradas.split(",") : undefined;
  const countParam = params.count ? Number(params.count) : NaN;
  const count = onlyIds?.length || (Number.isFinite(countParam) ? countParam : EXAME.totalQuestoes);

  const questoes = await carregarQuestoesSimulado({
    count,
    categoryId: params.categoria,
    onlyIds,
  });

  return <SimuladoRunner questoes={questoes} />;
}
