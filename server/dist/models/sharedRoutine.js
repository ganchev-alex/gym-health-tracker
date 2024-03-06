"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const sharedRoutineSchema = new mongoose_1.Schema({
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
            exerciseData: { type: mongoose_1.Schema.ObjectId, ref: "Exercise" },
            sets: Number,
            restTime: Number,
            notes: String,
        },
    ],
});
const SharedRoutine = mongoose.model("SharedRoutine", sharedRoutineSchema, "shared-routines");
exports.default = SharedRoutine;
//# sourceMappingURL=sharedRoutine.js.map