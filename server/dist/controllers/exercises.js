"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exercises = void 0;
const express = require("express");
const exercises_1 = __importDefault(require("../models/exercises"));
const router = express.Router();
const exercises = async (req, res, next) => {
    try {
        const exercises = await exercises_1.default.find();
        if (exercises) {
            res.status(200).json({
                message: "Exercises were fetched successfully.",
                exercises: exercises,
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.exercises = exercises;
const exerciseController = {
    exercises: exports.exercises,
};
exports.default = exerciseController;
//# sourceMappingURL=exercises.js.map