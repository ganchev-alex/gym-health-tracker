import mongoose = require("mongoose");

import { Schema } from "mongoose";

interface ExerciseData {
  exerciseId: mongoose.Types.ObjectId;
  name: string;
  sets: {
    reps: number;
    kg: number;
  }[];
  notes: string;
}

export interface IWorkout {
  userId: mongoose.Types.ObjectId;
  date: Date;
  title: string;
  category: string;
  exercises: ExerciseData[];
  duration: number;
  volume: number;
  sets: number;
}

const workoutSchema = new Schema<IWorkout>({
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
  exercises: [
    {
      exerciseId: {
        type: Schema.ObjectId,
        ref: "Exercise",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      sets: [
        {
          reps: {
            type: Number,
            required: true,
          },
          kg: {
            type: Number,
            required: true,
          },
        },
      ],
      notes: String,
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
});

const Workout = mongoose.model<IWorkout>("Workout", workoutSchema, "workouts");
export default Workout;
