const stats = [
  { value: "2.000+", label: "downloads" },
  { value: "macOS 14+", label: "nativo" },
  { value: "API oficial", label: "do Google Drive" },
  { value: "0 dados", label: "coletados" },
  { value: "Developer ID", label: "assinado pela Apple" },
];

export default function SocialProof() {
  return (
    <div className="border-y border-white/5 py-6">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-base font-bold text-white sm:text-lg">{stat.value}</span>
              <span className="text-[11px] text-[#9F9FA3] sm:text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
