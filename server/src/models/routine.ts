import mongoose = require("mongoose");

import { Schema } from "mongoose";

export interface IRoutine {
  userId: Schema.Types.ObjectId;
  title: string;
  category: string;
  description: string;
  exercises: {
    exerciseId: Schema.Types.ObjectId;
    sets: number;
    resetTime: number;
  };
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
  exercises: [
    {
      exerciseId: {
        type: Schema.ObjectId,
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
    },
  ],
});

const Routine = mongoose.model<IRoutine>("Routine", routineSchema, "routines");

export default Routine;
