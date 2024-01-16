"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const userData = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (user) {
            const appData = {
                auth: { email: user.auth.email },
                personalDetails: {
                    firstName: user.personalDetails.firstName,
                    lastNamee: user.personalDetails.lastName,
                    sex: user.personalDetails.profilePicture,
                },
            };
            return res.status(200).json({
                message: `User was found: ${userId}`,
                appData,
            });
        }
        else {
            return res.status(404).json({
                message: `User was not found!`,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500);
    }
};
const application = {
    userData,
};
exports.default = application;
//# sourceMappingURL=user.js.map