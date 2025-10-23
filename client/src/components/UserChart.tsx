import { Users } from "lucide-react";
import type { Metrics } from "../types";

const UsersChart = ({ metrics }: { metrics: Metrics[] }) => {
  if (!metrics || metrics.length === 0) return null;


  const maxUsers = Math.max(...metrics.map((d) => d.userCount));
  const minUsers = Math.min(...metrics.map((d) => d.userCount));
  const range = maxUsers - minUsers || 1; // Prevent division by zero

  return (
    <div className="rounded-xl shadow-lg p-6 py-10 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Number of Users</h3>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span className="text-2xl font-bold">
            {metrics[metrics.length - 1].userCount}
          </span>
        </div>
      </div>

      <div className="relative h-48 mt-4">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Line path */}
          <path
            d={metrics
              .map((data, index) => {
                const x = (index / (metrics.length - 1)) * 400;
                const y = 192 - ((data.userCount - minUsers) / range) * 160;
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {metrics.map((data, index) => {
            const x = (index / (metrics.length - 1)) * 400;
            const y = 192 - ((data.userCount - minUsers) / range) * 160;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#fff"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default UsersChart;
