const stats = [
  { value: "2.000+", label: "downloads realizados" },
  { value: "Direto", label: "Drive → Mac" },
  { value: "0", label: "arquivos em nossos servidores" },
  { value: "Apple", label: "Developer ID assinado" },
];

const audiences = ["Designers", "Editores de vídeo", "Videomakers", "Equipes criativas"];

export default function SocialProof() {
  return (
    <section className="border-y border-white/7 bg-[#101018]" aria-label="Confiança e público">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-white/38">
          Feito para quem recebe trabalho por link do Drive
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/68">
          {audiences.map((audience) => (
            <span key={audience} className="before:mr-2 before:text-cyan-300 before:content-['•']">
              {audience}
            </span>
          ))}
        </div>
        <div className="mt-7 grid grid-cols-2 border-t border-white/7 pt-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-white/7 px-2 py-3 text-center even:border-l sm:border-l sm:first:border-l-0">
              <p className="text-xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-[11px] leading-4 text-white/42 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
