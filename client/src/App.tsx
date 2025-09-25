import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";
import Dashboard from "./components/Dashboard";
import type { Metrics } from "./types";

function App() {
  const [leveragePositions, setLeveragePositions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [loading, setLoading] = useState(true);

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



  return (
    <>
      {!loading && (
        <Dashboard leveragePositions={leveragePositions} metrics={metrics} />
      )}
    </>
  );
}

export default App;
