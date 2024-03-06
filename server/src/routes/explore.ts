import express = require("express");

import explore from "../controllers/explore";
import authValidation from "../middleware/authValidation";

const router = express.Router();

router.get("/fetch-data", authValidation, explore.getExplorations);
router.get("/exploration", authValidation, explore.getExplorationData);
router.get("/save-routine", authValidation, explore.saveRoutine);
router.get("/save", authValidation, explore.saveArticle);
router.delete("/remove", authValidation, explore.removeSavedArticle);

export default router;
