import express = require("express");
const { check } = require("express-validator");

import accountController from "../controllers/account";
import authValidation from "../middleware/authValidation";

const router = express.Router();

const passwordValidation = [
  check("oldPassword")
    .isLength({ min: 8, max: 20 })
    .withMessage("Invalid currant password.")
    .trim(),
  check("newPassword")
    .isLength({ min: 8, max: 20 })
    .withMessage("Invalid new password.")
    .trim(),
  check("passwordCheck")
    .isLength({ min: 8, max: 20 })
    .withMessage("Invalid check password.")
    .trim(),
];

router.get(
  "/verification-email",
  authValidation,
  accountController.sendVerificationEmail
);
router.get("/verify", accountController.verifyEmail);
router.post(
  "/change-email",
  check("email").isEmail().withMessage("Invalid email!").normalizeEmail(),
  authValidation,
  accountController.changeEmail
);

router.get(
  "/password-email",
  authValidation,
  accountController.changePasswordEmail
);
router.post(
  "/change-password",
  passwordValidation,
  accountController.changePassword
);

router.get(
  "/delete-email",
  authValidation,
  accountController.deleteAccountEmail
);
router.post(
  "/delete-account",
  check("email").normalizeEmail(),
  accountController.deleteAccount
);

export default router;
