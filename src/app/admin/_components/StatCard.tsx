type Color = "default" | "green" | "amber" | "red" | "iris";

const colorMap: Record<Color, string> = {
  default: "text-white",
  green: "text-green-400",
  amber: "text-amber-400",
  red: "text-red-400",
  iris: "text-iris-400",
};

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: Color;
}

export default function StatCard({ label, value, sub, color = "default" }: Props) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#19191E] p-4">
      <p className="text-xs text-[#58585F]">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[#9F9FA3]">{sub}</p>}
    </div>
  );
}
