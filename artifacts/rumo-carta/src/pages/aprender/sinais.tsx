import { Navigation } from "@/components/navigation";
import { Link } from "wouter";
import { ChevronLeft, AlertTriangle, ShieldAlert, CircleSlash, ArrowRightCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const SIGNS_DATA = [
  {
    category: "Sinais de Perigo",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-600 dark:bg-red-900/30",
    shapeClass: "clip-triangle bg-red-600",
    items: [
      { id: "perigo-lomba", name: "Lomba", desc: "Aproximação de uma lomba ou depressão." },
      { id: "perigo-curva", name: "Curva à direita", desc: "Aproximação de uma curva perigosa à direita." },
      { id: "perigo-animais", name: "Animais selvagens", desc: "Possibilidade de animais selvagens na via." },
      { id: "perigo-peoes", name: "Passagem de peões", desc: "Aproximação de uma passadeira." },
    ]
  },
  {
    category: "Sinais de Proibição",
    icon: CircleSlash,
    color: "bg-red-100 text-red-600 dark:bg-red-900/30",
    shapeClass: "rounded-full border-[6px] border-red-600 bg-white dark:bg-zinc-800",
    items: [
      { id: "proib-sentido", name: "Sentido proibido", desc: "Trânsito proibido no sentido em que o sinal está." },
      { id: "proib-ultrapassar", name: "Proibição de ultrapassar", desc: "Proibido ultrapassar outros veículos." },
      { id: "proib-vel-50", name: "Velocidade máxima (50)", desc: "Proibido circular a mais de 50 km/h." },
      { id: "proib-estacionar", name: "Estacionamento proibido", desc: "Proibido estacionar o veículo." },
    ]
  },
  {
    category: "Sinais de Obrigação",
    icon: ArrowRightCircle,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
    shapeClass: "rounded-full bg-blue-600 border-2 border-white",
    items: [
      { id: "obrig-frente", name: "Sentido obrigatório", desc: "Obrigatório seguir em frente." },
      { id: "obrig-rotunda", name: "Rotunda", desc: "Obrigatório circular no sentido giratório." },
      { id: "obrig-vel-30", name: "Velocidade mínima (30)", desc: "Obrigatório circular a pelo menos 30 km/h." },
    ]
  },
  {
    category: "Sinais de Informação",
    icon: Info,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
    shapeClass: "rounded-lg bg-blue-600 border-2 border-white",
    items: [
      { id: "info-hospital", name: "Hospital", desc: "Indicação da existência de um hospital." },
      { id: "info-paragem", name: "Paragem de autocarro", desc: "Local de paragem de transportes públicos." },
      { id: "info-autoestrada", name: "Autoestrada", desc: "Início de autoestrada." },
    ]
  }
];

export default function AprenderSinais() {
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
            <div className="w-14 h-14 bg-warning/20 text-warning rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black">Sinais de Trânsito</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Reconhecer os sinais é a base da condução segura. Eles dividem-se em formas e cores específicas.
          </p>
        </div>

        <div className="space-y-12">
          {SIGNS_DATA.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-border/50 pb-2">
                  <Icon className="w-6 h-6 text-foreground" />
                  <h2 className="text-2xl font-bold">{section.category}</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="bg-card p-4 rounded-2xl border border-border/50 flex gap-4 items-center">
                      
                      {/* IMAGE_PLACEHOLDER: sign-{item.id} — specific traffic sign for {item.name} */}
                      <div 
                        data-placeholder-id={`sign-${item.id}`}
                        className={`w-16 h-16 shrink-0 flex items-center justify-center relative ${section.shapeClass}`}
                        style={section.category === 'Sinais de Perigo' ? { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' } : {}}
                      >
                        <span className="sr-only">{item.name}</span>
                      </div>
                      
                      <div>
                        <h3 className="font-bold leading-tight mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Marcas Rodoviárias */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-border/50 pb-2">
            <h2 className="text-2xl font-bold">Marcas Rodoviárias</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card p-6 rounded-2xl border border-border/50 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-32 h-16 bg-zinc-800 rounded flex items-center justify-center">
                <div className="w-full h-2 bg-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Linha Contínua</h3>
                <p className="text-muted-foreground">Proíbe a passagem para o lado oposto ou o seu pisar. Não se pode ultrapassar sobre esta linha.</p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border/50 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-32 h-16 bg-zinc-800 rounded flex items-center justify-center gap-2">
                <div className="w-8 h-2 bg-white"></div>
                <div className="w-8 h-2 bg-white"></div>
                <div className="w-8 h-2 bg-white"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Linha Descontínua</h3>
                <p className="text-muted-foreground">Separa os sentidos de trânsito. Pode ser pisada ou transposta para efetuar manobras (ex: ultrapassagem).</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Navigation>
  );
}
