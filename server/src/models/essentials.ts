import mongoose = require("mongoose");

import { Schema } from "mongoose";

export interface IEssential {
  date: Date;
  userId: mongoose.Types.ObjectId;
  workouts: mongoose.Types.ObjectId[];
  activities: mongoose.Types.ObjectId[];
  activityTime: number;
  burntCalories: number;
  wakeTime: string;
  bedTime: string;
  sleepTime: number;
  water: number;
  consumedCalories: number;
  calHistory: {
    timespan: string;
    meal: string;
    calories: number;
  }[];
}

const essentialSchema = new Schema<IEssential>({
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.ObjectId,
    required: true,
  },
  workouts: {
    type: [
      {
        type: Schema.ObjectId,
        ref: "Workout",
        required: true,
      },
    ],
    default: [],
  },
  activities: {
    type: [
      {
        type: Schema.ObjectId,
        ref: "ActivitySession",
        required: true,
      },
    ],
    default: [],
  },
  activityTime: {
    type: Number,
    default: 0,
  },
  burntCalories: {
    type: Number,
    default: 0,
  },
  wakeTime: {
    type: String,
    default: "",
  },
  bedTime: {
    type: String,
    default: "",
  },
  sleepTime: {
    type: Number,
    default: 0,
  },
  water: {
    type: Number,
    default: 0,
  },
  consumedCalories: {
    type: Number,
    required: true,
    default: 0,
  },
  calHistory: {
    type: [
      {
        timespan: {
          type: String,
          required: true,
        },
        meal: {
          type: String,
          required: true,
        },
        calories: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

const Essential = mongoose.model<IEssential>(
  "Essential",
  essentialSchema,
  "essentials"
);

export default Essential;
