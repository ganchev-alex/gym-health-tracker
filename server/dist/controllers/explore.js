"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoodb = require("mongodb");
const mongoose = require("mongoose");
const user_1 = __importDefault(require("../models/user"));
const ResError_1 = __importDefault(require("../util/ResError"));
const exploration_1 = __importDefault(require("../models/exploration"));
const sharedRoutine_1 = __importDefault(require("../models/sharedRoutine"));
const routine_1 = __importDefault(require("../models/routine"));
const getPersonalizedExplorations = async (req, res, next) => {
    const userData = res.locals.userData;
    if (!userData) {
        const error = new ResError_1.default("\n- func. getPersonalizedExplorations (explore router): userData wasn't passed properly.");
        return next(error);
    }
    try {
        const criteriaQuery = {
            _id: { $nin: userData.savedArticles },
            level: userData.preferences.fitnessLevel,
            sex: { $in: [userData.personalDetails.sex, "both"] },
            category: { $in: userData.preferences.selectedActivities },
            target: userData.preferences.fitnessGoal,
        };
        let explorations = await exploration_1.default.find(criteriaQuery)
            .select("title category duration image content.description")
            .limit(5);
        if (explorations.length < 5) {
            const addedIds = explorations.map((exploration) => exploration._id);
            const additionalCriteriaQuery = {
                _id: { $nin: addedIds },
                level: userData.preferences.fitnessLevel,
                sex: { $in: [userData.personalDetails.sex, "both"] },
                category: { $in: userData.preferences.selectedActivities },
            };
            const additionalRecords = await exploration_1.default.find(additionalCriteriaQuery)
                .select("title category duration image content.description")
                .limit(5 - explorations.length);
            explorations = [...explorations, ...additionalRecords];
        }
        userData.explorations = explorations;
        return res.status(200).json({
            message: `User data loaded successfully.`,
            userData,
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. getPersonalizedExplorations (explore router): Failed to send response.\n Error: " +
            err);
        return next(error);
    }
};
const getExplorations = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. getPersonalizedExplorations (explore router): User was not found.", 404);
            return next(error);
        }
        const fetchCount = +req.query.fetchCount;
        const cardsCount = 12;
        const skipCount = (fetchCount - 1) * cardsCount;
        const modifCategory = req.query.category
            ? req.query.category.replace(/_/g, " ").replace(/and/g, "&")
            : undefined;
        const modifDuration = req.query.duration
            ? req.query.duration.replace(/_/g, " ")
            : undefined;
        const keywordsArray = req.query.keywords
            ? req.query.keywords.split(" ")
            : undefined;
        const justForYouCriteria = {
            _id: { $nin: user.savedArticles },
            level: user.preferences.fitnessLevel,
            sex: { $in: [user.personalDetails.sex, "both"] },
            $or: modifCategory
                ? [{ category: modifCategory }]
                : [
                    {
                        category: { $in: user.preferences.selectedActivities },
                    },
                    { target: user.preferences.fitnessGoal },
                ],
        };
        const exploreAllCriteria = {};
        const exploreSavedCriteria = {
            _id: { $in: user.savedArticles },
        };
        if (modifCategory) {
            exploreAllCriteria.category = modifCategory;
            exploreSavedCriteria.category = modifCategory;
        }
        let criteriaQuery;
        if (req.query.mode === "just_for_you") {
            criteriaQuery = { ...justForYouCriteria };
        }
        else if (req.query.mode === "explore_all") {
            criteriaQuery = { ...exploreAllCriteria };
        }
        else if (req.query.mode === "saved") {
            criteriaQuery = { ...exploreSavedCriteria };
        }
        if (modifDuration) {
            switch (modifDuration) {
                case "Quick Session":
                    criteriaQuery.duration = { $lt: 1800 };
                    break;
                case "30 minutes":
                    criteriaQuery.duration = { $eq: 1800 };
                    break;
                case "Under an hour":
                    criteriaQuery.duration = { $gt: 1800, $lt: 3600 };
                    break;
                case "1 hour":
                    criteriaQuery.duration = { $eq: 3600 };
                    break;
                case "1:30 hours":
                    criteriaQuery.duration = { $gt: 3600, $lte: 5400 };
                    break;
                case "Long Sessions":
                    criteriaQuery.duration = { $gte: 5400 };
                    break;
            }
        }
        if (req.query.type) {
            switch (req.query.type) {
                case "routine":
                    criteriaQuery["content.type"] = "routine";
                    break;
                case "video":
                    criteriaQuery["content.type"] = "video";
                    break;
            }
        }
        if (keywordsArray && keywordsArray.length > 0) {
            criteriaQuery.$or = [];
            const titleRegexConditions = keywordsArray.map((keyword) => ({
                title: { $regex: keyword, $options: "i" },
            }));
            const keywordsMatchCondition = {
                keywords: {
                    $elemMatch: {
                        $in: keywordsArray.map((keyword) => new RegExp(keyword, "i")),
                    },
                },
            };
            criteriaQuery.$or.push({ $or: titleRegexConditions }, keywordsMatchCondition);
        }
        let cards = await exploration_1.default.find(criteriaQuery)
            .select("title category duration image")
            .skip(skipCount)
            .limit(cardsCount);
        if (cards.length > 0) {
            cards = [...shuffleResults(cards)];
        }
        return res
            .status(200)
            .json({ message: "New cards fetched successfully", cards });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. getPersonalizedExplorations (explore router): Failed to fetch personalized explorations.\nError: " +
            err);
        return next(error);
    }
};
const getExplorationData = async (req, res, next) => {
    const exploreId = req.query.exploreId;
    if (!mongoose.isValidObjectId(exploreId)) {
        const error = new ResError_1.default("The provided ID has an invalid format.", 400);
        return next(error);
    }
    try {
        const article = await exploration_1.default.findById(exploreId);
        if (article) {
            const userId = req.userId;
            const { savedArticles } = await user_1.default.findById(userId);
            let savedState = false;
            if (savedArticles) {
                savedState = savedArticles.includes(article._id.toString());
            }
            const relatedArticles = await exploration_1.default.aggregate([
                {
                    $match: {
                        _id: {
                            $nin: [
                                ...savedArticles.map((id) => new mongoodb.ObjectId(id)),
                                article._id,
                            ],
                        },
                        $or: [
                            { category: article.category },
                            { target: { $in: article.target } },
                        ],
                        sex: { $in: ["both", article.sex] },
                        level: { $in: article.level },
                    },
                },
                {
                    $sample: { size: 3 },
                },
                {
                    $project: { title: 1, category: 1, image: 1 },
                },
            ]);
            return res.status(200).json({
                message: "Article fetched successfully.",
                article,
                savedState,
                relatedArticles,
            });
        }
        else {
            return res.status(404).json({ message: "Article not found." });
        }
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. getExplorationData (explore router): Failed fetching the explore article.\nError: " +
            err);
        return next(error);
    }
};
const saveRoutine = async (req, res, next) => {
    const exploreId = req.query.exploreId;
    if (!mongoose.isValidObjectId(exploreId)) {
        const error = new ResError_1.default("The provided ID has an invalid format.", 400);
        return next(error);
    }
    try {
        const exploration = await exploration_1.default.findById(exploreId);
        if (!exploration) {
            const error = new ResError_1.default("Exploration record not found.", 404);
            return next(error);
        }
        const userId = req.userId;
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("User was not found.", 404);
            return next(error);
        }
        const newRoutines = [];
        await Promise.all(exploration.content.routines.map(async (routine) => {
            const routineData = await sharedRoutine_1.default.findById(routine);
            if (!routineData) {
                const error = new ResError_1.default("Shared routine was not found", 404);
                throw error;
            }
            const newRoutineObject = {
                userId,
                title: routineData.title,
                category: routineData.category,
                description: routineData.description,
                exercises: routineData.exercises,
                duration: routineData.duration,
            };
            const newRoutine = await new routine_1.default(newRoutineObject).save();
            if (!newRoutine) {
                const error = new ResError_1.default("Faulty process of saving the shared routine.");
                throw error;
            }
            const newRoutineData = await routine_1.default.findById(newRoutine._id).populate("exercises.exerciseData");
            newRoutines.push(newRoutineData);
            user.routines.push(newRoutine._id);
        }));
        user.savedArticles.push(exploration._id.toString());
        await user.save();
        return res
            .status(201)
            .json({ message: "Shared routine saved successfully.", newRoutines });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. saveRoutine (explore router): Failed saving the routine data.\nError: " +
            err);
        return next(error);
    }
};
const saveArticle = async (req, res, next) => {
    const userId = req.userId;
    try {
        if (!mongoose.isValidObjectId(req.query.exploreId)) {
            const error = new ResError_1.default("The provided ID has an invalid format.", 400);
            return next(error);
        }
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. removeSavedArticle (explore router): User not found", 404);
            return next(error);
        }
        const article = await exploration_1.default.findById(req.query.exploreId);
        if (article) {
            user.savedArticles.push(article._id.toString());
            await user.save();
            return res
                .status(200)
                .json({ message: "Article saved succesfully to user's collection." });
        }
        const error = new ResError_1.default("Article with this ID was not found.", 404);
        return next(error);
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. savedArticle (explore router): Couldn't save the article to user's collection.\nError:" +
            err);
        return next(error);
    }
};
const removeSavedArticle = async (req, res, next) => {
    const userId = req.userId;
    try {
        if (!mongoose.isValidObjectId(req.query.exploreId)) {
            const error = new ResError_1.default("The provided ID has an invalid format.", 400);
            return next(error);
        }
        const user = await user_1.default.findById(userId);
        if (!user) {
            const error = new ResError_1.default("\n- func. removeSavedArticle (explore router): User not found", 404);
            return next(error);
        }
        user.savedArticles = user.savedArticles.filter((article) => article !== req.query.exploreId);
        await user.save();
        return res.status(201).json({
            message: "Saved article removed successfully from user's collection.",
        });
    }
    catch (err) {
        const error = new ResError_1.default("\n- func. removeSavedArticle (explore router): Couldn't remove the article from user's saved collection.\nError:" +
            err);
        return next(error);
    }
};
const explore = {
    getPersonalizedExplorations,
    getExplorations,
    getExplorationData,
    saveRoutine,
    saveArticle,
    removeSavedArticle,
};
exports.default = explore;
const shuffleResults = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
//# sourceMappingURL=explore.js.map