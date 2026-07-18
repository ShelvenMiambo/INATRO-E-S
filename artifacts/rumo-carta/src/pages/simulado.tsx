import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { useGetSimuladoQuestoes, getGetSimuladoQuestoesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Home, Info, Clock, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuestaoComResposta } from "@workspace/api-client-react";
import { useGamification } from "@/lib/gamification";
import { recordSimuladoForMissions } from "@/lib/daily-missions";

function estimarProbabilidadeAprovacao(percentagem: number): number {
  const centro = 74; // approval threshold 80 - 6
  const k = 0.13;
  const base = 100 / (1 + Math.exp(-k * (percentagem - centro)));
  return Math.round(Math.max(2, Math.min(98, base)));
}

export default function Simulado() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const countParam = searchParams.get("count");
  const categoryIdParam = searchParams.get("categoryId");
  const apenasErradasParam = searchParams.get("apenasErradas");
  const [_, setLocation] = useLocation();

  const queryParams = {
    count: countParam ? parseInt(countParam, 10) : 30,
    ...(categoryIdParam ? { categoryId: categoryIdParam } : {}),
    ...(apenasErradasParam ? { onlyIds: apenasErradasParam } : {}),
  };

  const { data: questoes, isLoading, isError, refetch, isFetching } = useGetSimuladoQuestoes(queryParams, {
    query: {
      enabled: true,
      queryKey: getGetSimuladoQuestoesQueryKey(queryParams),
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  });

  const { recordSimulado, addXP } = useGamification();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [respostas, setRespostas] = useState<{ questionId: string; selectedOptionId: string | null; correct: boolean; timeSpentSeconds: number; categoryId: string; }[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // 20 minutes in seconds

  // Timer
  useEffect(() => {
    if (!isFinished && questoes && !showFeedback) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isFinished, questoes, showFeedback]);

  // Reset state when new questions load
  useEffect(() => {
    if (questoes && questoes.length > 0 && !isFetching) {
      setCurrentIndex(0);
      setRespostas([]);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsFinished(false);
      setQuestionStartTime(Date.now());
      setTimeLeft(20 * 60);
    }
  }, [questoes, isFetching]);

  const handleFinish = () => {
    setIsFinished(true);
  };

  const currentQuestao = questoes?.[currentIndex];

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const handleResponder = () => {
    if (!selectedOption || !currentQuestao || showFeedback) return;
    
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const correct = selectedOption === currentQuestao.correctOptionId;
    
    setRespostas(prev => [
      ...prev,
      {
        questionId: currentQuestao.id,
        selectedOptionId: selectedOption,
        correct,
        timeSpentSeconds: timeSpent,
        categoryId: currentQuestao.categoryId
      }
    ]);
    
    if (correct) {
      addXP(10);
    }

    setShowFeedback(true);
  };

  const handleAvancar = () => {
    if (currentIndex < (questoes?.length || 0) - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    } else {
      handleFinish();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground text-lg font-medium animate-pulse">A preparar o seu simulado...</p>
        </div>
      </div>
    );
  }

  if (isError || !questoes || questoes.length === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Ocorreu um erro</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Não foi possível carregar as questões. Verifique a sua ligação ou tente novamente.</p>
          </div>
          <div className="flex gap-4 mt-4">
            <Button size="lg" variant="outline" onClick={() => setLocation('/')} className="px-8">Sair</Button>
            <Button size="lg" onClick={() => refetch()} data-testid="button-retry-fetch" className="px-8">Tentar Novamente</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <Resultados
        questoes={questoes}
        respostas={respostas}
        onRetryAll={() => refetch()}
        recordSimulado={recordSimulado}
        categoryId={categoryIdParam ?? undefined}
      />
    );
  }

  if (!currentQuestao) return null;

  const letterBadges = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      
      {/* Top Bar (Immersive) */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 safe-area-top">
        <div className="container mx-auto max-w-4xl px-4 h-16 flex items-center justify-between gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard')} className="rounded-full shrink-0">
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
              {questoes.map((_, idx) => {
                const isActive = idx === currentIndex;
                const isPast = idx < currentIndex;
                const isAnswered = isPast || (isActive && showFeedback);
                const isCorrect = isAnswered && respostas[idx]?.correct;

                let color = "bg-transparent";
                if (isActive && !showFeedback) color = "bg-primary w-full animate-pulse";
                else if (isAnswered && isCorrect) color = "bg-success w-full";
                else if (isAnswered && !isCorrect) color = "bg-destructive w-full";
                else if (isPast && !respostas[idx]) color = "bg-muted-foreground w-full"; // skipped

                return (
                  <div key={idx} className="flex-1 h-full border-r border-background/20 last:border-0 relative bg-muted/50">
                    <motion.div 
                      layoutId={`progress-fill-${idx}`}
                      className={`absolute inset-0 ${color}`}
                      initial={false}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`shrink-0 font-mono text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full ${timeLeft < 120 ? 'bg-destructive/15 text-destructive animate-pulse' : 'bg-muted'}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto max-w-2xl p-4 flex flex-col pt-6 pb-24">
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex px-3 py-1 bg-accent/15 text-accent-foreground font-bold text-xs uppercase tracking-wider rounded-full">
                {currentQuestao.categoryName}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black leading-snug text-foreground">
              {currentQuestao.questionText}
            </h2>
            
            {currentQuestao.imagePath && currentQuestao.mediaType !== 'nenhum' && (
              <div className="rounded-3xl overflow-hidden bg-muted/30 border-2 border-border/50 p-4">
                <img 
                  src={currentQuestao.imagePath} 
                  alt="Ilustração da questão" 
                  className="max-h-64 w-auto mx-auto object-contain rounded-xl mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
            )}

            <div className="space-y-3 mt-4">
              {currentQuestao.options.map((opcao, idx) => {
                const isSelected = selectedOption === opcao.id;
                const isCorrect = opcao.id === currentQuestao.correctOptionId;
                const letter = letterBadges[idx] || '?';
                
                let stateClass = "border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]";
                if (isSelected && !showFeedback) {
                  stateClass = "border-primary bg-primary/10 shadow-md shadow-primary/10";
                } else if (showFeedback) {
                  if (isCorrect) {
                    stateClass = "border-success bg-success/15 text-success-foreground shadow-md shadow-success/10 z-10 scale-[1.02]";
                  } else if (isSelected && !isCorrect) {
                    stateClass = "border-destructive bg-destructive/15 text-destructive-foreground";
                  } else {
                    stateClass = "border-border/20 opacity-40 grayscale-[0.5]";
                  }
                }

                return (
                  <motion.button
                    key={opcao.id}
                    onClick={() => handleOptionSelect(opcao.id)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${stateClass}`}
                    data-testid={`option-${opcao.id}`}
                    animate={showFeedback && isSelected && !isCorrect ? { x: [-5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg transition-colors
                      ${isSelected && !showFeedback ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                      ${showFeedback && isCorrect ? 'bg-success text-success-foreground' : ''}
                      ${showFeedback && isSelected && !isCorrect ? 'bg-destructive text-destructive-foreground' : ''}
                    `}>
                      {showFeedback && isCorrect ? <CheckCircle2 className="w-6 h-6" /> : showFeedback && isSelected && !isCorrect ? <XCircle className="w-6 h-6" /> : letter}
                    </div>
                    <div className="text-lg font-medium leading-tight pr-2">
                      {opcao.text}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/40 safe-area-bottom">
        <div className="container mx-auto max-w-2xl">
          <AnimatePresence mode="popLayout">
            {showFeedback ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col gap-4"
              >
                {/* XP Pop */}
                {respostas[currentIndex]?.correct && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: -10 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground font-black px-4 py-1.5 rounded-full text-sm shadow-xl flex items-center gap-1 z-50"
                  >
                    +10 XP ✨
                  </motion.div>
                )}

                {currentQuestao?.explanation && (
                  <div className="bg-muted/50 p-4 rounded-2xl flex items-start gap-3 border border-border/50 text-sm">
                    <Info className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" />
                    <p className="text-muted-foreground leading-relaxed">
                      {currentQuestao.explanation}
                    </p>
                  </div>
                )}
                <Button size="lg" onClick={handleAvancar} className="w-full h-16 text-lg rounded-2xl font-bold shadow-lg" data-testid="button-next">
                  {currentIndex < questoes!.length - 1 ? 'Continuar' : 'Ver Resultados'} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            ) : (
              <Button 
                size="lg" 
                onClick={handleResponder} 
                disabled={!selectedOption}
                className="w-full h-16 text-lg rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                data-testid="button-submit"
              >
                Confirmar
              </Button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const HISTORY_KEY = "rumocarta_simulado_history";

function recordHistoryEntry(entry: { score: number; correct: number; total: number; categoryId?: string }) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    history.push({ date: new Date().toISOString(), ...entry });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save simulado history", e);
  }
}

function Resultados({
  questoes,
  respostas,
  onRetryAll,
  recordSimulado,
  categoryId,
}: {
  questoes: QuestaoComResposta[],
  respostas: { questionId: string; selectedOptionId: string | null; correct: boolean; timeSpentSeconds: number; categoryId: string; }[],
  onRetryAll: () => void,
  recordSimulado: (score: number, categoryProgress: Record<string, {seen:number, correct:number}>) => void,
  categoryId?: string,
}) {
  const [_, setLocation] = useLocation();

  const totalQuestions = questoes.length;
  const correctCount = respostas.filter(r => r.correct).length;
  const wrongCount = totalQuestions - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const durationSeconds = respostas.reduce((acc, r) => acc + r.timeSpentSeconds, 0);
  
  const passed = percentage >= 80;
  
  const wrongIds = respostas.filter(r => !r.correct).map(r => r.questionId).join(",");

  useEffect(() => {
    // Compile category progress
    const categoryProgress: Record<string, {seen:number, correct:number}> = {};
    respostas.forEach(r => {
      if (!categoryProgress[r.categoryId]) {
        categoryProgress[r.categoryId] = { seen: 0, correct: 0 };
      }
      categoryProgress[r.categoryId].seen += 1;
      if (r.correct) categoryProgress[r.categoryId].correct += 1;
    });

    recordSimulado(percentage, categoryProgress);
    recordHistoryEntry({ score: percentage, correct: correctCount, total: totalQuestions, categoryId });
    recordSimuladoForMissions(respostas.map((r) => ({ categoryId: r.categoryId, correct: r.correct })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="max-w-md w-full text-center space-y-8 relative z-10"
        >
          {/* Confetti or Effects could go here */}

          <div className="space-y-2">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
              className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center border-[8px] shadow-2xl ${passed ? 'bg-success/20 text-success border-success shadow-success/20' : 'bg-destructive/20 text-destructive border-destructive shadow-destructive/20'}`}
            >
              <span className="text-4xl font-black">{percentage}%</span>
            </motion.div>
            
            <h1 className="text-4xl font-black pt-6">
              {passed ? "Aprovado!" : "Quase lá!"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {passed ? "Excelente trabalho. Estás pronto para o exame." : "Continua a praticar. A repetição leva à perfeição."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
              <span className="block text-3xl font-black text-success mb-1">{correctCount}</span>
              <span className="text-xs font-bold text-muted-foreground uppercase">Certas</span>
            </div>
            <div className="bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
              <span className="block text-3xl font-black text-destructive mb-1">{wrongCount}</span>
              <span className="text-xs font-bold text-muted-foreground uppercase">Erradas</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {wrongCount > 0 && (
              <Button 
                variant="outline" 
                size="lg" 
                className="h-16 text-lg rounded-2xl font-bold gap-2"
                onClick={() => setLocation(`/simulado?apenasErradas=${wrongIds}`)}
                data-testid="button-retry-wrong"
              >
                <RotateCcw className="w-5 h-5" />
                Refazer Erradas
              </Button>
            )}
            <Button 
              size="lg" 
              className="h-16 text-lg rounded-2xl font-bold shadow-lg gap-2"
              onClick={() => {
                setLocation("/simulado");
                onRetryAll();
              }}
              data-testid="button-retry-all"
            >
              Novo Simulado
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="h-14 text-lg rounded-2xl font-bold gap-2 text-muted-foreground mt-2"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-home"
            >
              <Home className="w-5 h-5" />
              Voltar ao Dashboard
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
