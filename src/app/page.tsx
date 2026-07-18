import Link from "next/link";
import { ArrowRight, Flame, GraduationCap, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db/client";
import { questions } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export default async function Home() {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(questions);

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          <ShieldCheck className="size-3.5" />
          {count} perguntas reais do exame do INATRO
        </span>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Passa no exame do <span className="text-primary">INATRO</span> à primeira
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Treina com perguntas reais, aprende com explicações simples e acompanha o teu
          progresso todos os dias — de graça.
        </p>

        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <Button size="lg" className="flex-1" asChild>
            <Link href="/simulado">
              Começar agora
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center gap-2 text-center">
              <GraduationCap className="size-6 text-primary" />
              <p className="text-sm font-semibold">Simulados reais</p>
              <p className="text-xs text-muted-foreground">
                Perguntas tiradas de exames verdadeiros
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-2 text-center">
              <Flame className="size-6 text-accent-foreground" />
              <p className="text-sm font-semibold">Estuda todos os dias</p>
              <p className="text-xs text-muted-foreground">
                Sequências, XP e conquistas para não parares
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-2 text-center">
              <ShieldCheck className="size-6 text-success" />
              <p className="text-sm font-semibold">100% gratuito</p>
              <p className="text-xs text-muted-foreground">
                Feito para toda a população moçambicana
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
