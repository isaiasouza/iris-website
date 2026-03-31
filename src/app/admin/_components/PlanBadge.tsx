export default function PlanBadge({ plan }: { plan: string }) {
  if (plan === "lifetime") {
    return (
      <span className="rounded-full border border-amber-500/25 bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-300">
        Vitalício
      </span>
    );
  }
  return (
    <span className="rounded-full border border-iris-500/25 bg-iris-700/20 px-2.5 py-0.5 text-xs font-medium text-iris-300">
      Anual
    </span>
  );
}
