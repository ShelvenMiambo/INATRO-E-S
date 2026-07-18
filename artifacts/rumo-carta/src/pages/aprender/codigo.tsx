import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Link } from "wouter";
import { 
  ChevronLeft, 
  BookOpen, 
  AlertCircle, 
  Compass, 
  Smartphone, 
  Car, 
  FastForward, 
  Search, 
  Star, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GRUPOS_MULTAS, TOTAL_MULTAS } from "@/data/multas";
import { Banknote } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Rule {
  id: string;
  icon: any;
  title: string;
  tags: string[];
  content: React.ReactNode;
  plainText: string; // for search
  quiz?: QuizQuestion;
}

const RULES: Rule[] = [
  {
    id: "prioridades",
    icon: Compass,
    title: "Regras de Prioridade",
    tags: ["Cruzamentos", "Rotundas", "Urgência"],
    plainText: "regras de prioridade cruzamentos entroncamentos direita rotundas ambulancias bombeiros policia marcha urgência sempre prioridade",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">A regra geral é simples mas tem excepções cruciais:</p>
        <div className="grid gap-3">
          <div className="p-4 bg-muted/40 border border-border/40 rounded-2xl flex gap-3 items-start">
            <span className="text-primary font-black bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
            <div>
              <strong className="text-foreground">Regra Geral da Direita:</strong> Nos cruzamentos e entroncamentos, a prioridade pertence ao veículo que se apresenta pela <strong className="text-primary">direita</strong>.
            </div>
          </div>
          <div className="p-4 bg-muted/40 border border-border/40 rounded-2xl flex gap-3 items-start">
            <span className="text-primary font-black bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
            <div>
              <strong className="text-foreground">Rotundas:</strong> Têm prioridade os veículos que <strong className="text-primary">já se encontram a circular</strong> dentro da rotunda. Quem entra deve ceder a passagem.
            </div>
          </div>
          <div className="p-4 bg-muted/40 border border-border/40 rounded-2xl flex gap-3 items-start">
            <span className="text-primary font-black bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
            <div>
              <strong className="text-foreground">Veículos de Emergência:</strong> Ambulâncias, bombeiros e polícia assinalando marcha de urgência têm sempre <strong className="text-primary">prioridade absoluta</strong>.
            </div>
          </div>
        </div>
      </div>
    ),
    quiz: {
      question: "Chegas a um cruzamento sem sinalização. De quem é a prioridade?",
      options: [
        "Do veículo que circula mais rápido",
        "Do veículo que se apresenta pela tua direita",
        "Do veículo que já está dentro do cruzamento"
      ],
      correct: 1,
      explanation: "Pela regra geral (artigo 30º do código da estrada moçambicano), nos cruzamentos não sinalizados, a prioridade é de quem se apresenta pela direita."
    }
  },
  {
    id: "velocidades",
    icon: FastForward,
    title: "Limites de Velocidade",
    tags: ["Autoestrada", "Localidade", "Ligeiros"],
    plainText: "limites de velocidade localidades 50 km/h fora localidades 90 vias reservadas 100 autoestradas 120 carros ligeiros passageiros",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Para automóveis ligeiros de passageiros sem reboque na rede rodoviária moçambicana:</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/40 p-4 border border-border/40 rounded-2xl flex flex-col justify-between group hover:border-primary/40 transition-colors">
            <span className="text-xs text-muted-foreground font-semibold mb-2">Dentro das Localidades</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground">50</span>
              <span className="text-sm text-muted-foreground font-bold">km/h</span>
            </div>
          </div>
          <div className="bg-muted/40 p-4 border border-border/40 rounded-2xl flex flex-col justify-between group hover:border-primary/40 transition-colors">
            <span className="text-xs text-muted-foreground font-semibold mb-2">Fora das Localidades</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground">90</span>
              <span className="text-sm text-muted-foreground font-bold">km/h</span>
            </div>
          </div>
          <div className="bg-muted/40 p-4 border border-border/40 rounded-2xl flex flex-col justify-between group hover:border-primary/40 transition-colors">
            <span className="text-xs text-muted-foreground font-semibold mb-2">Vias Reservadas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground">100</span>
              <span className="text-sm text-muted-foreground font-bold">km/h</span>
            </div>
          </div>
          <div className="bg-muted/40 p-4 border border-border/40 rounded-2xl flex flex-col justify-between group hover:border-primary/40 transition-colors">
            <span className="text-xs text-muted-foreground font-semibold mb-2">Autoestradas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground">120</span>
              <span className="text-sm text-muted-foreground font-bold">km/h</span>
            </div>
          </div>
        </div>
      </div>
    ),
    quiz: {
      question: "Qual é o limite máximo de velocidade para ligeiros de passageiros dentro das localidades?",
      options: [
        "40 km/h",
        "50 km/h",
        "60 km/h"
      ],
      correct: 1,
      explanation: "O limite geral máximo de velocidade dentro das localidades é de 50 km/h para todos os veículos ligeiros e pesados."
    }
  },
  {
    id: "distancias",
    icon: Car,
    title: "Distâncias de Segurança",
    tags: ["2 Segundos", "Segurança", "Travagem"],
    plainText: "distancias de seguranca tempo reacao segundos chuva visibilidade travagem",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Manter uma distância segura é essencial para evitar colisões traseiras em caso de paragem brusca.</p>
        <div className="p-5 bg-primary/5 border border-primary/15 rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
          <h4 className="font-bold text-primary flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4" /> Regra dos 2 Segundos
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Escolhe um ponto de referência fixo na berma (como um poste ou sinal). Quando o carro à tua frente passar por ele, conta: <strong className="text-foreground">"Mil e um, mil e dois"</strong>. Se passares pelo ponto antes de terminar, estás demasiado próximo.
          </p>
          <div className="mt-3 flex gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Chuva: 4 segundos</Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Noite: 3 segundos</Badge>
          </div>
        </div>
      </div>
    ),
    quiz: {
      question: "Qual é o intervalo de tempo mínimo recomendado a manter do veículo da frente em condições normais?",
      options: [
        "1 segundo",
        "2 segundos",
        "4 segundos"
      ],
      correct: 1,
      explanation: "A regra padrão de segurança na via é a regra dos 2 segundos, devendo ser duplicada para 4 segundos se o pavimento estiver molhado ou houver fraca visibilidade."
    }
  },
  {
    id: "alcool",
    icon: AlertCircle,
    title: "Álcool e Condução",
    tags: ["Multas", "Limite Legal", "Segurança"],
    plainText: "alcool conducao taxa alcoolemia sangue limite legal recem encartados 0.5 0.2 crime",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">A presença de álcool no sangue altera os reflexos e aumenta significativamente o risco de acidentes.</p>
        <div className="grid gap-3">
          <div className="p-4 bg-muted/40 border border-border/40 rounded-2xl flex justify-between items-center">
            <div>
              <h5 className="font-bold text-foreground">Taxa Geral Permitida</h5>
              <p className="text-xs text-muted-foreground">Condutores em geral</p>
            </div>
            <span className="text-xl font-black text-foreground bg-background border px-3 py-1 rounded-xl">0.5 g/L</span>
          </div>
          <div className="p-4 bg-muted/40 border border-border/40 rounded-2xl flex justify-between items-center">
            <div>
              <h5 className="font-bold text-foreground">Recém-encartados & Profissionais</h5>
              <p className="text-xs text-muted-foreground">Menos de 3 anos de carta / Transporte de mercadorias ou passageiros</p>
            </div>
            <span className="text-xl font-black text-foreground bg-background border px-3 py-1 rounded-xl">0.2 g/L</span>
          </div>
        </div>
      </div>
    ),
    quiz: {
      question: "Qual é a taxa máxima de álcool no sangue permitida para um condutor com 1 ano de carta?",
      options: [
        "0.0 g/L",
        "0.2 g/L",
        "0.5 g/L"
      ],
      correct: 1,
      explanation: "Para condutores em regime probatório (menos de 3 anos de carta) ou profissionais, a taxa máxima de álcool permitida é reduzida para 0.2 g/L de sangue."
    }
  },
  {
    id: "telemovel",
    icon: Smartphone,
    title: "Utilização do Telemóvel",
    tags: ["Infrações", "Multas", "Distração"],
    plainText: "telemovel smartphone auricular alta voz proibido usar conduzir",
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">O uso de telemóvel ao volante é uma das principais causas de distração e acidentes rodoviários.</p>
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl text-sm leading-relaxed text-destructive-foreground">
          <strong className="font-bold block mb-1 text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Proibição Estrita:
          </strong>
          É proibido o manuseamento ou uso de telemóvel durante a marcha do veículo. A multa é grave e implica perda de pontos.
        </div>
        <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl text-sm leading-relaxed text-foreground">
          <strong className="font-bold block mb-1 text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Exceções Únicas:
          </strong>
          Permitido apenas o uso de sistemas de <strong className="text-emerald-500">alta-voz integrado</strong> ou o uso de <strong className="text-emerald-500">um único auricular</strong> (apenas num ouvido).
        </div>
      </div>
    ),
    quiz: {
      question: "Quando podes manusear o telemóvel para enviar mensagens?",
      options: [
        "Apenas quando o veículo está parado nos semáforos",
        "Nunca com o carro em marcha",
        "Desde que uses apenas uma das mãos"
      ],
      correct: 1,
      explanation: "O manuseamento do telemóvel com o veículo em marcha é estritamente proibido. Paragens temporárias como semáforos ou trânsito lento continuam a fazer parte da marcha."
    }
  }
];

