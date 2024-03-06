"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const explore_1 = __importDefault(require("../controllers/explore"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const router = express.Router();
router.get("/fetch-data", authValidation_1.default, explore_1.default.getExplorations);
router.get("/exploration", authValidation_1.default, explore_1.default.getExplorationData);
router.get("/save-routine", authValidation_1.default, explore_1.default.saveRoutine);
router.get("/save", authValidation_1.default, explore_1.default.saveArticle);
router.delete("/remove", authValidation_1.default, explore_1.default.removeSavedArticle);
exports.default = router;
//# sourceMappingURL=explore.js.map