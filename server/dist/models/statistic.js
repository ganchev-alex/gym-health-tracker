"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const statisticSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.ObjectId, ref: "User", required: true },
    muscleDistribution: [
        {
            week: Number,
            month: Number,
            year: Number,
            tracker: [
                {
                    muscle: String,
                    counter: { type: Number, default: 0 },
                },
            ],
        },
    ],
});
const Statistic = mongoose.model("Statistic", statisticSchema, "statistics");
exports.default = Statistic;
//# sourceMappingURL=statistic.js.map