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
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className="text-lg font-bold text-white">{stat.value}</span>
              <span className="text-xs text-[#9F9FA3]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
