import mongoose = require("mongoose");

import { Schema } from "mongoose";

interface ISharedRoutine {
  title: string;
  category: string;
  description: string;
  duration: number;
  exercises: {
    exerciseData: mongoose.Types.ObjectId;
    sets: number;
    restTime: number;
    notes: string;
  }[];
}

const sharedRoutineSchema = new Schema<ISharedRoutine>({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  exercises: [
    {
      exerciseData: { type: Schema.ObjectId, ref: "Exercise" },
      sets: Number,
      restTime: Number,
      notes: String,
    },
  ],
});

const SharedRoutine = mongoose.model<ISharedRoutine>(
  "SharedRoutine",
  sharedRoutineSchema,
  "shared-routines"
);

export default SharedRoutine;
