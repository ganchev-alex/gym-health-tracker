"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const exercises_1 = __importDefault(require("../controllers/exercises"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const router = express.Router();
router.get("/get-all", exercises_1.default.exercises);
router.get("/best-set", authValidation_1.default, exercises_1.default.getBestSet);
exports.default = router;
//# sourceMappingURL=exercises.js.map