"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { check } = require("express-validator");
const auth_1 = __importDefault(require("../controllers/auth"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const router = express.Router();
const signInValidators = [
    check("email").isEmail().withMessage("Invalid email!").normalizeEmail(),
    check("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("Invalid password.")
        .trim(),
    check("firstName").isAlpha().withMessage("Invalid first name.").trim(),
    check("lastName").isAlpha().withMessage("Invalid last name.").trim(),
    check("age").isInt().withMessage("Invalid age.").toInt(),
    check("weight").isDecimal().withMessage("Invalid weight.").toFloat(),
    check("height").isDecimal().withMessage("Invalid height.").toFloat(),
    check("sex")
        .custom((value) => {
        if (value != "male" && value != "female") {
            throw new Error("Invalid sex!");
        }
        return true;
    })
        .withMessage("Invalid sex."),
];
const loginValidators = [
    check("email").isEmail().withMessage("Invalid email.").normalizeEmail(),
    check("password").isLength({ min: 8, max: 20 }).trim(),
];
// Signing in: Steps & Follow Ups
router.post("/check-email", check("email").isEmail(), auth_1.default.checkEmail);
router.post("/sign-in", signInValidators, auth_1.default.signIn);
router.post("/set-preferences", authValidation_1.default, auth_1.default.setPreferences);
router.post("/login", loginValidators, auth_1.default.login);
exports.default = router;
//# sourceMappingURL=auth.js.map