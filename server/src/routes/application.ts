import express = require("express");

import application from "../controllers/application";
import authValidation from "../middleware/authValidation";

const router = express.Router();

router.get("/userData", authValidation, application.userData);

export default router;
