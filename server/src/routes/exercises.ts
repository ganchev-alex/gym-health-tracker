import express = require("express");

import exerciseController from "../controllers/exercises";

const router = express.Router();

// get: /exercises
router.post("/", exerciseController.exercises);

export default router;
