"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_1 = __importDefault(require("../controllers/auth"));
const router = express.Router();
// Signing in: Steps & Follow Ups
router.post("/check-email", auth_1.default.checkEmail);
router.post("/sign-in", auth_1.default.signIn);
exports.default = router;
//# sourceMappingURL=auth.js.map