import { useEffect, useMemo, useState } from "react";
import FlashLeverage from "./contract-hooks/FlashLeverage";
import { useChainId } from "wagmi";
import UsersChart from "./components/UserChart";
import TvlChart from "./components/TvlChart";
import axios, { all } from "axios";
import type { Metrics, LeveragePosition, ServerLeveragePosition } from "./types/index";
import LeveragePositionCard from "./components/LeveragePositionCard";
import { updatePositionsData } from "./utils/updatePositionsData";
import { isMatured } from "./utils";
import PageTitle from "./components/low-level/PageTitle";
import Loader from "./components/low-level/Loader";

const devTeamWallet = "0x386fB147faDb206fb7Af36438E6ae1f8583f99dd".toLowerCase();

function App() {
  const [flashLeverage, setFlashLeverage] = useState<FlashLeverage>();
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [allLeveragePositions, setAllLeveragePositions] = useState<LeveragePosition[]>([]);

  const appChainId = useChainId();

  useEffect(() => {
    /**
     * @dev on appChainId change, reset the collateralTokens and positionManager according to the chain
     */
    async function handleChainChange() {
      const [_flashLeverage] = await Promise.all([FlashLeverage.createInstance(appChainId)]);
      setFlashLeverage(_flashLeverage);
    }

    handleChainChange();
  }, [appChainId]);

  useEffect(() => {
    if (!flashLeverage) return;

    const fetchData = async () => {
      try {
        const { serverLeveragePositions, metrics } = await fetchServerData();
        setMetrics(metrics);

        // derive user addresses
        const userAddresses = getUniqueUsers(serverLeveragePositions);

        // batch fetch all users' leverage data in parallel
        const leverageResults = await Promise.all(
          userAddresses.map(async (address) => {
            try {
              const userPositions = await flashLeverage.getUserLeveragePositions(address);
              return updatePositionsData(serverLeveragePositions, address, userPositions);
            } catch (err) {
              console.warn(`Failed fetching positions for ${address}:`, err);
              return [];
            }
          })
        );

        // flatten once
        const merged = leverageResults.flat();
        setAllLeveragePositions(merged);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    // small debounce (prevents multiple trigger loops)
    const timeout = setTimeout(fetchData, 200);
    return () => clearTimeout(timeout);
  }, [flashLeverage]);

  // ---- Helpers ----
  const fetchServerData = async () => {
    const baseUrl =
      import.meta.env.VITE_ENV === "prod" ? "https://api.spiralstake.xyz" : "http://localhost:5000";

    const [levRes, metricsRes] = await Promise.all([
      axios.get(`${baseUrl}/leveragePositions`),
      axios.get(`${baseUrl}/metrics`),
    ]);

    return {
      serverLeveragePositions: levRes.data as ServerLeveragePosition[],
      metrics: metricsRes.data as Metrics[],
    };
  };

  const getUniqueUsers = (positions: any[]): string[] => {
    const addresses: Record<string, boolean> = {};
    for (const p of positions) {
      const addr = p.positionId.slice(0, 42).toLowerCase();
      if (addr === devTeamWallet) continue;
      addresses[addr] = true;
    }
    return Object.keys(addresses);
  };

  // ---- Categorize positions ----
  const categorizedPositions = useMemo(() => {
    const open: LeveragePosition[] = [];
    const matured: LeveragePosition[] = [];
    const closed: LeveragePosition[] = [];

    for (const pos of allLeveragePositions) {
      if (!pos.open) closed.push(pos);
      else if (isMatured(pos.collateralToken)) matured.push(pos);
      else open.push(pos);
    }

    return { open, matured, closed };
  }, [allLeveragePositions]);

  const renderSection = (title: string, positions: LeveragePosition[]) =>
    flashLeverage && positions.length ? (
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-2xl font-medium m-2">{title}</h3>
        {positions.map((pos, i) => (
          <LeveragePositionCard
            key={i}
            leveragePosition={pos}
            flashLeverage={flashLeverage}
            deleteLeveragePosition={() => { }}
          />
        ))}
      </div>
    ) : null;

  return (
    <div className="app font-[Outfit] font-[340] relative overflow-hidden ">
      <div className="max-w-7xl mx-auto">
        <div className="pb-16 flex flex-col gap-[48px] py-[48px]">
          <PageTitle title="Dashboard" subheading="Overview of all leveraged positions and performance metrics." />
          {flashLeverage && allLeveragePositions.length ? (
            <>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <UsersChart metrics={metrics} />
                <TvlChart metrics={metrics} allLeveragePositions={allLeveragePositions} />
              </div>

              <div className="lg:flex flex-col gap-[14px] hidden">
                {renderSection("Open Positions", categorizedPositions.open)}
                <div className="mt-[50px]">
                  {renderSection("Matured Open Positions", categorizedPositions.matured)}
                </div>
                <div className="mt-[50px]">
                  {renderSection("Closed Positions", categorizedPositions.closed)}
                </div>
              </div>
            </>
          ) : (
            <div className={`mt-10`}>
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
