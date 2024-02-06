"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const activitySessionSchema = new mongoose_1.Schema({
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
    duration: {
        type: Number,
        required: true,
    },
    burnedCalories: {
        type: Number,
        required: true,
    },
});
const ActivitySession = mongoose.model("ActivitySession", activitySessionSchema, "activity-sessions");
exports.default = ActivitySession;
//# sourceMappingURL=activity-session.js.map