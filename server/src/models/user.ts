import mongoose = require("mongoose");

const Schema = mongoose.Schema;

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
  selectedActivities: string[];
  activitiesPreference: {
    fitnessLevel: string;
    frequencyStatus: string;
    fitnessGoal: string;
  };
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
  selectedActivities: [String],
  activitiesPreference: {
    fitnessLevel: String,
    frequencyStatus: String,
    fitnessGoal: String,
  },
});

const User = mongoose.model<IUser>("User", userSchema, "users");

export default User;
