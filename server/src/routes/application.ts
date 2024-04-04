import express = require("express");
const { check } = require("express-validator");

import application from "../controllers/application";
import authValidation from "../middleware/authValidation";

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

router.post(
  "/save-workout",
  authValidation,
  workoutValidator,
  application.saveWorkout
);
router.post(
  "/save-session",
  authValidation,
  sessionValidator,
  application.saveActivitySession
);
router.get("/user-data", authValidation, application.userData);
router.get("/routines", authValidation, application.getRoutines);
router.post(
  "/new-routine",
  authValidation,
  routineValidatiors,
  application.newRoutine
);
router.post(
  "/update-routine",
  authValidation,
  routineValidatiors,
  application.updateRoutine
);
router.delete("/delete-routine", authValidation, application.deleteRoutine);
router.get("/user-history", authValidation, application.getUserHistory);
router.get("/history-records", authValidation, application.getHistoryRecords);

export default router;
