import { TrendingUp } from "lucide-react";
import chart from "../assets/newChart.svg";
import type { LeveragePosition, Metrics } from "../types";
import { formatNumber } from "../utils/formatNumber";
import { HoverInfo } from "./low-level/HoverInfo";
import { calcLeverage } from "../utils";
import SmoothPurpleGraph from "./low-level/Chart";

const TvlChart = ({
  metrics,
  allLeveragePositions,
}: {
  metrics: Metrics[];
  allLeveragePositions: LeveragePosition[];
}) => {
  if (!metrics || metrics.length === 0) return null;

  const maxTvl = Math.max(...metrics.map((d) => d.tvl));
  const minTvl = Math.min(...metrics.map((d) => d.tvl));
  const range = maxTvl - minTvl || 1; // Avoid division by zero

  return (
    <div className="bg-white bg-opacity-[4%] border-[1px] border-white border-opacity-[6%]  rounded-[16px]">
      <div className="flex items-center gap-[64px]">
        <div className="flex flex-col p-[24px]">
          <div className="flex items-center gap-[4px]">
            <h3 className="text-[14px] font-[400] text-white opacity-[50%]">
              Total Deposits (TVL)
            </h3>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <div>
            <span className="text-[32px] font-[500]">
              $
              {formatNumber(
                allLeveragePositions.reduce(
                  (total, current) =>
                    current.open
                      ? total + Number(current.amountDepositedInUsd)
                      : total,
                  0
                )
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-col p-[24px]">
          <div className="flex items-center gap-[4px]">
            <h3 className="text-[14px] font-[400] text-white opacity-[50%]">
              Open Interest (TVM)
            </h3>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <div>
            <span className="text-[32px] font-[500]">
              $
              {formatNumber(
                (allLeveragePositions.reduce(
                  (total, pos) =>
                    pos.open
                      ? total +
                      Number(calcLeverage(pos.ltv)) *
                      Number(pos.amountDepositedInUsd)
                      : total,
                  0
                ) /
                  allLeveragePositions.reduce(
                    (total, pos) =>
                      pos.open
                        ? total + Number(pos.amountDepositedInUsd)
                        : total,
                    0
                  )) *
                allLeveragePositions.reduce(
                  (total, current) =>
                    current.open
                      ? total + Number(current.amountDepositedInUsd)
                      : total,
                  0
                )
              )}
            </span>
          </div>
        </div>
      </div>

      {/* <div className="relative h-48 mt-4">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * 48}
              x2="400"
              y2={i * 48}
              stroke=""
              strokeWidth="1"
            />
          ))}

        
          <path
            d={metrics
              .map((data, index) => {
                const x = (index / (metrics.length - 1)) * 400;
                const y = 192 - ((data.tvl - minTvl) / range) * 160;
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {metrics.map((data, index) => {
            const x = (index / (metrics.length - 1)) * 400;
            const y = 192 - ((data.tvl - minTvl) / range) * 160;
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

          
          <defs>
            <linearGradient
              id="greenGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div> */}

      {/* chart functional */}

      {/* <div>
        <SmoothPurpleGraph metrics={metrics} />
      </div> */}

      {/* chart image */}

      {/* <div className="w-full">
        <img src={chart} alt="" className="w-full" />
      </div> */}
    </div>
  );
};

export default TvlChart;
