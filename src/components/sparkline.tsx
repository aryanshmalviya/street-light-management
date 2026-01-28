import type { ReactElement } from "react";

type SparklineProps = {
  data: number[];
  stroke?: string;
};

const toPoints = (data: number[]) => {
  if (data.length === 0) return "";
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const step = 100 / (data.length - 1 || 1);

  return data
    .map((value, index) => {
      const x = index * step;
      const y = 30 - ((value - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(" ");
};

export default function Sparkline({ data, stroke = "currentColor" }: SparklineProps): ReactElement {
  const points = toPoints(data);

  return (
    <svg viewBox="0 0 100 32" role="img" aria-hidden="true" className="sparkline">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
