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
// {
//     "routineData": {
//         "title": "Test Routine",
//         "category": "Test Category",
//         "description": "Test Description"
//     },
//     "routineExercises": [
//         {"exersiceId": "65451643d12c2be3259de728", "sets": 3, "restTime": 130},
//         {"exersiceId": "6576dfd33395050836108a24", "sets": 2, "restTime": 130},
//         {"exersiceId": "6576e2723395050836108a2a", "sets": 3, "restTime": 130}
//     ]
// }
const newRoutineValidatiors = [
    check("routineData.title").notEmpty(),
    check("routineData.category").notEmpty(),
    check("routineExercises.*.exerciseId").isMongoId(),
    check("routineExercises.*.sets").isInt({ min: 1 }),
    check("routineExercises.*.restTime").isInt({ min: 0 }),
];
router.get("/user-data", authValidation_1.default, application_1.default.userData);
router.post("/new-routine", authValidation_1.default, newRoutineValidatiors, application_1.default.newRoutine);
exports.default = router;
//# sourceMappingURL=application.js.map