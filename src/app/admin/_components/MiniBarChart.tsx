"use client";

interface DataPoint {
  day: string;
  annual: number;
  lifetime: number;
}

export default function MiniBarChart({ data }: { data: DataPoint[] }) {
  const maxVal = Math.max(...data.map((d) => d.annual + d.lifetime), 1);
  const H = 80;
  const barW = 14;
  const gap = 4;
  const totalW = data.length * (barW + gap);

  return (
    <div className="overflow-x-auto">
      <svg width={totalW} height={H + 20} className="min-w-full">
        {data.map((d, i) => {
          const total = d.annual + d.lifetime;
          const totalH = (total / maxVal) * H;
          const annualH = (d.annual / maxVal) * H;
          const lifetimeH = (d.lifetime / maxVal) * H;
          const x = i * (barW + gap);
          const label = d.day.slice(5); // MM-DD

          return (
            <g key={d.day}>
              <title>{`${d.day}: ${d.annual} anual, ${d.lifetime} vitalício`}</title>
              {/* Annual bar (bottom) */}
              {d.annual > 0 && (
                <rect
                  x={x}
                  y={H - annualH}
                  width={barW}
                  height={annualH}
                  rx={2}
                  className="fill-iris-600/70"
                />
              )}
              {/* Lifetime bar (top) */}
              {d.lifetime > 0 && (
                <rect
                  x={x}
                  y={H - totalH}
                  width={barW}
                  height={lifetimeH}
                  rx={2}
                  className="fill-amber-400/70"
                />
              )}
              {/* Empty bar placeholder */}
              {total === 0 && (
                <rect
                  x={x}
                  y={H - 2}
                  width={barW}
                  height={2}
                  rx={1}
                  className="fill-white/5"
                />
              )}
              {/* Day label every 5 days */}
              {i % 5 === 0 && (
                <text
                  x={x + barW / 2}
                  y={H + 14}
                  textAnchor="middle"
                  className="fill-[#58585F] text-[9px]"
                  style={{ fontSize: 9 }}
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs text-[#9F9FA3]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm bg-iris-600/70" />
          Anual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-3 rounded-sm bg-amber-400/70" />
          Vitalício
        </span>
      </div>
    </div>
  );
}
