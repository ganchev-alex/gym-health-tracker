import mongoose = require("mongoose");

import { Schema } from "mongoose";

interface IStatistic {
  userId: mongoose.Types.ObjectId;
  muscleDistribution: {
    week: number;
    month: number;
    year: number;
    tracker: { muscle: string; counter: number }[];
  }[];
}

const statisticSchema = new Schema<IStatistic>({
  userId: { type: Schema.ObjectId, ref: "User", required: true },
  muscleDistribution: [
    {
      week: Number,
      month: Number,
      year: Number,
      tracker: [
        {
          muscle: String,
          counter: { type: Number, default: 0 },
        },
      ],
    },
  ],
});

const Statistic = mongoose.model<IStatistic>(
  "Statistic",
  statisticSchema,
  "statistics"
);
export default Statistic;
