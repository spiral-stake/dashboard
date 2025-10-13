import { LeveragePosition } from "../types";
import { calcLeverageApy, calcLeverage } from "../utils";
import { displayTokenAmount } from "../utils/displayTokenAmounts";
import BtnGreen from "./low-level/BtnGreen";

const LeveragePositionCard = ({
  leveragePosition,
}: {
  leveragePosition: LeveragePosition;
}) => {
  return (
    <div className="bg-white bg-opacity-[4%] rounded-xl w-full flex flex-col p-[24px] gap-[24px]">
      <div className="w-full flex items-center justify-between pb-[16px] lg:pb-0 lg:border-none border-b-[1px] border-white border-opacity-[6%]">
        <div className="w-full flex items-center gap-[10px]">
          <div>
            <img
              className="w-[48px]"
              src={`/tokens/${leveragePosition.collateralToken.symbolExtended}.svg`}
              alt=""
            />
          </div>
          <div>
            {" "}
            <div className="text-[24px] font-semibold">
              {`${leveragePosition.collateralToken.symbol.split("-")[1]}`}
            </div>{" "}
          </div>
          <div className="text-[#68EA6A]">
            <BtnGreen
              text={`${leveragePosition.collateralToken.defaultLeverageApy}% APY  (${leveragePosition.collateralToken.maturityDate})`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[auto,auto] gap-y-[14px] grid-rows-2 lg:grid-rows-1 lg:grid-cols-[auto,auto,auto,auto,auto]">
        <div className="col-span-1 flex flex-col gap-[4px] lg:gap-[8px]">
          <div>
            <p className="text-[14px] text-gray-400">LTV</p>
          </div>
          <div className="flex items-center gap-[8px] text-[16px]">
            {leveragePosition.ltv}%<div className="text-xs lg:hidden">LTV</div>
            <div className="text-[14px] text-[#D7D7D7]">
              liq. {leveragePosition.collateralToken.liqLtv}%
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-[4px] lg:gap-[8px]">
          <div>
            <p className="text-[14px] text-gray-400">Maturity</p>
          </div>
          <div className="flex items-center gap-[8px] text-[16px]">
            {`${leveragePosition.collateralToken.maturityDate}`}
            <div className="text-[14px] text-[#D7D7D7]">
              ({leveragePosition.collateralToken.maturityDaysLeft} Days)
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-[4px] lg:gap-[8px]">
          <div>
            <p className="text-[14px] text-gray-400">My position</p>
          </div>
          <div className="flex items-center gap-[8px] text-[16px] truncate">
            <div>{`${displayTokenAmount(leveragePosition.amountCollateral)} 
            ${leveragePosition.collateralToken.symbol}`}</div>
            <div className="text-[14px] text-[#D7D7D7]">
              $
              {displayTokenAmount(
                leveragePosition.amountCollateral.multipliedBy(
                  leveragePosition.collateralToken.valueInUsd
                )
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-[4px] lg:gap-[8px]">
          <div>
            <p className="text-[14px] text-gray-400">Max APY</p>
          </div>
          <div className="flex items-center gap-[8px] text-[16px]">
            {/* Needs to change, this is obsolete, need to calc for the apy and borrow apy of his positions */}
            {calcLeverageApy(
              leveragePosition.collateralToken.impliedApy,
              leveragePosition.collateralToken.borrowApy,
              leveragePosition.ltv
            )}
            %<div className="text-xs lg:hidden">Max APY</div>
            {/* <div className="text-[14px] text-[#D7D7D7]">${displayTokenAmount(leveragePosition.amountYield)}</div> */}
          </div>
        </div>

        {/* <div className="hidden col-span-1 lg:flex flex-col gap-[4px] lg:gap-[8px]">
          <div>
            <p className="text-[14px] text-gray-400">My position</p>
          </div>
          <div className="flex items-center gap-[8px] text-[16px] truncate">
            <div>{`${displayTokenAmount(leveragePosition.amountCollateral)} 
            ${leveragePosition.collateralToken.symbol}`}</div>
            <div className="text-[14px] text-[#D7D7D7]">
              $
              {displayTokenAmount(
                leveragePosition.amountCollateral.multipliedBy(
                  leveragePosition.collateralToken.valueInUsd
                )
              )}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LeveragePositionCard;
