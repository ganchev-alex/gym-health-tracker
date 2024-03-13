import express = require("express");
import authValidation from "../middleware/authValidation";
import statistic from "../controllers/statistics";

const router = express.Router();

router.get("/data", authValidation, statistic.getStatistics);
router.get("/essential", authValidation, statistic.getEssential);

export default router;
