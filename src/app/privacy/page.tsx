import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — Iris Downloader",
  description: "Política de privacidade do Iris Downloader. Saiba como tratamos seus dados.",
};

export default function PrivacyPage() {
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
        <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">Política de Privacidade</h1>
        <p className="mt-3 text-sm text-[#58585F]">Última atualização: 30 de março de 2026</p>

        <div className="mt-12 space-y-10 text-[#9F9FA3] [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul_li]:list-disc [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:text-white [&_th]:pb-2 [&_td]:py-2 [&_td]:align-top [&_tr]:border-b [&_tr]:border-white/5">

          <section>
            <h2>1. Quem somos</h2>
            <p>
              A <strong className="text-white">Iris Media</strong> é responsável pelo aplicativo Iris Downloader
              e pelo site irisdownloader.com.br. Esta Política descreve como coletamos, usamos e protegemos
              suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
            <p className="mt-3">
              Contato do encarregado de dados:{" "}
              <a href="mailto:contato@irisdownloader.com.br" className="text-iris-400 hover:text-iris-300 transition-colors">
                contato@irisdownloader.com.br
              </a>
            </p>
          </section>

          <section>
            <h2>2. Dados que coletamos</h2>

            <p className="mb-4 font-semibold text-white text-sm">2.1 No site (irisdownloader.com.br)</p>
            <table>
              <thead>
                <tr>
                  <th>Dado</th>
                  <th>Finalidade</th>
                  <th>Base legal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nome e email</td>
                  <td>Emissão e entrega da licença de uso</td>
                  <td>Execução de contrato</td>
                </tr>
                <tr>
                  <td>Dados de pagamento</td>
                  <td>Processamento financeiro (via Stripe/Cakto/Asaas)</td>
                  <td>Execução de contrato</td>
                </tr>
                <tr>
                  <td>Identificador de dispositivo (hardware ID)</td>
                  <td>Controle de dispositivos autorizados pela licença</td>
                  <td>Legítimo interesse / contrato</td>
                </tr>
              </tbody>
            </table>

            <p className="mt-6 mb-4 font-semibold text-white text-sm">2.2 No Aplicativo (macOS)</p>
            <ul>
              <li>O Aplicativo <strong className="text-white">não coleta nem transmite</strong> arquivos do Google Drive para servidores da Iris Media. Todas as operações ocorrem diretamente entre o Mac do usuário e os servidores do Google.</li>
              <li>Credenciais OAuth do Google são armazenadas exclusivamente no <strong className="text-white">Keychain do macOS</strong>, sem acesso pela Iris Media.</li>
              <li>A chave de licença é validada em nossos servidores apenas no momento de ativação e periodicamente para verificar o status.</li>
            </ul>
          </section>

          <section>
            <h2>3. Como usamos seus dados</h2>
            <ul>
              <li>Emitir, ativar e gerenciar sua licença de uso;</li>
              <li>Enviar confirmações de compra e informações sobre sua licença;</li>
              <li>Processar renovações, reembolsos e cancelamentos;</li>
              <li>Notificar sobre atualizações importantes do Aplicativo;</li>
              <li>Prevenir uso fraudulento de licenças.</li>
            </ul>
            <p className="mt-3">
              Não utilizamos seus dados para publicidade de terceiros, nem vendemos ou alugamos
              informações pessoais a nenhuma empresa.
            </p>
          </section>

          <section>
            <h2>4. Compartilhamento de dados</h2>
            <p>Seus dados podem ser compartilhados com:</p>
            <ul>
              <li><strong className="text-white">Processadores de pagamento</strong> (Stripe, Cakto, Asaas) — para processar transações financeiras, sob seus próprios termos e políticas;</li>
              <li><strong className="text-white">Supabase</strong> — banco de dados onde licenças são armazenadas, hospedado em infraestrutura segura;</li>
              <li><strong className="text-white">Resend</strong> — plataforma de envio de email transacional;</li>
              <li><strong className="text-white">Google LLC</strong> — para autenticação OAuth e acesso ao Google Drive, conforme autorização explícita do usuário.</li>
            </ul>
            <p className="mt-3">
              Todos os fornecedores acima são subprocessadores que tratam dados sob contrato e em
              conformidade com regulamentações de proteção de dados aplicáveis.
            </p>
          </section>

          <section>
            <h2>5. Retenção de dados</h2>
            <ul>
              <li><strong className="text-white">Dados de licença:</strong> mantidos enquanto a licença estiver ativa e por até 5 anos após o encerramento, para fins fiscais e legais;</li>
              <li><strong className="text-white">Dados de pagamento:</strong> retidos conforme exigência legal (5 anos) e pelas políticas dos processadores de pagamento;</li>
              <li><strong className="text-white">Emails transacionais:</strong> logs mantidos por até 12 meses.</li>
            </ul>
          </section>

          <section>
            <h2>6. Seus direitos (LGPD)</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul>
              <li><strong className="text-white">Acesso:</strong> saber quais dados temos sobre você;</li>
              <li><strong className="text-white">Correção:</strong> corrigir dados incompletos ou desatualizados;</li>
              <li><strong className="text-white">Exclusão:</strong> solicitar a exclusão dos seus dados pessoais (exceto onde há obrigação legal de retenção);</li>
              <li><strong className="text-white">Portabilidade:</strong> receber seus dados em formato estruturado;</li>
              <li><strong className="text-white">Revogação de consentimento:</strong> revogar o acesso do Aplicativo ao seu Google Drive a qualquer momento em <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener" className="text-iris-400 hover:text-iris-300 transition-colors">myaccount.google.com/permissions</a>.</li>
            </ul>
            <p className="mt-3">
              Para exercer esses direitos, entre em contato em{" "}
              <a href="mailto:contato@irisdownloader.com.br" className="text-iris-400 hover:text-iris-300 transition-colors">
                contato@irisdownloader.com.br
              </a>. Respondemos em até 15 dias úteis.
            </p>
          </section>

          <section>
            <h2>7. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
            </p>
            <ul>
              <li>Comunicações via HTTPS/TLS;</li>
              <li>Credenciais OAuth armazenadas no Keychain criptografado do macOS;</li>
              <li>Banco de dados com Row Level Security (RLS) habilitado;</li>
              <li>Acesso administrativo restrito e com autenticação.</li>
            </ul>
          </section>

          <section>
            <h2>8. Cookies e rastreamento</h2>
            <p>
              O site irisdownloader.com.br é uma aplicação estática e não utiliza cookies de
              rastreamento, pixels de remarketing ou ferramentas de analytics de terceiros.
              O Aplicativo macOS não coleta dados analíticos ou de telemetria.
            </p>
          </section>

          <section>
            <h2>9. Menores de idade</h2>
            <p>
              O Iris Downloader não é direcionado a menores de 18 anos. Não coletamos intencionalmente
              dados de menores. Se identificarmos que coletamos dados de um menor sem consentimento dos
              responsáveis, excluiremos essas informações imediatamente.
            </p>
          </section>

          <section>
            <h2>10. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política periodicamente. A data de "Última atualização" no topo
              indica quando ocorreu a revisão mais recente. Alterações significativas serão comunicadas
              por email aos titulares de licença ativa.
            </p>
          </section>

          <section>
            <h2>11. Contato e reclamações</h2>
            <p>
              Para questões de privacidade:{" "}
              <a href="mailto:contato@irisdownloader.com.br" className="text-iris-400 hover:text-iris-300 transition-colors">
                contato@irisdownloader.com.br
              </a>
            </p>
            <p className="mt-3">
              Caso não obtenha resposta satisfatória, você pode registrar reclamação junto à
              Autoridade Nacional de Proteção de Dados (ANPD) em{" "}
              <a href="https://www.gov.br/anpd" target="_blank" rel="noopener" className="text-iris-400 hover:text-iris-300 transition-colors">
                gov.br/anpd
              </a>.
            </p>
          </section>

        </div>

        {/* Footer link */}
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#58585F]">© {new Date().getFullYear()} Iris Media. Todos os direitos reservados.</p>
          <Link href="/terms" className="text-sm text-iris-400 hover:text-iris-300 transition-colors">
            Termos de Uso →
          </Link>
        </div>
      </div>
    </div>
  );
}
