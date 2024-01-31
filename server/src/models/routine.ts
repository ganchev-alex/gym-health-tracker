import mongoose = require("mongoose");
import mongodb = require("mongodb");

import { Schema } from "mongoose";

export interface IRoutine {
  userId: Schema.Types.ObjectId;
  title: string;
  category: string;
  description: string;
  duration: number;
  exercises: {
    exerciseData: mongodb.ObjectId;
    sets: number;
    restTime: number;
    notes: string;
  }[];
}

const routineSchema = new Schema<IRoutine>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  description: String,
  duration: Number,
  exercises: [
    {
      exerciseData: {
        type: Schema.Types.ObjectId,
        ref: "Exercise",
        required: true,
      },
      sets: {
        type: Number,
        required: true,
      },
      restTime: {
        type: Number,
        required: true,
      },
      notes: String,
    },
  ],
});

const Routine = mongoose.model<IRoutine>("Routine", routineSchema, "routines");

export default Routine;
