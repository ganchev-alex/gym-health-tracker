import mongoose = require("mongoose");

import { Schema } from "mongoose";

interface IUser {
  auth: {
    email: string;
    password: string;
  };
  personalDetails: {
    firstName: string;
    lastName: string;
    profilePicture: string;
    age: number;
    sex: string;
    weight: number;
    height: number;
  };
  preferences: {
    selectedActivities: string[];
    fitnessLevel: string;
    frequencyStatus: string;
    fitnessGoal: string;
  };
  routines: mongoose.Types.ObjectId[];
  workoutHistory: { date: Date; workout: mongoose.Types.ObjectId }[];
  exerciseRecords: {
    exerciseId: mongoose.Types.ObjectId;
    reps: number;
    kg: number;
  }[];
}

const userSchema = new Schema<IUser>({
  auth: {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  personalDetails: {
    firstName: String,
    lastName: String,
    profilePicture: String,
    age: Number,
    sex: String,
    weight: Number,
    height: Number,
  },
  preferences: {
    selectedActivities: [String],
    fitnessLevel: String,
    frequencyStatus: String,
    fitnessGoal: String,
  },
  routines: [{ type: Schema.ObjectId, ref: "Routine" }],
  workoutHistory: [
    {
      date: { type: Date, required: true },
      workout: { type: Schema.ObjectId, ref: "Workout", required: true },
    },
  ],
  exerciseRecords: [
    {
      exerciseId: { type: Schema.ObjectId, ref: "Exercise", required: true },
      reps: { type: Number, required: true },
      kg: {
        type: Number,
        required: true,
      },
    },
  ],
});

const User = mongoose.model<IUser>("User", userSchema, "users");

export default User;
