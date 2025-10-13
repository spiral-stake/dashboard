import axios from "axios";
import { useState, useEffect } from "react";
import type FlashLeverage from "../contract-hooks/FlashLeverage";
import { LeveragePosition } from "../types";
import LeveragePositionCard from "./LeveragePositionCard";

const LeveragePositions = ({
  flashLeverage,
  address,
}: {
  flashLeverage: FlashLeverage;
  address: string;
}) => {
  const [userLevragePositions, setUserLeveragePositions] = useState<
    LeveragePosition[]
  >([]);

  useEffect(() => {
    async function getUserPositions() {
      if (!address) return;

      if (flashLeverage) {
        let [_leveragePositions] = await Promise.all([
          flashLeverage.getUserLeveragePositions(address),
        ]);

        // // Example: filter positions belonging to the user
        // let userLeveragePositions = {}

        // allLeveragePositions.filter(
        //   pos => pos.positionId.startsWith(address.toLowerCase())
        // ).forEach((pos) => {
        //   const positionId = pos.positionId.slice(42);

        //   userLeveragePositions[positionId] = pos;
        // })

        // _leveragePositions.map((pos) => {
        //   pos.impliedApy = userLeveragePositions[pos.id].atImpliedApy;
        // })

        setUserLeveragePositions(_leveragePositions);
      }
    }

    getUserPositions();
  }, [flashLeverage]);

  return (
    <div>
      {userLevragePositions.map(
        (leveragePosition: LeveragePosition, index: number) => (
          <LeveragePositionCard
            key={index}
            leveragePosition={leveragePosition}
          />
        )
      )}
    </div>
  );
};

export default LeveragePositions;
