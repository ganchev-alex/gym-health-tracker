"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
    routines: [{ type: mongoose_1.Schema.ObjectId, ref: "Routine" }],
    workoutHistory: [
        {
            date: { type: Date, required: true },
            workout: { type: mongoose_1.Schema.ObjectId, ref: "Workout", required: true },
        },
    ],
    exerciseRecords: [
        {
            exerciseId: { type: mongoose_1.Schema.ObjectId, ref: "Exercise", required: true },
            reps: { type: Number, required: true },
            kg: {
                type: Number,
                required: true,
            },
        },
    ],
    activitySessionHistory: [
        {
            date: { type: Date, required: true },
            session: {
                type: mongoose_1.Schema.ObjectId,
                ref: "ActivitySession",
                required: true,
            },
        },
    ],
});
const User = mongoose.model("User", userSchema, "users");
exports.default = User;
//# sourceMappingURL=user.js.map