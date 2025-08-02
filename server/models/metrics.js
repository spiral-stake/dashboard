import mongoose from "mongoose";

// Cron saves the data here

const metricsSchema = new mongoose.Schema(
  {
    userCount: Number,
    tvl: Number,
    totalDeposited: Number,
  },
  { timestamps: true }
);

const Metrics = mongoose.model("Metrics", metricsSchema);

export default Metrics;
