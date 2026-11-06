import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Assistente Iris — Iris Media",
  description:
    "Assistente interno da Iris Media que organiza e-mails, agenda e entregas de vídeo do próprio estúdio.",
};

export default function AssistentePage() {
  return (
    <div className="min-h-screen bg-[#13131A]">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Link href="/" className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
            ← Voltar
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-iris-400">Iris Media</p>
        <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">Assistente Iris</h1>

        <div className="mt-12 space-y-10 text-[#9F9FA3] [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul_li]:list-disc">
          <section>
            <h2>O que é</h2>
            <p>
              O Assistente Iris é uma ferramenta interna da <strong className="text-white">Iris Media</strong>,
              usada apenas pela equipe do estúdio nas contas Google do próprio estúdio. Ele não é oferecido
              ao público e não pede acesso a contas de terceiros.
            </p>
          </section>

          <section>
            <h2>O que ele faz</h2>
            <ul>
              <li>Lê os e-mails das contas do estúdio para separar o que é importante (clientes, cobranças, prazos).</li>
              <li>Procura no Google Drive do estúdio os vídeos já entregues, para responder clientes com o link certo.</li>
              <li>Organiza tarefas e lembretes no painel interno da equipe.</li>
            </ul>
            <p className="mt-3">
              O acesso ao Gmail e ao Drive é somente leitura: o assistente não envia e-mails, não apaga
              arquivos e não muda permissões de compartilhamento.
            </p>
          </section>

          <section>
            <h2>Privacidade</h2>
            <p>
              Veja como os dados são tratados na{" "}
              <Link href="/assistente/privacidade" className="text-iris-400 transition-colors hover:text-iris-300">
                Política de Privacidade do Assistente Iris
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
