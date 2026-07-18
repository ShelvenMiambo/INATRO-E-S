import { Navigation } from "@/components/navigation";
import { Link } from "wouter";
import { ChevronLeft, Wrench, Droplet, Battery, ThermometerSnowflake, Lightbulb, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";

const MECHANICS = [
  {
    title: "Pressão dos Pneus",
    icon: CircleDot,
    desc: "Verifica a pressão com os pneus frios (antes de conduzir muito). A pressão correta está no manual ou na porta do condutor. Um pneu mal cheio aumenta o consumo e reduz a aderência."
  },
  {
    title: "Nível do Óleo",
    icon: Droplet,
    desc: "Verifica com o motor frio e num local plano. Retira a vareta, limpa, volta a colocar e retira para ver. O nível deve estar entre o 'Min' e o 'Max'."
  },
  {
    title: "Líquido de Refrigeração",
    icon: ThermometerSnowflake,
    desc: "Evita que o motor sobreaqueça. O nível do vaso de expansão deve estar entre as marcas Min e Max. NUNCA abras a tampa com o motor quente!"
  },
  {
    title: "Bateria",
    icon: Battery,
    desc: "Fornece energia elétrica ao arranque. Os bornes devem estar limpos e apertados. Se o carro não pega e ouves um 'tic-tic', a bateria pode estar descarregada."
  },
  {
    title: "Luzes",
    icon: Lightbulb,
    desc: "Verifica periodicamente todos os faróis: médios, máximos, piscas, luzes de travão e de marcha-atrás. Uma luz fundida reduz a tua visibilidade e como os outros te veem."
  }
];

export default function AprenderMecanica() {
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
            <div className="w-14 h-14 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
              <Wrench className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black">Mecânica Básica</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Conhecimentos essenciais para manter o veículo seguro e evitar avarias na estrada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MECHANICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-card rounded-3xl border border-border/50 p-6 flex flex-col hover:border-blue-500/50 transition-colors group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-blue-500 group-hover:text-white transition-colors flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">{item.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}

          {/* Image */}
          <div className="rounded-3xl border border-border/50 overflow-hidden relative shadow-sm h-48">
            <img 
              src="/images/module_mecanica.png" 
              alt="Compartimento do motor" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </Navigation>
  );
}
