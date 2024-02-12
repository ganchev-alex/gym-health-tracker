import express = require("express");
import mongoodb = require("mongodb");
import mongoose = require("mongoose");

import User from "../models/user";
import Essential, { IEssential } from "../models/essentials";

import ResError from "../util/ResError";

interface updateEssentials {
  activityTime: number;
  burntCalories: number;
  wakeTime: string;
  bedTime: string;
  sleeptime: number;
  water: number;
  consumedCalories: number;
  calHistory: {
    timespan: string;
    meal: string;
    calories: number;
  };
}

const getEssentialsData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new ResError(
        "\n- func. getEssentialsData (ess router): User was not found.",
        404
      );
      return next(error);
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { essentialsID_Today, essentialsID_Yesterday } = retrieveEssentials(
      user.essentialsHistory
    );

    let essentialsToday: IEssential | null;
    let essentialsYesterday: IEssential | null;

    if (essentialsID_Today) {
      essentialsToday = await Essential.findById(essentialsID_Today).populate([
        {
          path: "workouts",
        },
        {
          path: "activities",
        },
      ]);
    } else {
      const newEssential = await new Essential({ date: today, userId }).save();
      essentialsToday = newEssential;
      user.essentialsHistory.push({
        date: today,
        essentials: newEssential._id,
      });
    }

    if (essentialsID_Yesterday) {
      essentialsYesterday = await Essential.findById(
        essentialsID_Yesterday
      ).populate([
        {
          path: "workouts",
        },
        {
          path: "activities",
        },
      ]);
    } else {
      const newEssential = await new Essential({
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
  } catch (err) {
    const error = new ResError(
      "\n- func. getEssentialsData (ess. router): Failed fetching of the user's essentials data.\nError: " +
        err
    );
    return next(error);
  }
};

const updateEssentials = async (
  req: express.Request<
    {},
    {},
    { todayEss: updateEssentials; yesterdayEss: updateEssentials }
  >,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new ResError(
        "\n- func. updateEssentials (ess router): User was not found.",
        404
      );
      return next(error);
    }

    const { essentialsID_Today, essentialsID_Yesterday } = retrieveEssentials(
      user.essentialsHistory
    );

    let essentialsToday;
    let essentialsYesterday;

    if (essentialsID_Today) {
      const updatedEssentials = await Essential.findByIdAndUpdate(
        essentialsID_Today,
        { $set: req.body.todayEss },
        { new: true }
      );

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
      const updatedEssentials = await Essential.findByIdAndUpdate(
        essentialsID_Yesterday,
        { $set: req.body.yesterdayEss },
        { new: true }
      );

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
  } catch (err) {
    const error = new ResError(
      "\n- func. updateEssentials (ess. router): Couldn't update the essentials data.\nError: " +
        err
    );
    return next(error);
  }
};

const retrieveEssentials = function (
  essentials: {
    date: Date;
    essentials: mongoose.Types.ObjectId;
  }[]
) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let essentialsID_Today: mongoose.Types.ObjectId | null = null;
  let essentialsID_Yesterday: mongoose.Types.ObjectId | null = null;

  for (let i = essentials.length - 1; i >= 0; i--) {
    const record = essentials[i];
    if (
      essentialsID_Today === null &&
      today.getFullYear() === record.date.getFullYear() &&
      today.getMonth() === record.date.getMonth() &&
      today.getDate() === record.date.getDate()
    ) {
      essentialsID_Today = record.essentials;
    }

    if (
      essentialsID_Yesterday === null &&
      yesterday.getFullYear() === record.date.getFullYear() &&
      yesterday.getMonth() === record.date.getMonth() &&
      yesterday.getDate() === record.date.getDate()
    ) {
      essentialsID_Yesterday = record.essentials;
    }

    if (essentialsID_Today != null && essentialsID_Yesterday != null) break;
  }

  return { essentialsID_Today, essentialsID_Yesterday };
};

const essentials = { getEssentialsData, updateEssentials };
export default essentials;
