"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { check } = require("express-validator");
const application_1 = __importDefault(require("../controllers/application"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const router = express.Router();
const workoutValidator = [
    check("date").isISO8601(),
    check("title").notEmpty(),
    check("category").notEmpty(),
    check("exercises.*.exerciseId").isMongoId(),
    check("exercises.*.name").notEmpty(),
    check("exercises.*.sets.*.reps").isDecimal({ min: 1 }),
    check("exercises.*.sets.*.kg").isDecimal({ min: 0 }),
    check("duration").isInt(),
    check("volume").isDecimal(),
    check("sets").isInt(),
];
const sessionValidator = [
    check("date").isISO8601(),
    check("title").notEmpty(),
    check("category").notEmpty(),
    check("duration").isInt(),
    check("burntCalories").isInt(),
];
const routineValidatiors = [
    check("routineData.title").notEmpty(),
    check("routineData.category").notEmpty(),
    check("routineExercises.*.exercise").isMongoId(),
    check("routineExercises.*.sets").isInt({ min: 1 }),
    check("routineExercises.*.restTime").isInt({ min: 0 }),
];
router.post("/save-workout", authValidation_1.default, workoutValidator, application_1.default.saveWorkout);
router.post("/save-session", authValidation_1.default, sessionValidator, application_1.default.saveActivitySession);
router.get("/user-data", authValidation_1.default, application_1.default.userData);
router.get("/routines", authValidation_1.default, application_1.default.getRoutines);
router.post("/new-routine", authValidation_1.default, routineValidatiors, application_1.default.newRoutine);
router.post("/update-routine", authValidation_1.default, routineValidatiors, application_1.default.updateRoutine);
router.delete("/delete-routine", authValidation_1.default, application_1.default.deleteRoutine);
router.get("/user-history", authValidation_1.default, application_1.default.getUserHistory);
router.get("/history-records", authValidation_1.default, application_1.default.getHistoryRecords);
exports.default = router;
//# sourceMappingURL=application.js.map