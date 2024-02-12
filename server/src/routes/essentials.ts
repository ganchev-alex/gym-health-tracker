import express = require("express");

import essentials from "../controllers/essentials";
import authValidation from "../middleware/authValidation";

const router = express.Router();

router.get("/essentials-data", authValidation, essentials.getEssentialsData);
router.post("/update", authValidation, essentials.updateEssentials);

export default router;
