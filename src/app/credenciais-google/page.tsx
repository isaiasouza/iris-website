import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Usar credenciais próprias do Google — Iris Downloader",
  description:
    "Como conectar o Iris Downloader ao seu Google Drive usando um projeto seu no Google Cloud.",
};

const linkClass = "text-iris-400 transition-colors hover:text-iris-300";

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

export default function CustomGoogleCredentialsPage() {
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
        <p className="text-xs font-semibold uppercase tracking-widest text-iris-400">Guia avançado</p>
        <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
          Usar credenciais próprias do Google
        </h1>
        <p className="mt-3 text-sm text-[#58585F]">Leva cerca de 10 minutos</p>

        <div className="mt-12 space-y-10 text-[#9F9FA3] [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_p]:leading-relaxed [&_ol]:mt-3 [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol_li]:list-decimal [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul_li]:list-disc [&_code]:rounded [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:text-white">

          <section>
            <h2>Você provavelmente não precisa disto</h2>
            <p>
              Por padrão, o Iris Downloader se conecta ao Google Drive com as credenciais do
              próprio app: você clica em <strong className="text-white">Entrar com Google</strong> e
              pronto. Este guia é para quem prefere que o app use um projeto do Google Cloud que
              pertence a você.
            </p>
            <p className="mt-3">
              Com credenciais próprias, a autorização de acesso ao seu Drive é concedida ao
              <em> seu</em> projeto. Você é o único usuário dele, e ele não depende da verificação
              do app pelo Google.
            </p>
          </section>

          <section>
            <h2>1. Criar o projeto</h2>
            <ol>
              <li>
                Abra o <External href="https://console.cloud.google.com/projectcreate">Google Cloud Console</External> com
                a sua conta Google.
              </li>
              <li>Dê um nome ao projeto (por exemplo, <code>Iris pessoal</code>) e clique em <strong className="text-white">Criar</strong>.</li>
              <li>
                Com o projeto novo selecionado no topo da página, abra a{" "}
                <External href="https://console.cloud.google.com/apis/library/drive.googleapis.com">Google Drive API</External>{" "}
                e clique em <strong className="text-white">Ativar</strong>.
              </li>
            </ol>
          </section>

          <section>
            <h2>2. Configurar a tela de permissão</h2>
            <ol>
              <li>
                Abra o <External href="https://console.cloud.google.com/auth/overview">Google Auth Platform</External> e
                clique em <strong className="text-white">Vamos começar</strong>.
              </li>
              <li>Informe um nome para o app e escolha o seu e-mail como e-mail de suporte.</li>
              <li>Em <strong className="text-white">Público</strong>, escolha <strong className="text-white">Externo</strong>.</li>
              <li>Informe o seu e-mail como contato, aceite a política de dados do Google e clique em <strong className="text-white">Criar</strong>.</li>
              <li>
                Em <strong className="text-white">Público-alvo → Usuários de teste</strong>, clique em
                <strong className="text-white"> Add users</strong>, adicione o e-mail da conta Google que você vai
                conectar no app e salve.
              </li>
              <li>
                Em <strong className="text-white">Acesso a dados</strong>, clique em
                <strong className="text-white"> Adicionar ou remover escopos</strong>, cole os três escopos abaixo no
                campo de adição manual, clique em <strong className="text-white">Adicionar à tabela</strong>,
                depois em <strong className="text-white">Atualizar</strong> e em <strong className="text-white">Save</strong>:
                <ul>
                  <li><code>https://www.googleapis.com/auth/drive</code></li>
                  <li><code>https://www.googleapis.com/auth/userinfo.email</code></li>
                  <li><code>https://www.googleapis.com/auth/userinfo.profile</code></li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2>3. Criar as credenciais</h2>
            <ol>
              <li>
                Em <strong className="text-white">Clientes</strong>, clique em <strong className="text-white">Criar cliente</strong>.
              </li>
              <li>
                Em <strong className="text-white">Tipo de aplicativo</strong>, escolha{" "}
                <strong className="text-white">App para computador</strong> e clique em <strong className="text-white">Criar</strong>.
              </li>
              <li>
                Copie o <strong className="text-white">ID do cliente</strong> e a{" "}
                <strong className="text-white">Chave secreta do cliente</strong>.
              </li>
            </ol>
            <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
              Copie a chave secreta antes de fechar a janela. O Google não mostra esse valor de
              novo depois. Se perder, crie outro cliente.
            </p>
          </section>

          <section>
            <h2>4. Usar no Iris Downloader</h2>
            <ol>
              <li>
                No app, abra <strong className="text-white">Configurações</strong> (⌘,) →{" "}
                <strong className="text-white">Conta</strong> e role até{" "}
                <strong className="text-white">Credenciais do Google (avançado)</strong>.
              </li>
              <li>
                Cole o ID do cliente e a chave secreta e clique em{" "}
                <strong className="text-white">Usar estas credenciais</strong>.
              </li>
              <li>
                Confirme. As contas conectadas são desconectadas, porque uma autorização dada a um
                projeto não vale para outro. Nenhum arquivo é afetado.
              </li>
              <li>
                Entre com o Google de novo. A tela de permissão vai mostrar o nome do{" "}
                <em>seu</em> projeto. Isso confirma que deu certo.
              </li>
            </ol>
            <p className="mt-3">
              O Google vai avisar que <strong className="text-white">não verificou este app</strong>. É
              esperado: o app em questão é o seu próprio projeto. Clique em{" "}
              <strong className="text-white">Avançado</strong> e depois em{" "}
              <strong className="text-white">Continuar</strong>.
            </p>
          </section>

          <section>
            <h2>5. Evitar pedir login toda semana</h2>
            <p>
              Enquanto o projeto estiver no modo <strong className="text-white">Testando</strong>, o
              Google só aceita os e-mails cadastrados como usuários de teste e encerra a autorização
              a cada 7 dias. Publicar o projeto resolve as duas coisas.
            </p>
            <ol>
              <li>
                Em <strong className="text-white">Branding</strong>, preencha a{" "}
                <strong className="text-white">página inicial</strong>, o link da{" "}
                <strong className="text-white">política de privacidade</strong> e o dos{" "}
                <strong className="text-white">termos de serviço</strong>. Depois, em{" "}
                <strong className="text-white">Domínios autorizados</strong>, adicione o domínio
                desses endereços e salve. Sem isso o Google não libera a publicação.
              </li>
              <li>
                Em <strong className="text-white">Público-alvo</strong>, clique em{" "}
                <strong className="text-white">Publicar app</strong> e confirme.
              </li>
            </ol>
            <p className="mt-3">
              Publicar não expõe nada: o projeto continua sendo só seu, e o aviso de app não
              verificado continua aparecendo apenas para você.
            </p>
          </section>

          <section>
            <h2>Voltar ao padrão</h2>
            <p>
              Em <strong className="text-white">Configurações → Conta</strong>, clique em{" "}
              <strong className="text-white">Voltar a usar as credenciais do app</strong> e entre com o
              Google de novo.
            </p>
          </section>

          <section>
            <h2>Privacidade</h2>
            <p>
              O ID do cliente e a chave secreta ficam guardados no Keychain do seu Mac. Eles não são
              enviados para os servidores da Iris Media. Os arquivos continuam trafegando direto
              entre o seu Mac e o Google, como descrito na{" "}
              <Link href="/privacy" className={linkClass}>Política de Privacidade</Link>.
            </p>
          </section>

          <section>
            <h2>Precisa de ajuda?</h2>
            <p>
              Escreva para{" "}
              <a href="mailto:contato@irisdownloader.com.br" className={linkClass}>
                contato@irisdownloader.com.br
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
