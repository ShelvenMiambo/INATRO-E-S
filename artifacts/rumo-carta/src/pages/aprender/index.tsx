import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { BookOpen, AlertTriangle, ShieldAlert, Wrench, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const MODULES = [
  {
    id: "sinais",
    title: "Sinais de Trânsito",
    desc: "Aprende todos os sinais obrigatórios, proibição e perigo.",
    icon: AlertTriangle,
    path: "/aprender/sinais",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    imagePath: "/images/module_sinais.png"
  },
  {
    id: "codigo",
    title: "Código da Estrada",
    desc: "Regras de prioridade, velocidade e circulação.",
    icon: BookOpen,
    path: "/aprender/codigo",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    imagePath: "/images/module_codigo.png"
  },
  {
    id: "primeiros-socorros",
    title: "Primeiros Socorros",
    desc: "O que fazer em caso de acidente rodoviário.",
    icon: ShieldAlert,
    path: "/aprender/primeiros-socorros",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    imagePath: "/images/module_socorros.png"
  },
  {
    id: "mecanica",
    title: "Mecânica Básica",
    desc: "Avarias comuns e manutenção essencial do veículo.",
    icon: Wrench,
    path: "/aprender/mecanica",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    imagePath: "/images/module_mecanica.png"
  }
];

export default function AprenderIndex() {
  return (
    <Navigation>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
        
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Manual de Estudo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Toda a teoria que precisas para passar no exame, resumida de forma simples, visual e fácil de memorizar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODULES.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                key={mod.id}
              >
                <div className="bg-card rounded-3xl border-2 border-border/50 overflow-hidden flex flex-col h-full hover:shadow-lg transition-all group">
                  
                  {/* Image */}
                  <div className="h-40 w-full border-b border-border/50 relative overflow-hidden">
                    <img 
                      src={mod.imagePath} 
                      alt={mod.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 right-2 text-[10px] font-bold text-muted-foreground bg-background/70 px-2 py-1 rounded-full backdrop-blur-sm">
                      Módulo
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${mod.bg} ${mod.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-2xl font-bold leading-tight">{mod.title}</h2>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 flex-1">
                      {mod.desc}
                    </p>

                    <Link href={mod.path}>
                      <Button className="w-full rounded-xl gap-2 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                        Estudar
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </Navigation>
  );
}
