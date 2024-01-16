import express = require("express");

import Exercise from "../models/exercise";

export const exercises = async (
  req: express.Request,
  res: express.Response
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const exerciseController = {
  exercises: exercises,
};

export default exerciseController;
