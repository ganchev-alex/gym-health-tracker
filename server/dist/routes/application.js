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
const routineValidatiors = [
    check("routineData.title").notEmpty(),
    check("routineData.category").notEmpty(),
    check("routineExercises.*.exercise").isMongoId(),
    check("routineExercises.*.sets").isInt({ min: 1 }),
    check("routineExercises.*.restTime").isInt({ min: 0 }),
];
router.get("/user-data", authValidation_1.default, application_1.default.userData);
router.get("/routines", authValidation_1.default, application_1.default.getRoutines);
router.post("/new-routine", authValidation_1.default, routineValidatiors, application_1.default.newRoutine);
router.post("/update-routine", authValidation_1.default, routineValidatiors, application_1.default.updateRoutine);
router.delete("/delete-routine", authValidation_1.default, application_1.default.deleteRoutine);
exports.default = router;
//# sourceMappingURL=application.js.map