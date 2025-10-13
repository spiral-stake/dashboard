import { Key } from "lucide-react";
import type { leveragePosition } from "../types";
import LeveragePositions from "./LeveragePositions";
import type FlashLeverage from "../contract-hooks/FlashLeverage";

const AllLeverages = ({
  leveragePositions,
  flashLeverage,
}: {
  leveragePositions: leveragePosition[];
  flashLeverage: FlashLeverage;
}) => {
  if (!leveragePositions || leveragePositions.length === 0) return null;
  return (
    <div>
      {leveragePositions
        .filter(
          (leveragePosition) =>
            leveragePosition.positionId.slice(0, 42) !==
            "0x386fB147faDb206fb7Af36438E6ae1f8583f99dd".toLowerCase()
        )
        .map((leveragePosition, index) => (
          <LeveragePositions
            address={leveragePosition.positionId.slice(0, 42)}
            flashLeverage={flashLeverage}
            key={index}
          />
        ))}
    </div>
  );
};

export default AllLeverages;
