import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso — Iris Downloader",
  description: "Termos de uso do Iris Downloader. Leia antes de utilizar o aplicativo.",
};

export default function TermsPage() {
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
        <p className="text-xs font-semibold uppercase tracking-widest text-iris-400">Legal</p>
        <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">Termos de Uso</h1>
        <p className="mt-3 text-sm text-[#58585F]">Última atualização: 30 de março de 2026</p>

        <div className="mt-12 space-y-10 text-[#9F9FA3] [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul_li]:list-disc">

          <section>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao baixar, instalar ou utilizar o Iris Downloader ("Aplicativo"), você concorda com estes
              Termos de Uso. Se não concordar com alguma cláusula, não utilize o Aplicativo.
            </p>
          </section>

          <section>
            <h2>2. Descrição do Serviço</h2>
            <p>
              O Iris Downloader é um aplicativo nativo para macOS que permite gerenciar, baixar e enviar
              arquivos do Google Drive diretamente para o computador, sem necessidade de compactação.
              O Aplicativo se conecta à Google Drive API em nome do usuário, mediante autenticação OAuth 2.0.
            </p>
          </section>

          <section>
            <h2>3. Licença de Uso</h2>
            <p>
              Ao adquirir uma licença, a Iris Media concede ao usuário uma licença pessoal, não exclusiva e
              intransferível para instalar e utilizar o Aplicativo nos termos abaixo:
            </p>
            <ul>
              <li><strong className="text-white">Plano Anual:</strong> acesso ao Aplicativo e a todas as atualizações lançadas durante o período de 12 meses a partir da data de ativação. A licença é renovável anualmente.</li>
              <li><strong className="text-white">Plano Vitalício:</strong> acesso permanente ao Aplicativo e a todas as atualizações futuras da linha v2, sem renovação.</li>
              <li>A licença permite uso em até 2 (dois) dispositivos Mac simultaneamente de propriedade do mesmo titular.</li>
              <li>É proibida a revenda, sublicenciamento, distribuição ou transferência da licença a terceiros.</li>
            </ul>
          </section>

          <section>
            <h2>4. Conta Google e Privacidade de Dados</h2>
            <p>
              O Aplicativo solicita permissão de acesso ao Google Drive do usuário exclusivamente para
              executar as operações solicitadas (download, upload, listagem de arquivos). Nenhum dado
              do Google Drive é transmitido para servidores da Iris Media. As credenciais de autenticação
              são armazenadas localmente no Keychain do macOS.
            </p>
          </section>

          <section>
            <h2>5. Pagamentos e Reembolso</h2>
            <ul>
              <li>Os pagamentos são processados por plataformas terceiras (Stripe, Cakto, Asaas). A Iris Media não armazena dados de cartão de crédito.</li>
              <li>O plano Anual é cobrado antecipadamente e renovado automaticamente ao final de cada período, salvo cancelamento prévio pelo usuário.</li>
              <li>Garantia de reembolso integral de 7 (sete) dias corridos a partir da data da compra, mediante solicitação por email para <a href="mailto:contato@irisdownloader.com.br" className="text-iris-400 hover:text-iris-300">contato@irisdownloader.com.br</a>.</li>
              <li>Após o período de garantia, não há reembolso proporcional pelo tempo restante de assinatura.</li>
            </ul>
          </section>

          <section>
            <h2>6. Atualizações e Disponibilidade</h2>
            <p>
              A Iris Media poderá lançar atualizações, correções e novas versões do Aplicativo a qualquer
              momento. Usuários com licença ativa têm direito às atualizações conforme o plano contratado.
              A Iris Media não garante disponibilidade ininterrupta e poderá descontinuar versões antigas
              do Aplicativo com aviso prévio de 30 dias.
            </p>
          </section>

          <section>
            <h2>7. Restrições de Uso</h2>
            <p>É proibido ao usuário:</p>
            <ul>
              <li>Fazer engenharia reversa, descompilar ou desmontar o Aplicativo;</li>
              <li>Remover ou alterar avisos de direitos autorais presentes no Aplicativo;</li>
              <li>Utilizar o Aplicativo para fins ilegais ou que violem os Termos de Serviço do Google;</li>
              <li>Contornar mecanismos de validação de licença do Aplicativo.</li>
            </ul>
          </section>

          <section>
            <h2>8. Limitação de Responsabilidade</h2>
            <p>
              O Aplicativo é fornecido "como está". A Iris Media não se responsabiliza por perda de dados,
              danos diretos ou indiretos decorrentes do uso do Aplicativo, interrupções de serviço do
              Google Drive, ou incompatibilidades com versões futuras do macOS.
            </p>
          </section>

          <section>
            <h2>9. Propriedade Intelectual</h2>
            <p>
              O Iris Downloader, sua interface, código-fonte e materiais associados são propriedade
              exclusiva da Iris Media e estão protegidos por leis de direitos autorais. O nome
              "Google Drive" e marcas relacionadas são propriedade da Google LLC, sem qualquer afiliação
              com a Iris Media.
            </p>
          </section>

          <section>
            <h2>10. Alterações nos Termos</h2>
            <p>
              A Iris Media pode atualizar estes Termos a qualquer momento. Alterações relevantes serão
              comunicadas por email ou mediante aviso no Aplicativo. O uso continuado após a notificação
              constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2>11. Legislação Aplicável</h2>
            <p>
              Estes Termos são regidos pela legislação brasileira. Eventuais disputas serão submetidas ao
              foro da comarca de domicílio do consumidor, nos termos do Código de Defesa do Consumidor
              (Lei nº 8.078/1990).
            </p>
          </section>

          <section>
            <h2>12. Contato</h2>
            <p>
              Dúvidas sobre estes Termos:{" "}
              <a href="mailto:contato@irisdownloader.com.br" className="text-iris-400 hover:text-iris-300 transition-colors">
                contato@irisdownloader.com.br
              </a>
            </p>
          </section>

        </div>

        {/* Footer link */}
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#58585F]">© {new Date().getFullYear()} Iris Media. Todos os direitos reservados.</p>
          <Link href="/privacy" className="text-sm text-iris-400 hover:text-iris-300 transition-colors">
            Política de Privacidade →
          </Link>
        </div>
      </div>
    </div>
  );
}
