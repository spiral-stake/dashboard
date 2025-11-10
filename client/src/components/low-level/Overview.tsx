import people from "../../assets/icons/people.svg";
import FlashLeverage from "../../contract-hooks/FlashLeverage";
import { LeveragePosition, Metrics } from "../../types";
import { formatNumber } from "../../utils/formatNumber";
import BtnGreen from "./BtnGreen";
import { HoverInfo } from "./HoverInfo";

const Overview = ({
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
        <img src={people} alt="" className="w-[20px]" />
        <p className="text-[20px]">Overview</p>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-[24px]">
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <p className="lg:hidden text-[14px] text-white opacity-[70%]">
              No. Users
            </p>
            <p className="hidden lg:inline-flex text-[14px] text-white opacity-[70%]">
              No. Users (Wallet Connects)
            </p>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <p className="text-[24px] font-[500]">
            {metrics[metrics.length - 1].userCount}
          </p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <p className="lg:hidden text-[14px] text-white opacity-[70%]">
              Average Deposit
            </p>
            <p className="hidden lg:inline-flex text-[14px] text-white opacity-[70%]">
              Average Deposit Size
            </p>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <p className="text-[24px] font-[500]">
            $
            {formatNumber(
              allLeveragePositions.reduce(
                (total, current) =>
                  total + Number(current.amountDepositedInUsd),
                0
              ) / allLeveragePositions.length
            )}
          </p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] text-white opacity-[70%]">
              Positions Opened
            </p>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <p className="text-[24px] font-[500]">
            {allLeveragePositions.length}
          </p>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] text-white opacity-[70%]">
              Highest Yield Pool
            </p>
            {/* <HoverInfo content={<p>info</p>} /> */}
          </div>
          <div className="flex items-center gap-[8px]">
            <p className="text-[24px] font-[500]">
              {
                flashLeverage.collateralTokens.length > 0
                  ? flashLeverage.collateralTokens.reduce((max, pos) =>
                    Number(pos.defaultLeverageApy) > Number(max.defaultLeverageApy)
                      ? pos
                      : max
                  ).symbol
                  : "-"
              }
            </p>
            <div className="hidden lg:inline-flex text-[#68EA6A]">
              <BtnGreen
                text={`${flashLeverage.collateralTokens.length > 0
                  ? Math.max(
                    ...flashLeverage.collateralTokens.map(
                      (pos) => Number(pos.defaultLeverageApy)
                    )
                  )
                  : 0
                  }% APY`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
