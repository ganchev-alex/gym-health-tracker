"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const essentials_1 = __importDefault(require("../controllers/essentials"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const router = express.Router();
router.get("/essentials-data", authValidation_1.default, essentials_1.default.getEssentialsData);
router.post("/update", authValidation_1.default, essentials_1.default.updateEssentials);
exports.default = router;
//# sourceMappingURL=essentials.js.map