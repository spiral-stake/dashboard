import mongoose from "mongoose";

const leveragePositionSchema = new mongoose.Schema({
  positionId: { type: String, required: true },
  amountCollateralInUsd: { type: Number, required: true },
  open: { type: Boolean, required: true },
});

const LeveragePositions = mongoose.model("LeveragePositions", leveragePositionSchema);

export default LeveragePositions;
