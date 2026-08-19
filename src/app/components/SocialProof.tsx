const stats = [
  { value: "2.000+", label: "downloads realizados" },
  { value: "Direto", label: "Drive → Mac" },
  { value: "0", label: "arquivos em nossos servidores" },
  { value: "Apple", label: "Developer ID assinado" },
];

const audiences = ["Designers", "Editores de vídeo", "Videomakers", "Equipes criativas"];

export default function SocialProof() {
  return (
    <section className="border-b border-[#404040] bg-[#1f1f1f]" aria-label="Confiança e público">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
        <p className="text-center font-mono text-[10px] font-medium uppercase text-neutral-500">
          Feito para quem recebe trabalho por link do Drive
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-neutral-300">
          {audiences.map((audience) => (
            <span key={audience} className="before:mr-2 before:text-blue-400 before:content-['•']">
              {audience}
            </span>
          ))}
        </div>
        <div className="mt-7 grid grid-cols-2 border-t border-[#404040] pt-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-[#404040] px-2 py-3 text-center even:border-l sm:border-l sm:first:border-l-0">
              <p className="font-mono text-xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-[11px] leading-4 text-neutral-500 sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
