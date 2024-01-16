import express = require("express");

import exerciseController from "../controllers/exercises";

const router = express.Router();

// get: /exercises
router.get("/exercises", exerciseController.exercises);

export default router;
