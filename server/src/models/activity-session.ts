import mongoose = require("mongoose");

import { Schema } from "mongoose";

export interface IActivitySession {
  userId: mongoose.Types.ObjectId;
  date: Date;
  title: string;
  category: string;
  duration: number;
  burnedCalories: number;
}

const activitySessionSchema = new Schema<IActivitySession>({
  userId: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  burnedCalories: {
    type: Number,
    required: true,
  },
});

const ActivitySession = mongoose.model<IActivitySession>(
  "ActivitySession",
  activitySessionSchema,
  "activity-sessions"
);
export default ActivitySession;
