import { useState } from "react";
import { Metrics } from "../../types";
import { formatDate, getMaturityDate } from "../../utils";
import { getLocalTimeFromTimestamp } from "../../utils/time";
import { formatNumber } from "../../utils/formatNumber";

export default function SmoothPurpleGraph({ metrics }: { metrics: Metrics[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const minTvl = Math.min(...metrics.map((d) => d.tvl));
  const maxTvl = Math.max(...metrics.map((d) => d.tvl));
  const range = maxTvl - minTvl || 1;

  // Create a smooth curved path
  const pathData = metrics
    .map((data, i) => {
      const x = (i / (metrics.length - 1)) * 400;
      const y = 192 - ((data.tvl - minTvl) / range) * 160;
      if (i === 0) return `M ${x},${y}`;
      const prev = metrics[i - 1];
      const prevX = ((i - 1) / (metrics.length - 1)) * 400;
      const prevY = 192 - ((prev.tvl - minTvl) / range) * 160;
      const midX = (prevX + x) / 2;
      return `Q ${midX},${prevY} ${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative mt-6 rounded-xl overflow-hidden bg-gradient-to-b from-[#1e1b4b] to-[#211c52] p-4">
      {/* Selected info display */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400">
          {selected !== null ? formatDate((metrics[selected].createdAt).toString()) : ""}
        </div>
        <div className="text-lg font-bold text-white">
          {selected !== null ? `$${formatNumber(Number(metrics[selected].tvl.toFixed(1)))}` : ""}
        </div>
      </div>

      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fill area under line */}
          <path
            d={`${pathData} L 400,200 L 0,200 Z`}
            fill="url(#purpleFill)"
            stroke="none"
          />

          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_#8b5cf6]"
          />

          {/* Data points */}
          {metrics.map((data, index) => {
            const x = (index / (metrics.length - 1)) * 400;
            const y = 192 - ((data.tvl - minTvl) / range) * 160;
            const isSelected = selected === index;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={isSelected ? 5 : 3}
                fill={isSelected ? "#fff" : "#8b5cf6"}
                stroke="#fff"
                strokeWidth={isSelected ? 2 : 1}
                className="cursor-pointer transition-all"
                onClick={() => setSelected(index)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
