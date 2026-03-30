const stats = [
  "2.000+ downloads",
  "macOS 14+ nativo",
  "Google Drive API oficial",
  "Sem coleta de dados",
  "Developer ID assinado",
];

export default function SocialProof() {
  return (
    <div className="border-y border-white/5 py-4">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && (
                <span className="hidden text-[#2a2a35] sm:inline">·</span>
              )}
              <span className="text-sm text-[#58585F]">{stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
