import mongoose from "mongoose";

const leveragePositionSchema = new mongoose.Schema(
  {
    open: { type: Boolean, required: true },
    positionId: { type: String, required: true },
    amountDepositedInUsd: { type: Number, required: true },

    atImpliedApy: { type: Number, required: true },
    desiredLtv: { type: Number, required: true },

    amountReturnedInUsd: { type: Number }, // at close
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
  }
);

const LeveragePositions = mongoose.model("LeveragePositions", leveragePositionSchema);

export default LeveragePositions;
