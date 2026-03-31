const styles: Record<string, string> = {
  active: "bg-green-500/15 text-green-400 border border-green-500/25",
  suspended: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  cancelled: "bg-red-500/15 text-red-400 border border-red-500/25",
  expired: "bg-red-500/15 text-red-400 border border-red-500/25",
};

const labels: Record<string, string> = {
  active: "Ativa",
  suspended: "Suspensa",
  cancelled: "Cancelada",
  expired: "Expirada",
};

export default function LicenseStatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-white/10 text-white/50"}`}>
      {labels[status] ?? status}
    </span>
  );
}
