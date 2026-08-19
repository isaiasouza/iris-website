import { ArrowRight, Clock3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ConversionCTA() {
  return (
    <section className="px-4 py-4 sm:px-6" aria-label="Teste o Iris Downloader">
      <Card className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 rounded-md border border-[#404040] bg-[#262626] p-5 py-5 sm:flex-row sm:items-center sm:p-7 sm:py-7">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-blue-400">
            <Clock3 className="h-4 w-4" />
            Você descobre em um download
          </p>
          <p className="mt-2 max-w-2xl text-lg leading-7 text-white">
            Escolha uma pasta grande do seu Drive e compare com o fluxo de ZIP que você usa hoje.
          </p>
        </div>
        <div className="w-full shrink-0 sm:w-auto">
          <Button asChild className="group h-12 w-full rounded-md bg-blue-500 px-5 text-sm font-semibold text-white hover:bg-blue-400 sm:w-auto">
            <a href="/download">
              <Download className="h-4 w-4" />
              Testar com uma pasta real
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <p className="mt-2 text-center font-mono text-[10px] uppercase text-neutral-500">Download grátis · sem cartão</p>
        </div>
      </Card>
    </section>
  );
}
