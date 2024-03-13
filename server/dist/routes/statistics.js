"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const statistics_1 = __importDefault(require("../controllers/statistics"));
const router = express.Router();
router.get("/data", authValidation_1.default, statistics_1.default.getStatistics);
router.get("/essential", authValidation_1.default, statistics_1.default.getEssential);
exports.default = router;
//# sourceMappingURL=statistics.js.map