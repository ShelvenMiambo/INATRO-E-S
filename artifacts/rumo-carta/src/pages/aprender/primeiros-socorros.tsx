import { Navigation } from "@/components/navigation";
import { Link } from "wouter";
import { ChevronLeft, ShieldAlert, Phone, HeartPulse, AlertTriangle, ShieldCheck, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    title: "1. Proteger",
    icon: ShieldCheck,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
    desc: "Garantir a segurança do local para evitar novos acidentes.",
    details: [
      "Estacionar o teu veículo em local seguro.",
      "Vestir o colete refletor antes de sair do carro.",
      "Colocar o triângulo de pré-sinalização a 30 metros.",
      "Ligar os quatro piscas do veículo."
    ]
  },
  {
    title: "2. Alertar",
    icon: Phone,
    color: "bg-warning/20 text-warning-foreground",
    desc: "Ligar para os serviços de emergência (117 ou 112).",
    details: [
      "Dar a localização exata do acidente.",
      "Indicar o número de vítimas e o seu estado (conscientes/inconscientes).",
      "Informar se há perigos adicionais (fogo, derrames).",
      "Nunca desligar a chamada antes de o operador autorizar."
    ]
  },
  {
    title: "3. Socorrer",
    icon: HeartPulse,
    color: "bg-success/20 text-success-foreground",
    desc: "Prestar auxílio básico sem agravar o estado das vítimas.",
    details: [
      "Aplicar o sistema PAS (Proteger, Alertar, Socorrer).",
      "Vítima inconsciente que respira: colocar em Posição Lateral de Segurança (PLS).",
      "Hemorragias: aplicar pressão direta com pano limpo.",
      "Falar com as vítimas para as acalmar até chegar a ajuda."
    ]
  }
];

export default function AprenderSocorros() {
  return (
    <Navigation>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
        
        <div className="mb-8">
          <Link href="/aprender">
            <Button variant="ghost" className="mb-4 -ml-4 gap-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-destructive/20 text-destructive rounded-2xl flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black">Primeiros Socorros</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            A atitude correta num acidente pode salvar vidas. Memoriza a regra fundamental: P.A.S. (Proteger, Alertar, Socorrer).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-card rounded-3xl border-2 border-border/50 p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 ${step.color} opacity-50 pointer-events-none`}></div>
                
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center relative z-10 ${step.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h2 className="text-2xl font-black mb-2 relative z-10">{step.title}</h2>
                <p className="text-muted-foreground font-medium mb-6 relative z-10">{step.desc}</p>
                
                <ul className="space-y-3 mt-auto relative z-10">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* REGRAS DE OURO (O que NÃO fazer) */}
        <div className="bg-destructive/5 border-2 border-destructive/20 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 text-destructive">
            <AlertTriangle className="w-8 h-8" />
            <h2 className="text-2xl font-black">O que NUNCA fazer</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-background rounded-2xl p-4 border border-destructive/10 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 font-bold">1</div>
              <p className="font-medium">Nunca remover o capacete a um motociclista acidentado.</p>
            </div>
            <div className="bg-background rounded-2xl p-4 border border-destructive/10 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 font-bold">2</div>
              <p className="font-medium">Nunca dar líquidos ou comida a beber a um ferido.</p>
            </div>
            <div className="bg-background rounded-2xl p-4 border border-destructive/10 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 font-bold">3</div>
              <p className="font-medium">Nunca mover as vítimas a menos que haja perigo iminente (fogo/explosão).</p>
            </div>
            <div className="bg-background rounded-2xl p-4 border border-destructive/10 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 font-bold">4</div>
              <p className="font-medium">Nunca abandonar o local do acidente antes da chegada do socorro.</p>
            </div>
          </div>
        </div>

      </div>
    </Navigation>
  );
}
