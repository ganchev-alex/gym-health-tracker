import express = require("express");

import Exercise from "../models/exercise";
import ResError from "../util/ResError";
import User from "../models/user";

export const exercises = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const exercises = await Exercise.find();
    if (exercises) {
      return res.status(200).json({
        message: "Exercises were fetched successfully.",
        exercises: exercises,
      });
    } else {
      return res.status(204).json({
        message: "No data found.",
        exercises: exercises,
      });
    }
  } catch (err) {
    const error = new ResError(
      "\n- func. exercises (exercises router): Failed to fetch exercise data.\nError: " +
        err
    );
    return next(error);
  }
};

const getBestSet = async (
  req: express.Request<{}, {}, {}, { exerciseId: string }>,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new ResError("User was not found!", 404);
      return next(error);
    }

    const bestSet = user.exerciseRecords.find(
      (record) => record.exerciseId.toString() === req.query.exerciseId
    );

    if (bestSet) {
      return res
        .status(200)
        .json({
          message: "Best set was found.",
          bestSet: { kg: bestSet.kg, reps: bestSet.reps },
        });
    } else {
      return res
        .status(200)
        .json({
          message: "Currantly no best record.",
          bestSet: { kg: 0, reps: 0 },
        });
    }
  } catch (err) {
    const error = new ResError(
      "\n- func. exercises (exercises router): Failed to fetch exercise's best set.\nError: " +
        err
    );
    return next(error);
  }
};

const exerciseController = {
  exercises,
  getBestSet,
};

export default exerciseController;
