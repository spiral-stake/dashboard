import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Users from "./models/users.js";
import LeveragePositions from "./models/leveragePositions.js";
import cron from "node-cron";
import Metrics from "./models/metrics.js";
import { corsOption } from "./cors.js";
import { catchAsync } from "./utils/catchAsync.js";

const app = express();

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

////////////////
// WRITE
///////////////

app.post(
  "/user",
  catchAsync(async (req, res) => {
    const { address } = req.body;

    const newUser = new Users({ address });
    await newUser.save();

    res.send("New user saved", newUser);
  })
);

app.post(
  "/leverage/open",
  catchAsync(async (req, res) => {
    const { user, positionId, amountDepositedInUsd, atImpliedApy, atBorrowApy, desiredLtv } =
      req.body;

    const newLevergePosition = new LeveragePositions({
      open: true,
      positionId: user + positionId,
      amountDepositedInUsd,
      atImpliedApy,
      atBorrowApy,
      desiredLtv,
    });

    await newLevergePosition.save();
    res.send("Position saved successfully");
  })
);

app.put(
  "/leverage/close",
  catchAsync(async (req, res) => {
    const { user, positionId, amountReturnedInUsd } = req.body;

    const closedLeveragePosition = await LeveragePositions.findOneAndUpdate(
      { positionId: user + positionId },
      { $set: { open: false, amountReturnedInUsd } }
    );

    if (!closedLeveragePosition) {
      return res.status(404).send("Leverage Position Not Found");
    }

    res.send("Position closed successfully");
  })
);

////////////////
// READ
///////////////

app.get(
  "/leveragePositions",
  catchAsync(async (req, res) => {
    const leveragePositions = await LeveragePositions.find().sort({
      amountDepositedInUsd: -1,
    });

    if (!leveragePositions) {
      return res.status(404).send("there are no leverage positions");
    }

    res.send(leveragePositions);
  })
);

app.get(
  "/metrics",
  catchAsync(async (req, res) => {
    const metrics = await Metrics.find();
    res.send(metrics);
  })
);

////////////////
// CRON
///////////////

const scheduleCron = () => {
  updateMetrics();
  cron.schedule("0 0 * * *", () => {
    updateMetrics();
  });
};

// Gets called by cron
const updateMetrics = async () => {
  const userCount = (await Users.find()).length;

  const leveragePositions = await LeveragePositions.find({});

  let tvl = 0;
  leveragePositions.forEach((position) => {
    if (position.open) {
      tvl += position.amountDepositedInUsd;
    }
  });

  let amountDeposited = 0;
  leveragePositions.forEach((position) => {
    amountDeposited += position.amountDepositedInUsd;
  });

  const newMetric = new Metrics({ userCount, tvl, amountDeposited });
  newMetric.save();
};

app.listen(5000, () => {
  console.log("Serving on port 5000");

  mongoose
    .connect("mongodb://127.0.0.1:27017/dashboard")
    .then(console.log("CONNECTED TO MONGO"))
    .catch((e) => {
      console.log("error connecting");
    });

  scheduleCron();
});
