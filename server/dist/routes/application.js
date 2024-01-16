"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const application_1 = __importDefault(require("../controllers/application"));
const authValidation_1 = __importDefault(require("../middleware/authValidation"));
const router = express.Router();
router.get("/userData", authValidation_1.default, application_1.default.userData);
exports.default = router;
//# sourceMappingURL=application.js.map