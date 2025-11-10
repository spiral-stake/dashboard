import growth from "../../assets/icons/growth.svg";
import FlashLeverage from "../../contract-hooks/FlashLeverage";
import { LeveragePosition, Metrics } from "../../types";
import { formatNumber } from "../../utils/formatNumber";
import { HoverInfo } from "./HoverInfo";

const YieldAnalytics = ({
  metrics,
  allLeveragePositions,
  flashLeverage,
}: {
  metrics: Metrics[];
  allLeveragePositions: LeveragePosition[];
  flashLeverage: FlashLeverage;
}) => {
  return (
    <div className="w-full flex flex-col gap-[24px] bg-white bg-opacity-[4%] border-[1px] border-white border-opacity-[6%] p-[20px] lg:p-[24px] rounded-[16px]">
      <div className="flex items-center pb-[12px] gap-[8px] border-b-[1px] border-white border-opacity-[12%]">
        <img src={growth} alt="" className="w-[20px]" />
        <p className="text-[20px]">Yield Analytics</p>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] text-white opacity-[70%]">Average APY</p>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <p className="text-[24px] font-[500]">
            {`${(
              allLeveragePositions.reduce(
                (total, pos) => total + Number(pos.leverageApy),
                0
              ) / allLeveragePositions.length
            ).toFixed(2)}%`}
          </p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] text-white opacity-[70%]">
              Weighted Avg APY
            </p>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <p className="text-[24px] font-[500]">
            {`${(
              (allLeveragePositions.reduce(
                (total, pos) =>
                  total +
                  (Number(pos.leverageApy) / 100) *
                    Number(pos.amountDepositedInUsd),
                0
              ) /
                allLeveragePositions.reduce(
                  (total, pos) => total + Number(pos.amountDepositedInUsd),
                  0
                )) *
              100
            ).toFixed(2)}%`}
          </p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] text-white opacity-[70%]">
              Projected Yield (30D)
            </p>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <p className="text-[24px] font-[500]">{`$${formatNumber(
            (((allLeveragePositions.reduce(
              (total, pos) =>
                total +
                (Number(pos.leverageApy) / 100) *
                  Number(pos.amountDepositedInUsd),
              0
            ) /
              allLeveragePositions.reduce(
                (total, pos) => total + Number(pos.amountDepositedInUsd),
                0
              )) *
              100) /
              100) *
              allLeveragePositions.reduce(
                (total, pos) => total + Number(pos.amountDepositedInUsd),
                0
              ) *
              (30 / 365)
          )}`}</p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] text-white opacity-[70%]">
              Projected Revenue (30D)
            </p>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <p className="text-[24px] font-[500]">
            $
            {(
              (10 / 100) *
              ((((allLeveragePositions.reduce(
                (total, pos) =>
                  total +
                  (Number(pos.leverageApy) / 100) *
                    Number(pos.amountDepositedInUsd),
                0
              ) /
                allLeveragePositions.reduce(
                  (total, pos) => total + Number(pos.amountDepositedInUsd),
                  0
                )) *
                100) /
                100) *
                allLeveragePositions.reduce(
                  (total, pos) => total + Number(pos.amountDepositedInUsd),
                  0
                ) *
                (30 / 365))
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default YieldAnalytics;
