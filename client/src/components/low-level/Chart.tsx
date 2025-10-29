import { useState, useRef, useEffect } from "react";
import { Metrics } from "../../types";
import { formatDate } from "../../utils";
import { formatNumber } from "../../utils/formatNumber";

export default function SmoothPurpleGraph({ metrics }: { metrics: Metrics[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const minTvl = Math.min(...metrics.map((d) => d.tvl));
  const maxTvl = Math.max(...metrics.map((d) => d.tvl));
  const range = maxTvl - minTvl || 1;
  const chartHeight = 200;

  // Convert to coordinate points
  const points = metrics.map((data, i) => ({
    x: (i / (metrics.length - 1)) * width,
    y: chartHeight - 8 - ((data.tvl - minTvl) / range) * (chartHeight - 40),
  }));

  // Generate smooth "wavy" path using Catmull-Rom to cubic Bézier
  const pathData = generateSmoothPath(points);

  return (
    <div
      ref={containerRef}
      className="w-full relative rounded-xl overflow-hidden bg-transparent"
    >
      {/* Info header */}
      <div className="flex justify-between items-center px-[20px] lg:px-[24px]">
        <div className="text-xs sm:text-sm text-gray-400 truncate">
          {selected !== null
            ? formatDate(metrics[selected].createdAt.toString())
            : ""}
        </div>
        <div className="text-base sm:text-lg font-bold text-white">
          {selected !== null
            ? `$${formatNumber(Number(metrics[selected].tvl.toFixed(1)))}`
            : ""}
        </div>
      </div>

      <div className="relative h-40 sm:h-48 w-full">
        {width > 0 && (
          <svg
            className="w-full h-full"
            viewBox={`0 0 ${width} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Fill area */}
            <path
              d={`${pathData} L ${width},${chartHeight} L 0,${chartHeight} Z`}
              fill="url(#purpleFill)"
            />

            {/* Smooth purple line */}
            <path
              d={pathData}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              className="drop-shadow-[0_0_8px_#8b5cf6]"
            />

            {/* Clickable points */}
            {points.map((p, index) => {
              const isSelected = selected === index;
              return (
                <circle
                  key={index}
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 5 : 3}
                  fill={isSelected ? "#fff" : "#8b5cf6"}
                  stroke="#fff"
                  strokeWidth={isSelected ? 2 : 1}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setSelected(index)}
                />
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}

/**
 * Converts an array of points into a smooth cubic Bézier path string
 * using Catmull-Rom spline interpolation.
 */
function generateSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    // Catmull–Rom → cubic Bézier
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return path;
}
