"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exercises = void 0;
const exercise_1 = __importDefault(require("../models/exercise"));
const ResError_1 = __importDefault(require("../util/ResError"));
const exercises = async (req, res, next) => {
    try {
        const exercises = await exercise_1.default.find();
        if (exercises) {
            return res.status(200).json({
                message: "Exercises were fetched successfully.",
                exercises: exercises,
            });
        }
        else {
            return res.status(204).json({
                message: "No data found.",
                exercises: exercises,
            });
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. exercises (exercises router): Failed to fetch exercise data.\nError: " +
            err);
        return next(error);
    }
};
exports.exercises = exercises;
const exerciseController = {
    exercises: exports.exercises,
};
exports.default = exerciseController;
//# sourceMappingURL=exercises.js.map