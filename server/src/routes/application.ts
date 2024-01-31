import express = require("express");
const { check } = require("express-validator");

import application from "../controllers/application";
import authValidation from "../middleware/authValidation";

const router = express.Router();

const workoutValidator = [
  check("date").isDate(),
  check("title").notEmpty(),
  check("category").notEmpty(),
  check("exercises.*.exerciseId").isMongoId(),
  check("exercises.*.name").notEmpty(),
  check("exercises.*.sets.reps").isInt({ min: 1 }),
  check("exercises.*.sets.kg").isInt({ min: 0 }),
  check("duration").isInt(),
  check("volume").isInt(),
  check("sets").isInt(),
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

export default router;
