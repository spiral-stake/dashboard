import { useEffect, useMemo, useState } from "react";
import FlashLeverage from "./contract-hooks/FlashLeverage";
import { useChainId } from "wagmi";
import UsersChart from "./components/UserChart";
import TvlChart from "./components/TvlChart";
import axios, { all } from "axios";
import type {
  Metrics,
  LeveragePosition,
  ServerLeveragePosition,
} from "./types/index";
import LeveragePositionCard from "./components/LeveragePositionCard";
import { updatePositionsData } from "./utils/updatePositionsData";
import { calcLeverage, isMatured } from "./utils";
import PageTitle from "./components/low-level/PageTitle";
import Loader from "./components/low-level/Loader";
import arrow from "./assets/icons/arrowDown.svg";
import Navbar from "./components/Navbar";
import Overview from "./components/low-level/Overview";
import YieldAnalytics from "./components/low-level/YieldAnalytics";

const devTeamWallet =
  "0x386fB147faDb206fb7Af36438E6ae1f8583f99dd".toLowerCase();

function App() {
  const [flashLeverage, setFlashLeverage] = useState<FlashLeverage>();
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [allLeveragePositions, setAllLeveragePositions] = useState<
    LeveragePosition[]
  >([]);
  const [showClosed, setShowClosed] = useState(false);

  const appChainId = useChainId();

  

  useEffect(() => {
    /**
     * @dev on appChainId change, reset the collateralTokens and positionManager according to the chain
     */
    async function handleChainChange() {
      const [_flashLeverage] = await Promise.all([
        FlashLeverage.createInstance(appChainId),
      ]);
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
              const userPositions =
                await flashLeverage.getUserLeveragePositions(address);
              return updatePositionsData(
                serverLeveragePositions,
                address,
                userPositions
              );
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
      import.meta.env.VITE_ENV === "prod"
        ? "https://api.spiralstake.xyz"
        : "http://localhost:5000";

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
            deleteLeveragePosition={() => {}}
          />
        ))}
      </div>
    ) : null;

  return (
    <div className="app font-[Outfit] font-[340] relative overflow-hidden ">
      <Navbar />

      <div className="pb-16 flex flex-col gap-[48px] py-[48px] px-[80px]">
        <PageTitle
          title="Dashboard"
          subheading="Overview of all leveraged positions and performance metrics."
        />
        {flashLeverage && allLeveragePositions.length ? (
          <>
            <div className="flex flex-col gap-[24px]">
              {/* <UsersChart metrics={metrics} /> */}
              <TvlChart
                metrics={metrics}
                allLeveragePositions={allLeveragePositions}
              />
              <div className="flex items-center gap-[24px]">
                <Overview
                  flashLeverage={flashLeverage}
                  metrics={metrics}
                  allLeveragePositions={allLeveragePositions}
                />
                <YieldAnalytics
                  flashLeverage={flashLeverage}
                  metrics={metrics}
                  allLeveragePositions={allLeveragePositions}
                />
              </div>
            </div>

            <div className="lg:flex flex-col gap-[24px] hidden">
              {/* open postions */}
              {renderSection("Open Positions", categorizedPositions.open)}

              {/* matured positions */}
              <div>
                {renderSection(
                  "Matured Open Positions",
                  categorizedPositions.matured
                )}
              </div>

              {/* closed positions */}
              <div>
                <div
                  onClick={() => setShowClosed(!showClosed)}
                  className="flex bg-white bg-opacity-[4%] rounded-[16px] justify-between py-[24px] px-[30px] cursor-pointer"
                >
                  <p className="text-lg font-[400] text-gray-300">
                    Closed Positions
                  </p>
                  <img
                    src={arrow}
                    alt=""
                    className={`w-[24px] cursor-pointer transition-transform duration-300 ${
                      showClosed ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {showClosed && renderSection("", categorizedPositions.closed)}
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
  );
}

export default App;
