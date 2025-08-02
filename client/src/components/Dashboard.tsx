import UsersChart from "./UserChart";
import LeverageTable from "./LeverageTable";
import TvlChart from "./TvlChart";
import type { leveragePosition, Metrics } from "../types";

const Dashboard = ({
  leveragePositions,
  metrics,
}: {
  leveragePositions: leveragePosition[];
  metrics: Metrics[];
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Spiral Stake Dashboard
          </h1>
          <p className="text-gray-600">Real-time analytics and monitoring</p>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <UsersChart metrics={metrics} />
          <TvlChart metrics={metrics} />
        </div>

        {/* Leverage Table */}
        <LeverageTable leveragePositions={leveragePositions} />
      </div>
    </div>
  );
};

export default Dashboard;
