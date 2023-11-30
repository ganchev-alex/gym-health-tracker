import express = require("express");

import Exercise from "../models/exercise";

export const exercises = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const exercises = await Exercise.find();
    if (exercises) {
      res.status(200).json({
        message: "Exercises were fetched successfully.",
        exercises: exercises,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const exerciseController = {
  exercises: exercises,
};

export default exerciseController;
