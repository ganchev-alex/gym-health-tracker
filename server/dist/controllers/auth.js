"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.checkEmail = void 0;
const bcrypt = require("bcryptjs");
const user_1 = __importDefault(require("../models/user"));
const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const userMatch = await user_1.default.findOne({ "auth.email": email });
        console.log("User match: ", userMatch);
        if (userMatch) {
            console.log(409);
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
    catch (error) {
        return res.status(500).json({
            message: "Internal server error! Something went wrong.",
            error,
        });
    }
};
exports.checkEmail = checkEmail;
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { firstName, lastName, age, sex, weight, height } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const userAuthData = { email, password: hashedPassword };
        // req.file.path.replace('\\', '/')
        const personalDetails = {
            firstName,
            lastName,
            age: Number(age),
            sex,
            profilePicture: req.file.path.replace("\\", "/"),
            weight: Number(weight),
            height: Number(height),
        };
        const user = new user_1.default({ auth: userAuthData, personalDetails });
        const result = await user.save();
        console.log(user);
        return res.status(201).json({
            message: "User was successfully added and created!",
            description: "You have added the email and the password to the data of the currant user.",
            userId: result._id,
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Internal Server Error. Something went wrong! ",
            error: error.message,
        });
    }
};
exports.signIn = signIn;
const authController = {
    signIn: exports.signIn,
    checkEmail: exports.checkEmail,
};
exports.default = authController;
//# sourceMappingURL=auth.js.map