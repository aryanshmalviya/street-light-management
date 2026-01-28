import type { ReactElement } from "react";

type BarDatum = { label: string; value: number; color?: string };

type BarChartProps = {
  data: BarDatum[];
  height?: number;
};

export default function BarChart({ data, height = 140 }: BarChartProps): ReactElement {
  const max = Math.max(...data.map((item) => item.value), 1);
  const barWidth = 100 / data.length;

  return (
    <div className="bar-chart" style={{ height }}>
      <svg viewBox={`0 0 100 ${height}`} role="img" aria-hidden="true">
        {data.map((item, index) => {
          const barHeight = (item.value / max) * (height - 24);
          const x = index * barWidth + 8;
          const y = height - barHeight - 8;
          const width = barWidth - 16;
          return (
            <g key={item.label}>
              <rect
                x={x}
                y={y}
                width={width}
                height={barHeight}
                rx={6}
                fill={item.color ?? "currentColor"}
              />
              <text x={x + width / 2} y={height - 2} textAnchor="middle">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
