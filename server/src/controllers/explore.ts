import express = require("express");
import mongoodb = require("mongodb");
import mongoose = require("mongoose");

import User from "../models/user";
import ResError from "../util/ResError";
import Exploration from "../models/exploration";
import SharedRoutine from "../models/sharedRoutine";
import Routine from "../models/routine";

const getPersonalizedExplorations = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userData = res.locals.userData;
  if (!userData) {
    const error = new ResError(
      "\n- func. getPersonalizedExplorations (explore router): userData wasn't passed properly."
    );
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

    let explorations = await Exploration.find(criteriaQuery)
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

      const additionalRecords = await Exploration.find(additionalCriteriaQuery)
        .select("title category duration image content.description")
        .limit(5 - explorations.length);

      explorations = [...explorations, ...additionalRecords];
    }

    userData.explorations = explorations;
    return res.status(200).json({
      message: `User data loaded successfully.`,
      userData,
    });
  } catch (err) {
    const error = new ResError(
      "\n- func. getPersonalizedExplorations (explore router): Failed to send response.\n Error: " +
        err
    );
    return next(error);
  }
};

const getExplorations = async (
  req: express.Request<
    {},
    {},
    {},
    {
      fetchCount: string;
      mode: string;
      category: string;
      duration: string;
      type: string;
      keywords: string;
    }
  >,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new ResError(
        "\n- func. getPersonalizedExplorations (explore router): User was not found.",
        404
      );
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

    const exploreAllCriteria: { category?: string } = {};
    const exploreSavedCriteria: { category?: string; _id } = {
      _id: { $in: user.savedArticles },
    };

    if (modifCategory) {
      exploreAllCriteria.category = modifCategory;
      exploreSavedCriteria.category = modifCategory;
    }

    let criteriaQuery;
    if (req.query.mode === "just_for_you") {
      criteriaQuery = { ...justForYouCriteria };
    } else if (req.query.mode === "explore_all") {
      criteriaQuery = { ...exploreAllCriteria };
    } else if (req.query.mode === "saved") {
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

      criteriaQuery.$or.push(
        { $or: titleRegexConditions },
        keywordsMatchCondition
      );
    }

    let cards = await Exploration.find(criteriaQuery)
      .select("title category duration image")
      .skip(skipCount)
      .limit(cardsCount);

    if (cards.length > 0) {
      cards = [...shuffleResults(cards)];
    }

    return res
      .status(200)
      .json({ message: "New cards fetched successfully", cards });
  } catch (err) {
    const error = new ResError(
      "\n- func. getPersonalizedExplorations (explore router): Failed to fetch personalized explorations.\nError: " +
        err
    );
    return next(error);
  }
};

const getExplorationData = async (
  req: express.Request<{}, {}, {}, { exploreId: string }>,
  res: express.Response,
  next: express.NextFunction
) => {
  const exploreId = req.query.exploreId;

  if (!mongoose.isValidObjectId(exploreId)) {
    const error = new ResError("The provided ID has an invalid format.", 400);
    return next(error);
  }

  try {
    const article = await Exploration.findById(exploreId);

    if (article) {
      const userId = (req as any).userId;
      const { savedArticles } = await User.findById(userId);

      let savedState = false;

      if (savedArticles) {
        savedState = savedArticles.includes(article._id.toString());
      }

      const relatedArticles = await Exploration.aggregate([
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
    } else {
      return res.status(404).json({ message: "Article not found." });
    }
  } catch (err) {
    const error = new ResError(
      "\n- func. getExplorationData (explore router): Failed fetching the explore article.\nError: " +
        err
    );
    return next(error);
  }
};

const saveRoutine = async (
  req: express.Request<{}, {}, {}, { exploreId: string }>,
  res: express.Response,
  next: express.NextFunction
) => {
  const exploreId = req.query.exploreId;

  if (!mongoose.isValidObjectId(exploreId)) {
    const error = new ResError("The provided ID has an invalid format.", 400);
    return next(error);
  }

  try {
    const exploration = await Exploration.findById(exploreId);

    if (!exploration) {
      const error = new ResError("Exploration record not found.", 404);
      return next(error);
    }

    const userId = (req as any).userId;
    const user = await User.findById(userId);

    if (!user) {
      const error = new ResError("User was not found.", 404);
      return next(error);
    }

    const newRoutines = [];

    await Promise.all(
      exploration.content.routines.map(async (routine) => {
        const routineData = await SharedRoutine.findById(routine);
        if (!routineData) {
          const error = new ResError("Shared routine was not found", 404);
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

        const newRoutine = await new Routine(newRoutineObject).save();

        if (!newRoutine) {
          const error = new ResError(
            "Faulty process of saving the shared routine."
          );
          throw error;
        }

        const newRoutineData = await Routine.findById(newRoutine._id).populate(
          "exercises.exerciseData"
        );

        newRoutines.push(newRoutineData);
        user.routines.push(newRoutine._id);
      })
    );

    user.savedArticles.push(exploration._id.toString());
    await user.save();

    return res
      .status(201)
      .json({ message: "Shared routine saved successfully.", newRoutines });
  } catch (err) {
    const error = new ResError(
      "\n- func. saveRoutine (explore router): Failed saving the routine data.\nError: " +
        err
    );
    return next(error);
  }
};

const saveArticle = async (
  req: express.Request<{}, {}, {}, { exploreId: string }>,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;
  try {
    if (!mongoose.isValidObjectId(req.query.exploreId)) {
      const error = new ResError("The provided ID has an invalid format.", 400);
      return next(error);
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new ResError(
        "\n- func. removeSavedArticle (explore router): User not found",
        404
      );
      return next(error);
    }

    const article = await Exploration.findById(req.query.exploreId);
    if (article) {
      user.savedArticles.push(article._id.toString());
      await user.save();
      return res
        .status(200)
        .json({ message: "Article saved succesfully to user's collection." });
    }

    const error = new ResError("Article with this ID was not found.", 404);
    return next(error);
  } catch (err) {
    const error = new ResError(
      "\n- func. savedArticle (explore router): Couldn't save the article to user's collection.\nError:" +
        err
    );
    return next(error);
  }
};

const removeSavedArticle = async (
  req: express.Request<{}, {}, {}, { exploreId: string }>,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  try {
    if (!mongoose.isValidObjectId(req.query.exploreId)) {
      const error = new ResError("The provided ID has an invalid format.", 400);
      return next(error);
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new ResError(
        "\n- func. removeSavedArticle (explore router): User not found",
        404
      );
      return next(error);
    }

    user.savedArticles = user.savedArticles.filter(
      (article) => article !== req.query.exploreId
    );
    await user.save();
    return res.status(201).json({
      message: "Saved article removed successfully from user's collection.",
    });
  } catch (err) {
    const error = new ResError(
      "\n- func. removeSavedArticle (explore router): Couldn't remove the article from user's saved collection.\nError:" +
        err
    );
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

export default explore;

const shuffleResults = function (array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
