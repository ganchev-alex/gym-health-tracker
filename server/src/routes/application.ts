import express = require("express");
const { check } = require("express-validator");

import application from "../controllers/application";
import authValidation from "../middleware/authValidation";

const router = express.Router();

const routineValidatiors = [
  check("routineData.title").notEmpty(),
  check("routineData.category").notEmpty(),
  check("routineExercises.*.exercise").isMongoId(),
  check("routineExercises.*.sets").isInt({ min: 1 }),
  check("routineExercises.*.restTime").isInt({ min: 0 }),
];

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
