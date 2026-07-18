import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { useGetCategorias } from "@workspace/api-client-react";
import { useGamification } from "@/lib/gamification";
import { Target, ChevronRight, Loader2, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function Categorias() {
  const { data: categorias, isLoading } = useGetCategorias();
  const { state } = useGamification();

  return (
    <Navigation>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-3">Praticar por Categoria</h1>
          <p className="text-lg text-muted-foreground">Foca os teus estudos nos temas onde precisas de mais prática.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-muted/50 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categorias?.map((cat, index) => {
              const progress = state.categoryProgress[cat.id];
              const seen = progress?.seen || 0;
              const correct = progress?.correct || 0;
              const accuracy = seen > 0 ? Math.round((correct / seen) * 100) : 0;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  key={cat.id}
                >
                  <Link href={`/simulado?categoryId=${cat.id}`}>
                    <div className="bg-card p-6 rounded-3xl border-2 border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group h-full flex flex-col cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <Target className="w-6 h-6" />
                        </div>
                        <div className="bg-muted px-2.5 py-1 rounded-full text-xs font-bold text-muted-foreground flex items-center gap-1">
                          <Info className="w-3 h-3" /> Info
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      
                      <div className="mt-auto pt-6">
                        <div className="flex justify-between items-end mb-2">
                          <div className="text-sm font-medium text-muted-foreground">
                            {seen > 0 ? `${seen} respondidas` : 'Ainda não tentaste'}
                          </div>
                          <div className={`text-sm font-bold ${accuracy >= 80 ? 'text-success' : accuracy > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                            {seen > 0 ? `${accuracy}% certo` : '-'}
                          </div>
                        </div>
                        <Progress value={accuracy} className="h-2" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Navigation>
  );
}
