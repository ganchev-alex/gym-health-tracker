"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoodb = require("mongodb");
const { validationResult } = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const routine_1 = __importDefault(require("../models/routine"));
const workout_1 = __importDefault(require("../models/workout"));
const activity_session_1 = __importDefault(require("../models/activity-session"));
const essentials_1 = __importDefault(require("../models/essentials"));
const ResError_1 = __importDefault(require("../util/ResError"));
const userData = async (req, res, next) => {
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
                    lastName: user.personalDetails.lastName,
                    sex: user.personalDetails.sex,
                    profilePicture: user.personalDetails.profilePicture,
                    weight: user.personalDetails.weight,
                },
                routines: user.routines,
                preferences: user.preferences,
            };
            return res.status(200).json({
                message: `User was found: ${userId}`,
                appData,
            });
        }
        else {
            const error = new ResError_1.default("\n- func. userData (application router): User was not found.", 404);
            return next(error);
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. userData (application router): Failed to fetch user data.\nError: " +
            err);
        return next(error);
    }
};
const getRoutines = async (req, res, next) => {
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
            const error = new ResError_1.default("\n- func. getRoutines (application router): User was not found.", 404);
            return next(error);
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. getRoutines (application router): Failed to retrieve user's routines data.\nError: " +
            err);
        return next(error);
    }
};
const newRoutine = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ResError_1.default("\n- func. newRoutine (application router): Compromized validation. The user haven't followed the validation instructions on the front end.", 422);
        return next(error);
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
                notes: record.notes,
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
            const error = new ResError_1.default("\n- func. newRoutine (application router): User was not found.", 404);
            return next(error);
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
    catch (err) {
        const error = new ResError_1.default("\n- func. newRoutine (application router): Couldn't create a new routine.\nError: " +
            err);
        return next(error);
    }
};
const updateRoutine = async (req, res, next) => {
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
                    notes: record.notes,
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
        const error = new ResError_1.default("\n- func. updateRoutine (application router): Routine was not found.", 404);
        return next(error);
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. updateRoutine (application router): Coudln't update the existing routine.\nError: " +
            err);
        return next(error);
    }
};
const deleteRoutine = async (req, res, next) => {
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
                const error = new ResError_1.default("\n- func. deleteRoutine (application router): User was not found.", 404);
                return next(error);
            }
        }
        else {
            const error = new ResError_1.default("\n- func. deleteRoutine (application router): Routine was not found.", 404);
            return next(error);
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. deleteRoutine (application router): Couldn't delete the existing routine.\nError" +
            err);
        return next(error);
    }
};
const saveWorkout = async (req, res, next) => {
    const userId = req.userId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ResError_1.default("\n- func. saveWorkout (application router): Compromized validation. The user haven't followed the validation instructions on the front end.", 422);
        return next(error);
    }
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. saveWorkout (application router): User was not found.", 404);
            return next(error);
        }
        const newRecords = [];
        req.body.exercises.forEach((exercise) => {
            const previousRecordIndex = user.exerciseRecords.findIndex((record) => record.exerciseId.toString() === exercise.exerciseId.toString());
            const bestSet = exercise.sets.reduce((best, set) => {
                if (set.kg > best.kg) {
                    best = { ...set };
                }
                return best;
            }, { reps: 0, kg: 0 });
            if (bestSet.kg > 0) {
                if (previousRecordIndex > -1) {
                    if (user.exerciseRecords[previousRecordIndex].kg < bestSet.kg) {
                        user.exerciseRecords[previousRecordIndex] = {
                            exerciseId: new mongoodb.ObjectId(exercise.exerciseId),
                            ...bestSet,
                        };
                        newRecords.push({ exercise: exercise.name, kg: bestSet.kg });
                    }
                }
                else {
                    user.exerciseRecords.push({
                        exerciseId: new mongoodb.ObjectId(exercise.exerciseId),
                        ...bestSet,
                    });
                }
            }
        });
        const workoutData = {
            userId,
            date: req.body.date,
            title: req.body.title,
            category: req.body.category,
            exercises: req.body.exercises,
            duration: req.body.duration,
            volume: req.body.volume,
            sets: req.body.sets,
        };
        const workout = await new workout_1.default(workoutData).save();
        if (!workout) {
            return res
                .status(500)
                .json({ message: "Faulty process of saving the workout." });
        }
        user.workoutHistory.push({ date: workoutData.date, workout: workout._id });
        const essentialsRecord = user.essentialsHistory.find((essentials) => {
            return (essentials.date.getFullYear() === workout.date.getFullYear() &&
                essentials.date.getMonth() === workout.date.getMonth() &&
                essentials.date.getDate() === workout.date.getDate());
        });
        if (essentialsRecord) {
            await essentials_1.default.findByIdAndUpdate(essentialsRecord.essentials, {
                $push: {
                    workouts: workout._id,
                },
            });
        }
        else {
            const newEssentials = await new essentials_1.default({
                date: workout.date,
                userId: user._id,
                workouts: [workout._id],
            });
            await newEssentials.save();
        }
        await user.save();
        return res.status(201).json({
            message: "Workout saved succesfully!",
            workoutNumber: user.workoutHistory.length,
            newRecords,
            workoutData: workout,
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. saveWorkout (application router): Failed saving the workout to the user's data.\nError: " +
            err);
        return next(error);
    }
};
const saveActivitySession = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. saveActivitySession (application router): User was not found.", 404);
            return next(error);
        }
        const sessionData = {
            userId: new mongoodb.ObjectId(userId),
            date: req.body.date,
            title: req.body.title,
            category: req.body.category,
            duration: req.body.duration,
            burntCalories: req.body.burntCalories,
        };
        const session = await new activity_session_1.default(sessionData).save();
        if (!session) {
            return res
                .status(500)
                .json({ message: "Faulty process of saving the session." });
        }
        user.activitySessionHistory.push({
            date: session.date,
            session: session._id,
        });
        const essentialsRecord = user.essentialsHistory.find((essentials) => {
            return (essentials.date.getFullYear() === session.date.getFullYear() &&
                essentials.date.getMonth() === session.date.getMonth() &&
                essentials.date.getDate() === session.date.getDate());
        });
        if (essentialsRecord) {
            await essentials_1.default.findByIdAndUpdate(essentialsRecord.essentials, {
                $push: {
                    activities: session._id,
                },
            });
        }
        else {
            const newEssentials = await new essentials_1.default({
                date: session.date,
                userId: user._id,
                activities: [session._id],
            });
            await newEssentials.save();
        }
        await user.save();
        return res.status(201).json({
            message: "Session saved succesfully!",
            sessionNumber: user.activitySessionHistory.length,
            sessionData: session,
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. saveActivitySession (application router): Failed to save the activity session to the user's data.\nError: " +
            err);
        return next(error);
    }
};
const getUserHistory = async (req, res, next) => {
    const userId = req.userId;
    const { month, year } = req.query;
    const targetMonth = parseInt(month, 10);
    const targetYear = parseInt(year, 10);
    try {
        const user = await user_1.default.findById(userId).populate("activitySessionHistory.session");
        if (!user) {
            const error = new ResError_1.default("\n- func. getUserHistory (application router): User was not found.", 404);
            return next(error);
        }
        const currantMonthWorkoutHistory = user.workoutHistory.filter((workout) => {
            return (workout.date.getMonth() === targetMonth &&
                workout.date.getFullYear() === targetYear);
        });
        const currantMonthSessionHistory = user.activitySessionHistory.filter((session) => {
            return (session.date.getMonth() === targetMonth &&
                session.date.getFullYear() === targetYear);
        });
        return res.status(200).json({
            message: "History data retrieved succesfully.",
            workoutHistory: currantMonthWorkoutHistory,
            sessionHistory: currantMonthSessionHistory,
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. getUserHistory (application router): Couldn't retrieve user's history.\nError: " +
            err);
        return next(error);
    }
};
const getHistoryRecords = async (req, res, next) => {
    const userId = req.userId;
    try {
        const workout = await workout_1.default.findById(new mongoodb.ObjectId(req.query.workoutId)).populate({
            path: "exercises.exerciseId",
            select: "image",
        });
        if (workout && workout.userId.toString() === userId.toString()) {
            return res
                .status(200)
                .json({ message: "Workout data retrieved succesfully", workout });
        }
        const error = new ResError_1.default("\n- func. getHistoryRecords (application router): Workout was not found.", 404);
        return next(error);
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. getHistoryRecords (application router): Failed to fetch user's history records.\nError: " +
            err);
        return next(error);
    }
};
const application = {
    userData,
    getRoutines,
    newRoutine,
    updateRoutine,
    deleteRoutine,
    saveWorkout,
    saveActivitySession,
    getUserHistory,
    getHistoryRecords,
};
exports.default = application;
//# sourceMappingURL=application.js.map