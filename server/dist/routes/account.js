"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { check } = require("express-validator");
const account_1 = __importDefault(require("../controllers/account"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
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
router.get("/verification-email", authValidation_1.default, account_1.default.sendVerificationEmail);
router.get("/verify", account_1.default.verifyEmail);
router.post("/change-email", check("email").isEmail().withMessage("Invalid email!").normalizeEmail(), authValidation_1.default, account_1.default.changeEmail);
router.get("/password-email", authValidation_1.default, account_1.default.changePasswordEmail);
router.post("/change-password", passwordValidation, account_1.default.changePassword);
router.get("/delete-email", authValidation_1.default, account_1.default.deleteAccountEmail);
router.post("/delete-account", check("email").normalizeEmail(), account_1.default.deleteAccount);
exports.default = router;
//# sourceMappingURL=account.js.map