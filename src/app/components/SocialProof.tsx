const stats = [
  { value: "2.000+", label: "downloads realizados" },
  { value: "Direto", label: "do Drive para o Mac" },
  { value: "0", label: "arquivos em nossos servidores" },
  { value: "Apple", label: "Developer ID assinado" },
];

const audiences = ["Designers", "Editores de vídeo", "Videomakers", "Fotógrafos", "Equipes criativas", "Coloristas", "Produtoras"];

export default function SocialProof() {
  return (
    <section className="relative pb-16 pt-12 sm:pb-20" aria-label="Confiança e público">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-sm text-brand-muted">Feito para quem recebe trabalho por link do Drive</p>

        <div className="mt-5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <ul className="iris-marquee flex w-max gap-3" aria-label="Público">
            {[...audiences, ...audiences].map((audience, i) => (
              <li
                key={`${audience}-${i}`}
                aria-hidden={i >= audiences.length}
                className="whitespace-nowrap rounded-full bg-white/[0.03] px-4 py-1.5 text-sm text-brand-text-2 ring-1 ring-inset ring-white/[0.08]"
              >
                {audience}
              </li>
            ))}
          </ul>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.06] sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse bg-brand-surface px-4 py-6 text-center sm:py-7">
              <dt className="mt-1.5 text-xs leading-5 text-brand-muted sm:text-sm">{stat.label}</dt>
              <dd className="font-display text-2xl font-bold text-white sm:text-[30px]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
