"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoodb = require("mongodb");
const { validationResult } = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const routine_1 = __importDefault(require("../models/routine"));
const userData = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId).populate({
            path: "routines",
            populate: {
                path: "exercises.exerciseData",
                model: "Exercise",
            },
        });
        if (user) {
            const appData = {
                auth: { email: user.auth.email },
                personalDetails: {
                    firstName: user.personalDetails.firstName,
                    lastNamee: user.personalDetails.lastName,
                    sex: user.personalDetails.sex,
                    profilePicture: user.personalDetails.profilePicture,
                },
                routines: user.routines,
            };
            return res.status(200).json({
                message: `User was found: ${userId}`,
                appData,
            });
        }
        else {
            return res.status(404).json({
                message: `User was not found!`,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500);
    }
};
const getRoutines = async (req, res) => {
    const userId = new mongoodb.ObjectId(req.userId);
    try {
        const user = await user_1.default.findById(userId).populate({
            path: "routines",
            populate: {
                path: "exercises.exerciseData",
                model: "Exercise",
            },
        });
        if (user) {
            return res.status(200).json({
                message: "User found! Fetching successfull",
                routines: user.routines,
            });
        }
        else {
            return res.status(404).json({ message: "User was not found." });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error!", error });
    }
};
const newRoutine = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ message: "Compromised Validation!" });
    }
    const routineData = {
        userId: new mongoodb.ObjectId(req.userId),
        title: req.body.routineData.title,
        category: req.body.routineData.category,
        description: req.body.routineData.description,
        exercises: req.body.routineExercises.map((record) => {
            return {
                exerciseData: new mongoodb.ObjectId(record.exercise),
                sets: record.sets,
                restTime: record.restTime,
            };
        }),
        duration: 0,
    };
    routineData.duration = routineData.exercises.reduce((accumulator, currantExercise) => {
        if (currantExercise.restTime != 0) {
            accumulator += (currantExercise.restTime + 60) * currantExercise.sets;
        }
        else {
            accumulator += currantExercise.sets * 60;
        }
        return accumulator;
    }, 0);
    try {
        const user = await user_1.default.findOne({ _id: routineData.userId });
        if (!user) {
            return res.status(404).json({
                message: "User with this id does not excist.",
            });
        }
        const newRoutine = await new routine_1.default(routineData).save();
        if (!newRoutine) {
            return res.status(500).json({
                message: "Faulty process of saving the new routine.",
            });
        }
        user.routines.push(newRoutine._id);
        await user.save();
        return res.status(201).json({ message: "New routine saved successfully." });
    }
    catch (error) {
        console.log("Error creating the new routine", error);
        return res.status(500).json({ message: "Internal Server error." });
    }
};
const updateRoutine = async (req, res) => {
    const routineId = new mongoodb.ObjectId(req.body.routineId);
    const userId = req.userId;
    const updatedRoutineData = req.body;
    try {
        const updatedRoutine = await routine_1.default.findOneAndUpdate({ _id: routineId, userId: userId }, {
            $set: {
                title: updatedRoutineData.routineData.title,
                category: updatedRoutineData.routineData.category,
                description: updatedRoutineData.routineData.description,
                exercises: updatedRoutineData.routineExercises.map((record) => ({
                    exerciseData: new mongoodb.ObjectId(record.exercise),
                    sets: record.sets,
                    restTime: record.restTime,
                })),
                duration: updatedRoutineData.routineExercises.reduce((accumulator, currentExercise) => {
                    if (currentExercise.restTime !== 0) {
                        accumulator +=
                            (currentExercise.restTime + 60) * currentExercise.sets;
                    }
                    else {
                        accumulator += currentExercise.sets * 60;
                    }
                    return accumulator;
                }, 0),
            },
        }, { new: true }).populate("exercises.exerciseData");
        if (updatedRoutine) {
            return res.status(201).json({
                message: "Routine was updated successfully.",
                updatedRoutine,
            });
        }
        return res
            .status(404)
            .json({ message: "No such routine with this ID was found." });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error.", error });
    }
};
const deleteRoutine = async (req, res) => {
    const routineId = new mongoodb.ObjectId(req.body.routineId);
    const userId = req.userId;
    try {
        const result = await routine_1.default.findByIdAndDelete(routineId);
        if (result) {
            const user = await user_1.default.findById(userId);
            if (user) {
                user.routines = user.routines.filter((routine) => {
                    return routine._id.toString() !== routineId.toString();
                });
                await user.save();
                return res
                    .status(200)
                    .json({ message: "Routine was deleted succesfully." });
            }
            else {
                return res
                    .status(404)
                    .json({ message: "User with the provided ID was not found." });
            }
        }
        else {
            return res
                .status(404)
                .json({ mesage: "Routine with this ID was not found." });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};
const application = {
    userData,
    getRoutines,
    newRoutine,
    updateRoutine,
    deleteRoutine,
};
exports.default = application;
//# sourceMappingURL=application.js.map