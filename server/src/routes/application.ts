import express = require("express");
const { check } = require("express-validator");

import application from "../controllers/application";
import authValidation from "../middleware/authValidation";

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

router.get("/user-data", authValidation, application.userData);
router.post(
  "/new-routine",
  authValidation,
  newRoutineValidatiors,
  application.newRoutine
);

export default router;
