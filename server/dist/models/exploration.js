"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const explorationSchema = new mongoose_1.Schema({
    title: String,
    category: String,
    duration: Number,
    image: String,
    keywords: [String],
    target: [String],
    level: [String],
    sex: String,
    content: {
        type: { type: String },
        title: String,
        description: String,
        body: String,
        routines: {
            type: [
                {
                    type: mongoose_1.Schema.ObjectId,
                    ref: "SharedRoutine",
                    required: true,
                    default: undefined,
                },
            ],
        },
        source: String,
    },
});
const Exploration = mongoose.model("Exploration", explorationSchema, "explorations");
exports.default = Exploration;
//# sourceMappingURL=exploration.js.map