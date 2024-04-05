"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeEmail = exports.transporter = void 0;
const bcrypt = require("bcryptjs");
const fs = require("fs");
const express_validator_1 = require("express-validator");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const user_1 = __importDefault(require("../models/user"));
const ResError_1 = __importDefault(require("../util/ResError"));
const routine_1 = __importDefault(require("../models/routine"));
const workout_1 = __importDefault(require("../models/workout"));
const activity_session_1 = __importDefault(require("../models/activity-session"));
const essentials_1 = __importDefault(require("../models/essentials"));
const statistic_1 = __importDefault(require("../models/statistic"));
// Create an environment variable
// echo "export SENDGRID_API_KEY='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'" > sendgrid.env
// echo "sendgrid.env" >> .gitignore
// source ./sendgrid.env
const API_KEY = "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";
exports.transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: API_KEY,
    },
}));
const sendVerificationEmail = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. sendVerificationEmail (account router): User was not found.", 404);
            return next(error);
        }
        await exports.transporter.sendMail({
            to: user.auth.email,
            from: "health.tracker.ag@gmail.com",
            subject: "Email Verification",
            html: (0, exports.composeEmail)("Email Verification", [
                "Let's verify your email so you can manage your account better.",
                "By verifying your email you add security to your data.",
            ], `http://localhost:3000/auth/verify-email/${user._id}`, "Verify Email", 48, "Your link is active for 48 hours. After that, you will need to resend the verification email."),
        });
        return res.status(200).json({ message: "Email sent succesfully!" });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. sendVerificationEmail (account router): Email sending wasn't successfull.\nError: " +
            err);
        return next(error);
    }
};
const verifyEmail = async (req, res, next) => {
    try {
        const user = await user_1.default.findById(req.query.userId);
        if (!user) {
            return res.status(404).json({ message: "User was not found." });
        }
        else {
            user.auth.verification = true;
            await user.save();
            return res.status(200).json({ message: "Email verified." });
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. verifyEmail (account router): Email verification wasn't successful.\nError: " +
            err);
        return next(error);
    }
};
const changeEmail = async (req, res, next) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        const errorMessages = validationErrors.array().map((error) => {
            return error.msg;
        });
        return res.status(422).json({
            message: "Invalid validation! The provided data was not validated on the front end!",
            errors: errorMessages,
        });
    }
    try {
        const userId = req.userId;
        const user = await user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User was not found." });
        }
        user.auth.email = req.body.email;
        user.auth.verification = false;
        await user.save();
        return res.status(201).json({ message: "Email updated succesfully." });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. changeEmail (account router): Couldn't change user's email.\nError: " +
            err);
        return next(error);
    }
};
const changePasswordEmail = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. changePasswordEmail (account router): User was not found.", 404);
            return next(error);
        }
        await exports.transporter.sendMail({
            to: user.auth.email,
            from: "health.tracker.ag@gmail.com",
            subject: "Change Password Request",
            html: (0, exports.composeEmail)("Change Password", [
                "A change of the password for you account has been requested.",
                "If you haven't made this request please contact us as soon as possible and DO NOT follow the provided link.",
            ], `http://localhost:3000/auth/change-password/${user._id}`, "Change Password", 1, "Your link is active for 1 hour. After that, you will need to make an additional change pasword request."),
        });
        return res.status(200).json({ message: "Email sent succesfully!" });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. changePasswordEmail (account router): Email sending wasn't successfull.\nError: " +
            err);
        return next(error);
    }
};
const changePassword = async (req, res, next) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        const errorMessages = validationErrors.array().map((error) => {
            return error.msg;
        });
        return res.status(422).json({
            message: "Invalid validation! The provided data was not validated on the front end!",
            errors: errorMessages,
        });
    }
    try {
        const user = await user_1.default.findById(req.query.userId);
        if (!user) {
            return res.status(404).json({ message: "User was not found." });
        }
        const { oldPassword, newPassword, passwordCheck } = req.body;
        const oldPasswordComparison = await bcrypt.compare(oldPassword, user.auth.password);
        if (!oldPasswordComparison) {
            return res
                .status(401)
                .json({ message: "The currant password is incorrect." });
        }
        if (newPassword === passwordCheck) {
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            user.auth.password = hashedPassword;
            await user.save();
            return res
                .status(200)
                .json({ message: "User's password has been updated succesfully." });
        }
        return res.status(422).json({
            message: "Invalid validation. The provided data was not validated on the front end.",
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. changePassword (account router): Coulnd't change password.\nError: " +
            err);
        return next(error);
    }
};
const deleteAccountEmail = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. changePasswordEmail (account router): User was not found.", 404);
            return next(error);
        }
        await exports.transporter.sendMail({
            to: user.auth.email,
            from: "health.tracker.ag@gmail.com",
            subject: "Account Deletion",
            html: (0, exports.composeEmail)("Delete Account", [
                "Are you really sure you want to delete your account? By agreeing to do so, you will delete all of your cuurant data that later on you won't be able to retrive.",
                "If you haven't made this request please contact us as soon as possible and DO NOT follow the provided link.",
            ], `http://localhost:3000/auth/delete-account/${user._id}`, "Delete Account", 0.5, "Your link is active for 30 minutes. After that, you will need to make an additional delete account request."),
        });
        return res.status(200).json({ message: "Email sent succesfully!" });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. changePasswordEmail (account router): Email sending wasn't successfull.\nError: " +
            err);
        return next(error);
    }
};
const deleteAccount = async (req, res, next) => {
    try {
        const user = await user_1.default.findById(req.query.userId);
        if (!user) {
            return res.status(404).json({ message: "User was not found." });
        }
        if (user.auth.email != req.body.email) {
            return res
                .status(401)
                .json({ message: "Provided email does not match." });
        }
        fs.unlink(user.personalDetails.profilePicture, (err) => {
            if (err)
                console.log("Profile Picutre " +
                    user.personalDetails.profilePicture +
                    " couldn't be deleted: " +
                    err);
        });
        await routine_1.default.deleteMany({ userId: user._id.toString() });
        await workout_1.default.deleteMany({ userId: user._id.toString() });
        await activity_session_1.default.deleteMany({ userId: user._id.toString() });
        await essentials_1.default.deleteMany({ userId: user._id.toString() });
        await statistic_1.default.deleteMany({ userId: user._id.toString() });
        await user_1.default.findByIdAndDelete(user._id);
        return res.status(200).json({ message: "Account deleted succesfully." });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. deleteAccount (account router): Faulty proccess of deleting the account.\nError: " +
            err);
        return next(error);
    }
};
const composeEmail = function (title, content, actionLink, actionLable, expirationHours, additionalDescription) {
    const expirationTime = new Date(Date.now() + expirationHours * 3600000);
    return `
      <body style="width: 90%; height: fit-content; color: #2e2e2e; margin: 0 auto; display: block">
      <main style="display: flex; flex-direction: column; padding: 1.2em; align-items: center; width: 45%; height: fit-content; margin: 2em 0;">
            <h1 style="font-size: 1.4rem; text-align: center; width: 100%; color: #81c8d9; margin: 0; margin-bottom: 0.5em;">${title}</h1>
            ${content
        .map((para) => `<p style="font-size: 1rem; margin: 0.3em auto; font-weight: 550; width: 40%; text-align: center">${para}</p>`)
        .join("")}
            <p style="font-size: 1rem; margin: 1.5em auto 2em; font-weight: 500; width: 40%; text-align: center">${additionalDescription}</p>
            <a href="${actionLink}?expiration=${expirationTime.toISOString()}" style="font-size: 1rem; font-weight: 600; text-decoration: none; background: #81c8d9; color: white; padding: 0.5em 3em; width: fit-content; margin: 1em auto 3em; height: fit-content; border-radius: 15px; text-align: center; display: block; cursor: pointer">${actionLable}</a>
          </main>
          <footer style="width: 100%; height: fit-content; padding: 1.2rem; background: #2e2e2e; display: flex">
              <p style="margin-right: 3em; color: white; font-weight: 600">Contact us: <a href="mailto:health.tracker.ag@gmail.com" style="font-size: 0.8rem; font-weight: 500; text-decoration: underlined; color: white;">health.tracker.ag@gmail.com</a></p>
              <p style="color: white; font-weight: 600">Visit our application: <a href="" style="font-size: 0.8rem; font-weight: 500; text-decoration: underlined; color: white;">Health Tracker</a></p>
          </footer>
      </body>`;
};
exports.composeEmail = composeEmail;
const account = {
    sendVerificationEmail,
    verifyEmail,
    changeEmail,
    changePasswordEmail,
    changePassword,
    deleteAccountEmail,
    deleteAccount,
};
exports.default = account;
//# sourceMappingURL=account.js.map