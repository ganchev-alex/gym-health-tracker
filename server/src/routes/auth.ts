import express = require("express");
const { check } = require("express-validator");

import authController from "../controllers/auth";
import authValidation from "../middleware/authValidation";

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
router.post(
  "/check-email",
  check("email").isEmail().normalizeEmail(),
  authController.checkEmail
);
router.post("/sign-in", signInValidators, authController.signIn);
router.post("/set-preferences", authValidation, authController.setPreferences);
router.post("/login", loginValidators, authController.login);

export default router;
