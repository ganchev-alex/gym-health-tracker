"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const routineSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.ObjectId,
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
const Routine = mongoose.model("Routine", routineSchema, "routines");
exports.default = Routine;
//# sourceMappingURL=routine.js.map