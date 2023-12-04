"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
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
});
const User = mongoose.model("User", userSchema, "users");
exports.default = User;
//# sourceMappingURL=user.js.map