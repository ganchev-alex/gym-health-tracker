"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exercises = void 0;
const exercise_1 = __importDefault(require("../models/exercise"));
const ResError_1 = __importDefault(require("../util/ResError"));
const user_1 = __importDefault(require("../models/user"));
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
const getBestSet = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("User was not found!", 404);
            return next(error);
        }
        const bestSet = user.exerciseRecords.find((record) => record.exerciseId.toString() === req.query.exerciseId);
        if (bestSet) {
            return res
                .status(200)
                .json({
                message: "Best set was found.",
                bestSet: { kg: bestSet.kg, reps: bestSet.reps },
            });
        }
        else {
            return res
                .status(200)
                .json({
                message: "Currantly no best record.",
                bestSet: { kg: 0, reps: 0 },
            });
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. exercises (exercises router): Failed to fetch exercise's best set.\nError: " +
            err);
        return next(error);
    }
};
const exerciseController = {
    exercises: exports.exercises,
    getBestSet,
};
exports.default = exerciseController;
//# sourceMappingURL=exercises.js.map