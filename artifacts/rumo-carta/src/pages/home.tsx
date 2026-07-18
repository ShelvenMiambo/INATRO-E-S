import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetSimuladoCount } from "@workspace/api-client-react";
import { CheckCircle2, Flame, GraduationCap, CarFront, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";

export default function Home() {
  const { data: countData, isLoading } = useGetSimuladoCount();
  const count = countData?.count ?? 0;

  return (
    <Navigation>
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl w-full mx-auto text-center space-y-12 z-10 py-12 md:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-3xl mb-2 rotate-3 hover:rotate-0 transition-transform">
              <CarFront className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[1.1]">
              A sua carta de <br className="hidden md:block" />
              condução <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">começa aqui.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              A plataforma gratuita de preparação para o exame teórico do INATRO. 
              Treine, ganhe XP e passe à primeira.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-4 pb-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-16 px-10 text-lg rounded-2xl font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all group" data-testid="link-start-dashboard">
                Começar a Estudar
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/simulado" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full h-16 px-10 text-lg rounded-2xl font-bold" data-testid="link-quick-simulado">
                Simulado Rápido
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12"
          >
            <div className="flex flex-col gap-4 p-8 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-xl">Questões Oficiais</h3>
              <p className="text-muted-foreground leading-relaxed">
                {isLoading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Carregando...</span>
                ) : (
                  <>Mais de <strong className="text-foreground">{count}</strong> questões reais do INATRO para praticar e dominar.</>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-4 p-8 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="bg-accent/20 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Flame className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-bold text-xl">Aprende a Jogar</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ganha XP, mantém o teu streak diário e desbloqueia conquistas enquanto aprendes o Código da Estrada.
              </p>
            </div>
            <div className="flex flex-col gap-4 p-8 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="bg-success/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-success" />
              </div>
              <h3 className="font-bold text-xl">100% Gratuito</h3>
              <p className="text-muted-foreground leading-relaxed">
                O conhecimento não tem preço. Estuda ao teu ritmo sem pagar absolutamente nada, para sempre.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Navigation>
  );
}
