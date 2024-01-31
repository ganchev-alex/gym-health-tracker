"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.ObjectId,
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
                type: mongoose_1.Schema.ObjectId,
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
const Workout = mongoose.model("Workout", workoutSchema, "workouts");
exports.default = Workout;
//# sourceMappingURL=workout.js.map