export default function AprenderCodigo() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [multasSearch, setMultasSearch] = useState("");

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem("rumocarta_fav_codigo");
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch {}
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(id)
      ? favorites.filter((x) => x !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("rumocarta_fav_codigo", JSON.stringify(updated));
    toast.success(favorites.includes(id) ? "Removido dos favoritos" : "Adicionado aos favoritos", {
      icon: "⭐"
    });
  };

  const filteredRules = RULES.filter(
    (rule) =>
      rule.title.toLowerCase().includes(search.toLowerCase()) ||
      rule.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
      rule.plainText.toLowerCase().includes(search.toLowerCase())
  );

  const multasQuery = multasSearch.trim().toLowerCase();
  const filteredMultas = multasQuery
    ? GRUPOS_MULTAS.flatMap((grupo) =>
        grupo.itens
          .filter(
            (item) =>
              item.infracao.toLowerCase().includes(multasQuery) ||
              item.artigo.toLowerCase().includes(multasQuery) ||
              grupo.titulo.toLowerCase().includes(multasQuery)
          )
          .map((item) => ({ ...item, grupo: grupo.titulo }))
      )
    : null;

  const startQuiz = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveQuiz(id);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };

  const submitQuizAnswer = (correctIdx: number) => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    if (selectedOption === correctIdx) {
      toast.success("Resposta correta! Parabéns! 🎉");
    } else {
      toast.error("Resposta incorreta. Lê a explicação abaixo!");
    }
  };

  return (
    <Navigation>
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">
        
        {/* ── Header ────────────────────────────────────────── */}
        <div>
          <Link href="/aprender">
            <Button variant="ghost" className="mb-4 -ml-4 gap-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black">Código da Estrada</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Aprende os temas do código com resumos inteligentes e testa os teus conhecimentos em cada tópico.
          </p>
        </div>

        {/* ── Search & Filter ────────────────────────────────── */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por regras, velocidades, multas..."
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 text-base"
          />
        </div>

        {/* ── Rules Accordion ────────────────────────────────── */}
        <div className="bg-card rounded-3xl border border-border/50 p-2 shadow-sm">
          {filteredRules.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Nenhum tópico encontrado para a tua pesquisa.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full" defaultValue="prioridades">
              {filteredRules.map((rule) => {
                const Icon = rule.icon;
                const isFav = favorites.includes(rule.id);
                return (
                  <AccordionItem key={rule.id} value={rule.id} className="border-b border-border/20 last:border-0">
                    <AccordionTrigger className="hover:bg-muted/30 px-4 py-5 rounded-2xl transition-colors data-[state=open]:bg-muted/40 data-[state=open]:text-primary group">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-10 h-10 rounded-xl bg-background border shadow-sm flex items-center justify-center group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground group-data-[state=open]:border-primary transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-lg block">{rule.title}</span>
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              {rule.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleFavorite(rule.id, e)}
                            className={`p-2 rounded-xl transition-colors ${
                              isFav ? "text-yellow-500 hover:bg-yellow-500/10" : "text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            <Star className={`w-5 h-5 ${isFav ? "fill-yellow-500" : ""}`} />
                          </button>
                          {rule.quiz && (
                            <button
                              onClick={(e) => startQuiz(rule.id, e)}
                              className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all shrink-0 flex items-center gap-1"
                            >
                              <HelpCircle className="w-3.5 h-3.5" /> Quiz
                            </button>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-6 pt-4 pl-[4.5rem]">
                      <div className="text-base text-muted-foreground leading-relaxed">
                        {rule.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        {/* ── Transgressões e Multas ──────────────────────────── */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-destructive/15 text-destructive rounded-2xl flex items-center justify-center shrink-0">
              <Banknote className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Transgressões e Multas</h2>
              <p className="text-sm text-muted-foreground">
                {TOTAL_MULTAS} infracções do Código da Estrada, com o artigo e o valor da multa.
              </p>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              value={multasSearch}
              onChange={(e) => setMultasSearch(e.target.value)}
              placeholder="Ex: telemóvel, velocidade, estacionamento, álcool..."
              className="pl-12 h-14 rounded-2xl bg-card border-border/50 text-base"
            />
          </div>

          {!filteredMultas ? (
            <div className="p-8 text-center text-muted-foreground bg-card border border-dashed border-border/50 rounded-3xl text-sm">
              Escreve acima para pesquisar entre as {TOTAL_MULTAS} transgressões e respectivas multas.
            </div>
          ) : filteredMultas.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground bg-card border border-border/50 rounded-3xl text-sm">
              Nenhuma transgressão encontrada para "{multasSearch}".
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMultas.map((item, i) => (
                <motion.div
                  key={`${item.grupo}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="p-4 bg-card border border-border/50 rounded-2xl"
                >
                  <Badge variant="outline" className="text-[10px] mb-2">{item.grupo}</Badge>
                  <p className="font-semibold text-foreground leading-snug mb-2">{item.infracao}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">{item.artigo}</span>
                    <span className="font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded-lg">{item.multa}</span>
                    <span className="text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">{item.responsavel}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quiz Modal / Section Drawer ─────────────────────── */}
        <AnimatePresence>
          {activeQuiz && (
            (() => {
              const rule = RULES.find((r) => r.id === activeQuiz)!;
              const quiz = rule.quiz!;
              return (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-card border border-border max-w-lg w-full rounded-3xl p-6 shadow-2xl relative"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <Badge className="bg-primary/10 text-primary border-0 mb-1">Mini-Quiz</Badge>
                        <h3 className="text-xl font-bold">{rule.title}</h3>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setActiveQuiz(null)}>
                        Fechar
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <p className="font-semibold text-foreground">{quiz.question}</p>
                      
                      <div className="space-y-2">
                        {quiz.options.map((opt, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrect = idx === quiz.correct;
                          
                          let optStyle = "bg-muted/40 border-border/40 hover:border-primary/50 text-foreground";
                          if (isSelected) optStyle = "bg-primary/10 border-primary text-primary font-semibold";
                          if (quizSubmitted) {
                            if (isCorrect) optStyle = "bg-success/15 border-success text-success font-semibold";
                            else if (isSelected) optStyle = "bg-destructive/15 border-destructive text-destructive font-semibold";
                          }

                          return (
                            <button
                              key={idx}
                              disabled={quizSubmitted}
                              onClick={() => setSelectedOption(idx)}
                              className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-success" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-xl text-xs text-muted-foreground border">
                          <strong className="block text-foreground font-bold mb-1">Explicação:</strong>
                          {quiz.explanation}
                        </div>
                      )}

                      {!quizSubmitted ? (
                        <Button
                          onClick={() => submitQuizAnswer(quiz.correct)}
                          disabled={selectedOption === null}
                          className="w-full mt-4 h-12 rounded-xl"
                        >
                          Confirmar Resposta <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setActiveQuiz(null)}
                          className="w-full mt-4 h-12 rounded-xl"
                          variant="secondary"
                        >
                          Continuar Estudos
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })()
          )}
        </AnimatePresence>

      </div>
    </Navigation>
  );
}
