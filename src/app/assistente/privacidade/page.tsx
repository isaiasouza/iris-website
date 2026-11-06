import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — Assistente Iris",
  description: "Como o Assistente Iris, ferramenta interna da Iris Media, trata os dados do Google.",
};

const linkClass = "text-iris-400 transition-colors hover:text-iris-300";

export default function AssistentePrivacyPage() {
  return (
    <div className="min-h-screen bg-[#13131A]">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Link href="/assistente" className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
            ← Voltar
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-iris-400">Legal</p>
        <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
          Política de Privacidade — Assistente Iris
        </h1>
        <p className="mt-3 text-sm text-[#58585F]">Última atualização: 6 de novembro de 2026</p>

        <div className="mt-12 space-y-10 text-[#9F9FA3] [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul_li]:list-disc">
          <section>
            <h2>1. Quem somos</h2>
            <p>
              O Assistente Iris é uma ferramenta interna da <strong className="text-white">Iris Media</strong>,
              usada somente pela equipe do estúdio, nas contas Google do próprio estúdio. Esta política explica
              como os dados acessados por ele são tratados, em conformidade com a Lei Geral de Proteção de Dados
              (LGPD — Lei nº 13.709/2018).
            </p>
            <p className="mt-3">
              Contato:{" "}
              <a href="mailto:contato@irismedia.com.br" className={linkClass}>
                contato@irismedia.com.br
              </a>
            </p>
          </section>

          <section>
            <h2>2. Dados do Google que acessamos</h2>
            <ul>
              <li>
                <strong className="text-white">Gmail (somente leitura):</strong> remetente, assunto, data e texto dos
                e-mails, para identificar mensagens de clientes, cobranças e prazos.
              </li>
              <li>
                <strong className="text-white">Google Drive (somente leitura):</strong> nome, data, pasta e link dos
                arquivos, para encontrar vídeos já entregues aos clientes.
              </li>
            </ul>
            <p className="mt-3">
              O assistente não envia e-mails, não apaga nem altera arquivos e não muda permissões de
              compartilhamento.
            </p>
          </section>

          <section>
            <h2>3. Como usamos esses dados</h2>
            <p>
              Os dados são usados apenas para organizar o trabalho do estúdio: resumir o que chegou, sugerir
              rascunhos de resposta e localizar entregas. Toda resposta a cliente é revisada e enviada por uma
              pessoa da equipe. Não vendemos, não compartilhamos para publicidade e não usamos esses dados para
              treinar modelos de inteligência artificial.
            </p>
            <p className="mt-3">
              O uso de informações recebidas das APIs do Google segue a{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Política de Dados do Usuário dos Serviços de API do Google
              </a>
              , incluindo os requisitos de Uso Limitado.
            </p>
          </section>

          <section>
            <h2>4. Onde os dados ficam</h2>
            <p>
              As credenciais de acesso ficam salvas apenas no computador do estúdio. Os e-mails e arquivos são lidos
              sob demanda e não são copiados para servidores próprios. Resumos e tarefas ficam no painel interno da
              equipe.
            </p>
          </section>

          <section>
            <h2>5. Como revogar o acesso</h2>
            <p>
              O acesso pode ser revogado a qualquer momento em{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                myaccount.google.com/permissions
              </a>
              , removendo o app &quot;Assistente Iris&quot;.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
