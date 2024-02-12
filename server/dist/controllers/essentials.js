"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const essentials_1 = __importDefault(require("../models/essentials"));
const ResError_1 = __importDefault(require("../util/ResError"));
const getEssentialsData = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. getEssentialsData (ess router): User was not found.", 404);
            return next(error);
        }
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const { essentialsID_Today, essentialsID_Yesterday } = retrieveEssentials(user.essentialsHistory);
        let essentialsToday;
        let essentialsYesterday;
        if (essentialsID_Today) {
            essentialsToday = await essentials_1.default.findById(essentialsID_Today).populate([
                {
                    path: "workouts",
                },
                {
                    path: "activities",
                },
            ]);
        }
        else {
            const newEssential = await new essentials_1.default({ date: today, userId }).save();
            essentialsToday = newEssential;
            user.essentialsHistory.push({
                date: today,
                essentials: newEssential._id,
            });
        }
        if (essentialsID_Yesterday) {
            essentialsYesterday = await essentials_1.default.findById(essentialsID_Yesterday).populate([
                {
                    path: "workouts",
                },
                {
                    path: "activities",
                },
            ]);
        }
        else {
            const newEssential = await new essentials_1.default({
                date: yesterday,
                userId,
            }).save();
            essentialsYesterday = newEssential;
            user.essentialsHistory.push({
                date: yesterday,
                essentials: newEssential._id,
            });
        }
        await user.save();
        return res.status(200).json({
            message: "Essentials data retrieved.",
            essentialsToday,
            essentialsYesterday,
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. getEssentialsData (ess. router): Failed fetching of the user's essentials data.\nError: " +
            err);
        return next(error);
    }
};
const updateEssentials = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. updateEssentials (ess router): User was not found.", 404);
            return next(error);
        }
        const { essentialsID_Today, essentialsID_Yesterday } = retrieveEssentials(user.essentialsHistory);
        let essentialsToday;
        let essentialsYesterday;
        if (essentialsID_Today) {
            const updatedEssentials = await essentials_1.default.findByIdAndUpdate(essentialsID_Today, { $set: req.body.todayEss }, { new: true });
            essentialsToday = await updatedEssentials.populate([
                {
                    path: "workouts",
                },
                {
                    path: "activities",
                },
            ]);
        }
        if (essentialsID_Yesterday) {
            const updatedEssentials = await essentials_1.default.findByIdAndUpdate(essentialsID_Yesterday, { $set: req.body.yesterdayEss }, { new: true });
            essentialsYesterday = await updatedEssentials.populate([
                {
                    path: "workouts",
                },
                {
                    path: "activities",
                },
            ]);
        }
        return res.status(201).json({
            message: "Essentials updated successfully.",
            essentialsToday,
            essentialsYesterday,
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. updateEssentials (ess. router): Couldn't update the essentials data.\nError: " +
            err);
        return next(error);
    }
};
const retrieveEssentials = function (essentials) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let essentialsID_Today = null;
    let essentialsID_Yesterday = null;
    for (let i = essentials.length - 1; i >= 0; i--) {
        const record = essentials[i];
        if (essentialsID_Today === null &&
            today.getFullYear() === record.date.getFullYear() &&
            today.getMonth() === record.date.getMonth() &&
            today.getDate() === record.date.getDate()) {
            essentialsID_Today = record.essentials;
        }
        if (essentialsID_Yesterday === null &&
            yesterday.getFullYear() === record.date.getFullYear() &&
            yesterday.getMonth() === record.date.getMonth() &&
            yesterday.getDate() === record.date.getDate()) {
            essentialsID_Yesterday = record.essentials;
        }
        if (essentialsID_Today != null && essentialsID_Yesterday != null)
            break;
    }
    return { essentialsID_Today, essentialsID_Yesterday };
};
const essentials = { getEssentialsData, updateEssentials };
exports.default = essentials;
//# sourceMappingURL=essentials.js.map