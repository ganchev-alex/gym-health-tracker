import express = require("express");

import exerciseController from "../controllers/exercises";
import authValidation from "../middleware/authValidation";

const router = express.Router();

router.get("/get-all", exerciseController.exercises);
router.get("/best-set", authValidation, exerciseController.getBestSet);
router.post("/best-sets", authValidation, exerciseController.getBestSets);

export default router;
