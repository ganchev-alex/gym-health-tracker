"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const essentialSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
    },
    workouts: {
        type: [
            {
                type: mongoose_1.Schema.ObjectId,
                ref: "Workout",
                required: true,
            },
        ],
        default: [],
    },
    activities: {
        type: [
            {
                type: mongoose_1.Schema.ObjectId,
                ref: "ActivitySession",
                required: true,
            },
        ],
        default: [],
    },
    activityTime: {
        type: Number,
        default: 0,
    },
    burntCalories: {
        type: Number,
        default: 0,
    },
    wakeTime: {
        type: String,
        default: "",
    },
    bedTime: {
        type: String,
        default: "",
    },
    sleepTime: {
        type: Number,
        default: 0,
    },
    water: {
        type: Number,
        default: 0,
    },
    consumedCalories: {
        type: Number,
        required: true,
        default: 0,
    },
    calHistory: {
        type: [
            {
                timespan: {
                    type: String,
                    required: true,
                },
                meal: {
                    type: String,
                    required: true,
                },
                calories: {
                    type: Number,
                    required: true,
                },
            },
        ],
        default: [],
    },
});
const Essential = mongoose.model("Essential", essentialSchema, "essentials");
exports.default = Essential;
//# sourceMappingURL=essentials.js.map