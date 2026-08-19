import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CTAFinal() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(70,180,220,.12),transparent_55%)]" />
      <Card className="relative mx-auto max-w-4xl gap-0 rounded-3xl border border-white/9 bg-[#111922] px-5 py-12 text-center shadow-[0_30px_100px_rgba(0,0,0,.32)] sm:px-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Próximo passo</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-5xl">
          Seu próximo job não precisa virar ZIP.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/50">
          Instale no Mac, conecte uma conta Google e teste com a pasta que mais dá trabalho hoje.
        </p>

        <div className="mx-auto mt-8 flex max-w-xl flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="group h-13 rounded-xl bg-white px-6 text-base font-semibold text-[#071018] hover:bg-cyan-50">
            <a href="/download">
              <Download className="h-5 w-5" />
              Baixar e testar agora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-13 rounded-xl border-white/12 bg-transparent px-5 text-sm font-medium text-white/70 hover:border-white/25 hover:bg-white/6 hover:text-white">
            <a href="#pricing">Ver planos</a>
          </Button>
        </div>
        <p className="mt-4 text-xs text-white/32">Sem cartão · macOS 14+ · 7 dias de garantia na compra</p>
      </Card>
    </section>
  );
}
