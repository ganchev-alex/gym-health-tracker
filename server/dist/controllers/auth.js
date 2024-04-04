"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.checkEmail = void 0;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");
const user_1 = __importDefault(require("../models/user"));
const authValidation_1 = require("../middleware/authValidation");
const ResError_1 = __importDefault(require("../util/ResError"));
const checkEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({
                message: "Please provide a valid email!",
                error: validationErrors.array()[0].msg,
            });
        }
        const userMatch = await user_1.default.findOne({ "auth.email": email });
        if (userMatch) {
            return res.status(409).json({
                message: "Email already in use!",
                email: userMatch.auth.email,
            });
        }
        else {
            return res.status(200).json({
                message: "User with this email does not exist, thus it can be used for the creation of a new account.",
            });
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. checkEmail (auth router): Couln't compare emails.\nError: " +
            err);
        return next(error);
    }
};
exports.checkEmail = checkEmail;
const signIn = async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const errorMessages = validationErrors.array().map((error) => {
                return error.msg;
            });
            return res.status(422).json({
                message: "Invalid validation! The provided data was not validated on the front end!",
                errors: errorMessages,
            });
        }
        const { email, password } = req.body;
        const { firstName, lastName, age, sex, weight, height } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const userAuthData = {
            email,
            verification: false,
            password: hashedPassword,
        };
        const userData = {
            auth: userAuthData,
            personalDetails: {
                firstName,
                lastName,
                age,
                sex,
                profilePicture: req.file.path.replace("\\", "/"),
                weight: weight,
                height: height,
            },
            preferences: {
                selectedActivities: [
                    "Gym & Weightlifting",
                    "Cardio",
                    "Yoga",
                    "Stretching",
                    "Meditation",
                    "Cross Fit",
                ],
                fitnessLevel: "Beginner",
                frequencyStatus: "3-4 times a week",
                fitnessGoal: "Tone and Define Muscles",
            },
        };
        const user = new user_1.default(userData);
        const result = await user.save();
        const token = jwt.sign({
            email: result.auth.email,
            userId: result._id.toString(),
        }, authValidation_1.TOKEN_SECRET_KEY, {
            expiresIn: "1h",
        });
        return res.status(201).json({
            message: "User was successfully added and created!",
            description: "You have added the email and the password to the data of the currant user.",
            token: token,
            userId: result._id.toString(),
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. signIn (auth router): Couldn't sign in the user.\nError: " +
            err);
        return next(error);
    }
};
exports.signIn = signIn;
const setPreferences = async (req, res, next) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(500).json({
            message: "Server side authentication error! UserId was not found on the request",
        });
    }
    const { selectedActivities, fitnessLevel, frequencyStatus, fitnessGoal } = req.body;
    try {
        const result = await user_1.default.updateOne({ _id: new ObjectId(userId) }, {
            $set: {
                preferences: {
                    selectedActivities: selectedActivities.length === 0
                        ? [
                            "Gym & Weightlifting",
                            "Cardio",
                            "Yoga",
                            "Stretching",
                            "Meditation",
                            "Cross Fit",
                        ]
                        : selectedActivities,
                    fitnessLevel,
                    frequencyStatus,
                    fitnessGoal,
                },
            },
        });
        if (result.modifiedCount > 0) {
            return res.status(204).json({
                message: `The preferences for user ${userId} were succesfully added.`,
            });
        }
        else if (result.matchedCount === 0) {
            const error = new ResError_1.default("\n- func. setPreferences (auth router): User was not found.", 404);
            return next(error);
        }
        else {
            return res.status(304).json({
                message: "No changes were made!",
            });
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. setPreference (auth router): Couldn't set user's preferences.\nError: " +
            err);
        return next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({
                message: "Invalid validation! The provided data was not validated on the front end!",
            });
        }
        const { email, password } = req.body;
        const userMatch = await user_1.default.findOne({ "auth.email": email });
        if (!userMatch) {
            return res.status(401).json({
                message: "A user with this email was not found.",
            });
        }
        const result = await bcrypt.compare(password, userMatch.auth.password);
        if (!result) {
            return res.status(401).json({
                message: "You have provided a wrong password",
            });
        }
        const token = jwt.sign({
            email: userMatch.auth.email,
            userId: userMatch._id.toString(),
        }, authValidation_1.TOKEN_SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({
            token: token,
            userData: userMatch,
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. login (auth router): Couldn't log in the user.\nError: " + err);
        return next(error);
    }
};
const authController = {
    signIn: exports.signIn,
    checkEmail: exports.checkEmail,
    setPreferences,
    login,
};
exports.default = authController;
//# sourceMappingURL=auth.js.map