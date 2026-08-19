import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CTAFinal() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <Card className="mx-auto max-w-4xl gap-0 rounded-md border border-[#404040] bg-[#262626] px-5 py-12 text-center shadow-none sm:px-10 sm:py-16">
        <p className="font-mono text-[10px] font-semibold uppercase text-blue-400">Próximo passo</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-5xl">
          Seu próximo job não precisa virar ZIP.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-neutral-400">
          Instale no Mac, conecte uma conta Google e teste com a pasta que mais dá trabalho hoje.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="group h-12 rounded-md bg-blue-500 px-6 text-base font-semibold text-white hover:bg-blue-400">
            <a href="/download">
              <Download className="h-5 w-5" />
              Baixar e testar agora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-md border-[#404040] bg-[#1f1f1f] px-5 text-sm font-medium text-neutral-300 hover:bg-[#303030] hover:text-white">
            <a href="#pricing">Ver planos</a>
          </Button>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase text-neutral-500">Sem cartão · macOS 14+ · 7 dias de garantia na compra</p>
      </Card>
    </section>
  );
}
