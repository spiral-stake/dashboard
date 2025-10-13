import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import Dashboard from "./components/Dashboard";
import type { Metrics } from "./types";
import FlashLeverage from "./contract-hooks/FlashLeverage";
import { useChainId } from "wagmi";

function App() {
   const [flashLeverage, setFlashLeverage] = useState<FlashLeverage>();
  const [leveragePositions, setLeveragePositions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [loading, setLoading] = useState(true);


    const appChainId = useChainId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const baseUrl = import.meta.env.VITE_ENV === "prod"
          ? "https://api.spiralstake.xyz"
          : "http://localhost:5000";

        const [leverageRes, metricsRes] = await Promise.all([
          axios.get(`${baseUrl}/leveragePositions`),
          axios.get(`${baseUrl}/metrics`),
        ]);

        setLeveragePositions(leverageRes.data);
        setMetrics(metricsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // openLevergeposition();
    // newUser();
  }, []);

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



  return (
    <>
      {!loading && (
        <Dashboard flashLeverage={flashLeverage} leveragePositions={leveragePositions} metrics={metrics} />
      )}
    </>
  );
}

export default App;
