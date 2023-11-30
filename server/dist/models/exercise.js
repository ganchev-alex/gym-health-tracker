"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    equipment: {
        type: String,
        required: true,
    },
    primaryMuscles: {
        type: [String],
        required: true,
    },
    secondaryMuscles: {
        type: [String],
        required: true,
    },
    instructions: {
        type: [String],
        required: true,
    },
});
const Exercise = mongoose.model("Exercise", exerciseSchema, "exercises");
exports.default = Exercise;
//# sourceMappingURL=exercise.js.map