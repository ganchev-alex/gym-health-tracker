import express = require("express");

import Exercise from "../models/exercise";
import ResError from "../util/ResError";

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

const exerciseController = {
  exercises: exercises,
};

export default exerciseController;
