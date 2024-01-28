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
});

const User = mongoose.model<IUser>("User", userSchema, "users");

export default User;
