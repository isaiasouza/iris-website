import { HardDriveDownload, Laptop, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

const objections = [
  {
    icon: ShieldCheck,
    question: "“Meus arquivos passam pelo servidor de vocês?”",
    answer: "Não. O Iris se conecta à API oficial do Google e transfere os arquivos do Drive direto para o seu Mac.",
  },
  {
    icon: HardDriveDownload,
    question: "“E se uma pasta grande falhar no meio?”",
    answer: "Você acompanha arquivo por arquivo, pode pausar e retomar o download — sem perder tudo porque um ZIP corrompeu.",
  },
  {
    icon: Laptop,
    question: "“E se não funcionar no meu Mac?”",
    answer: "O app roda em Apple Silicon e Intel com macOS 14+. Você testa grátis e ainda tem 7 dias de garantia na compra.",
  },
];

export default function Objections() {
  return (
    <section className="relative py-20 sm:py-24" aria-labelledby="objections-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Antes de instalar</p>
          <h2 id="objections-title" className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl">
            As três dúvidas que mais atrasam o primeiro download
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {objections.map(({ icon: Icon, question, answer }) => (
            <Card key={question} className="gap-0 rounded-2xl border border-white/8 bg-card p-6 py-6">
              <Icon className="h-6 w-6 text-cyan-200" />
              <h3 className="mt-5 text-base font-medium leading-6 text-white">{question}</h3>
              <p className="mt-3 text-sm leading-6 text-white/52">{answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
