"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const exercises_1 = __importDefault(require("../controllers/exercises"));
const router = express.Router();
// get: /exercises
router.get("/exercises", exercises_1.default.exercises);
exports.default = router;
//# sourceMappingURL=exercises.js.map