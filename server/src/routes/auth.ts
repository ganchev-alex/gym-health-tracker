import express = require("express");

import authController from "../controllers/auth";

const router = express.Router();

// Signing in: Steps & Follow Ups
router.post("/check-email", authController.checkEmail);
router.post("/sign-in", authController.signIn);

export default router;
