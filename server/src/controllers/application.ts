import express = require("express");
import mongoodb = require("mongodb");
import mongoose = require("mongoose");

const { validationResult } = require("express-validator");

import User from "../models/user";
import Routine from "../models/routine";

interface newRoutineRequest {
  userId: string;
  routineData: {
    title: string;
    category: string;
    description: string;
  };
  routineExercises: { exersiceId: string; sets: number; restTime: number }[];
}

const userData = async (req: express.Request, res: express.Response) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId);

    if (user) {
      const appData = {
        auth: { email: user.auth.email },
        personalDetails: {
          firstName: user.personalDetails.firstName,
          lastNamee: user.personalDetails.lastName,
          sex: user.personalDetails.sex,
          profilePicture: user.personalDetails.profilePicture,
        },
      };

      return res.status(200).json({
        message: `User was found: ${userId}`,
        appData,
      });
    } else {
      return res.status(404).json({
        message: `User was not found!`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

const newRoutine = async (
  req: express.Request<{}, {}, newRoutineRequest>,
  res: express.Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).json({ message: "Compromised Validation!" });
  }

  const routineData = {
    userId: new mongoodb.ObjectId((req as any).userId),
    title: req.body.routineData.title,
    category: req.body.routineData.category,
    description: req.body.routineData.description,
    exercises: req.body.routineExercises.map((record) => {
      return {
        exerciseId: new mongoodb.ObjectId(record.exersiceId),
        sets: record.sets,
        restTime: record.restTime,
      };
    }),
  };

  try {
    const user = await User.findOne({ _id: routineData.userId });
    if (!user) {
      return res.status(404).json({
        message: "User with this id does not excist.",
      });
    }

    const newRoutine = await new Routine(routineData).save();

    if (!newRoutine) {
      return res.status(500).json({
        message: "Faulty process of saving the new routine.",
      });
    }

    user.routines.push(newRoutine._id);
    await user.save();

    return res.status(201).json({ message: "New routine saved successfully." });
  } catch (error) {
    console.log("Error creating the new routine", error);
    return res.status(500).json({ message: "Internal Server error." });
  }
};

const application = {
  userData,
  newRoutine,
};

export default application;
