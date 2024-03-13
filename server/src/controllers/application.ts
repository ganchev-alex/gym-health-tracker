import express = require("express");
import mongoodb = require("mongodb");
import mongoose = require("mongoose");

const { validationResult } = require("express-validator");

import User from "../models/user";
import Routine from "../models/routine";
import Workout, { IWorkout } from "../models/workout";
import ActivitySession, { IActivitySession } from "../models/activity-session";
import Essential from "../models/essentials";

import ResError from "../util/ResError";
import explore from "./explore";
import Statistic from "../models/statistic";
import { getWeekNumber } from "../util/dateModification";
import { insertMuscleDistributionData } from "./statistics";

interface newRoutineRequest {
  routineData: {
    title: string;
    category: string;
    description: string;
  };
  routineExercises: {
    exercise: string;
    sets: number;
    restTime: number;
    notes: string;
  }[];
}

interface updatedRoutine {
  routineId: string;
  routineData: {
    title: string;
    category: string;
    description: string;
  };
  routineExercises: {
    exercise: string;
    sets: number;
    restTime: number;
    notes: string;
  }[];
}

interface userHistory {
  month?: string;
  year?: string;
}

const userData = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId).populate({
      path: "routines",
      populate: {
        path: "exercises.exerciseData",
        model: "Exercise",
      },
    });

    if (user) {
      const userData: any = {
        email: user.auth.email,
        personalDetails: {
          firstName: user.personalDetails.firstName,
          lastName: user.personalDetails.lastName,
          sex: user.personalDetails.sex,
          profilePicture: user.personalDetails.profilePicture,
          weight: user.personalDetails.weight,
          height: user.personalDetails.height,
          age: user.personalDetails.age,
        },
        routines: user.routines,
        preferences: user.preferences,
        savedArticles: user.savedArticles,
      };

      res.locals.userData = userData;
      return explore.getPersonalizedExplorations(req, res, next);
    } else {
      const error = new ResError(
        "\n- func. userData (application router): User was not found.",
        404
      );
      return next(error);
    }
  } catch (err) {
    const error = new ResError(
      "\n- func. userData (application router): Failed to fetch user data.\nError: " +
        err
    );
    return next(error);
  }
};

const getRoutines = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = new mongoodb.ObjectId((req as any).userId);

  try {
    const user = await User.findById(userId).populate({
      path: "routines",
      populate: {
        path: "exercises.exerciseData",
        model: "Exercise",
      },
    });

    if (user) {
      return res.status(200).json({
        message: "User found! Fetching successfull",
        routines: user.routines,
      });
    } else {
      const error = new ResError(
        "\n- func. getRoutines (application router): User was not found.",
        404
      );
      return next(error);
    }
  } catch (err) {
    const error = new ResError(
      "\n- func. getRoutines (application router): Failed to retrieve user's routines data.\nError: " +
        err
    );
    return next(error);
  }
};

const newRoutine = async (
  req: express.Request<{}, {}, newRoutineRequest>,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new ResError(
      "\n- func. newRoutine (application router): Compromized validation. The user haven't followed the validation instructions on the front end.",
      422
    );
    return next(error);
  }

  const routineData = {
    userId: new mongoodb.ObjectId((req as any).userId),
    title: req.body.routineData.title,
    category: req.body.routineData.category,
    description: req.body.routineData.description,
    exercises: req.body.routineExercises.map((record) => {
      return {
        exerciseData: new mongoodb.ObjectId(record.exercise),
        sets: record.sets,
        restTime: record.restTime,
        notes: record.notes,
      };
    }),
    duration: 0,
  };

  routineData.duration = routineData.exercises.reduce(
    (accumulator, currantExercise) => {
      if (currantExercise.restTime != 0) {
        accumulator += (currantExercise.restTime + 60) * currantExercise.sets;
      } else {
        accumulator += currantExercise.sets * 60;
      }
      return accumulator;
    },
    0
  );

  try {
    const user = await User.findOne({ _id: routineData.userId });
    if (!user) {
      const error = new ResError(
        "\n- func. newRoutine (application router): User was not found.",
        404
      );
      return next(error);
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
  } catch (err) {
    const error = new ResError(
      "\n- func. newRoutine (application router): Couldn't create a new routine.\nError: " +
        err
    );
    return next(error);
  }
};

const updateRoutine = async (
  req: express.Request<{}, {}, updatedRoutine>,
  res: express.Response,
  next: express.NextFunction
) => {
  const routineId = new mongoodb.ObjectId(req.body.routineId);
  const userId = (req as any).userId;
  const updatedRoutineData = req.body;

  try {
    const updatedRoutine = await Routine.findOneAndUpdate(
      { _id: routineId, userId: userId },
      {
        $set: {
          title: updatedRoutineData.routineData.title,
          category: updatedRoutineData.routineData.category,
          description: updatedRoutineData.routineData.description,
          exercises: updatedRoutineData.routineExercises.map((record) => ({
            exerciseData: new mongoodb.ObjectId(record.exercise),
            sets: record.sets,
            restTime: record.restTime,
            notes: record.notes,
          })),
          duration: updatedRoutineData.routineExercises.reduce(
            (accumulator, currentExercise) => {
              if (currentExercise.restTime !== 0) {
                accumulator +=
                  (currentExercise.restTime + 60) * currentExercise.sets;
              } else {
                accumulator += currentExercise.sets * 60;
              }
              return accumulator;
            },
            0
          ),
        },
      },
      { new: true }
    ).populate("exercises.exerciseData");

    if (updatedRoutine) {
      return res.status(201).json({
        message: "Routine was updated successfully.",
        updatedRoutine,
      });
    }

    const error = new ResError(
      "\n- func. updateRoutine (application router): Routine was not found.",
      404
    );
    return next(error);
  } catch (err) {
    const error = new ResError(
      "\n- func. updateRoutine (application router): Coudln't update the existing routine.\nError: " +
        err
    );
    return next(error);
  }
};

const deleteRoutine = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const routineId = new mongoodb.ObjectId(req.body.routineId);
  const userId = (req as any).userId;

  try {
    const result = await Routine.findByIdAndDelete(routineId);
    if (result) {
      const user = await User.findById(userId);
      if (user) {
        user.routines = user.routines.filter((routine) => {
          return routine._id.toString() !== routineId.toString();
        });

        await user.save();

        return res
          .status(200)
          .json({ message: "Routine was deleted succesfully." });
      } else {
        const error = new ResError(
          "\n- func. deleteRoutine (application router): User was not found.",
          404
        );
        return next(error);
      }
    } else {
      const error = new ResError(
        "\n- func. deleteRoutine (application router): Routine was not found.",
        404
      );
      return next(error);
    }
  } catch (err) {
    const error = new ResError(
      "\n- func. deleteRoutine (application router): Couldn't delete the existing routine.\nError" +
        err
    );
    return next(error);
  }
};

const saveWorkout = async (
  req: express.Request<{}, {}, IWorkout>,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new ResError(
      "\n- func. saveWorkout (application router): Compromized validation. The user haven't followed the validation instructions on the front end.",
      422
    );
    return next(error);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new ResError(
        "\n- func. saveWorkout (application router): User was not found.",
        404
      );
      return next(error);
    }

    const referenceDate = new Date();
    let statistics = await Statistic.findOne({ userId: user._id });
    if (!statistics) {
      statistics = await new Statistic({
        userId: user._id,
        muscleDistribution: [
          {
            week: getWeekNumber(referenceDate),
            month: referenceDate.getMonth(),
            year: referenceDate.getFullYear(),
            tracker: [
              {
                muscle: "back",
                counter: 0,
              },
              {
                muscle: "chest",
                counter: 0,
              },
              {
                muscle: "core",
                counter: 0,
              },
              {
                muscle: "shoulders",
                counter: 0,
              },
              {
                muscle: "arms",
                counter: 0,
              },
              {
                muscle: "legs",
                counter: 0,
              },
            ],
          },
        ],
      });
    }

    const newRecords: { exercise: string; kg: number }[] = [];
    let muscleDistribution = statistics.muscleDistribution.find(
      (chunk) =>
        chunk.week === getWeekNumber(referenceDate) &&
        chunk.month === referenceDate.getMonth() &&
        chunk.year === referenceDate.getFullYear()
    );
    let isNewChunk = false;

    if (!muscleDistribution) {
      isNewChunk = true;
      muscleDistribution = {
        week: getWeekNumber(referenceDate),
        month: referenceDate.getMonth(),
        year: referenceDate.getFullYear(),
        tracker: [
          {
            muscle: "back",
            counter: 0,
          },
          {
            muscle: "chest",
            counter: 0,
          },
          {
            muscle: "core",
            counter: 0,
          },
          {
            muscle: "shoulders",
            counter: 0,
          },
          {
            muscle: "arms",
            counter: 0,
          },
          {
            muscle: "legs",
            counter: 0,
          },
        ],
      };
    }

    req.body.exercises.forEach((exercise) => {
      const previousRecordIndex = user.exerciseRecords.findIndex(
        (record) =>
          record.exerciseId.toString() === exercise.exerciseId.toString()
      );

      const bestSet = exercise.sets.reduce(
        (best, set) => {
          if (set.kg > best.kg) {
            best = { ...set };
          }

          return best;
        },
        { reps: 0, kg: 0 }
      );

      if (bestSet.kg > 0) {
        if (previousRecordIndex > -1) {
          if (user.exerciseRecords[previousRecordIndex].kg < bestSet.kg) {
            user.exerciseRecords[previousRecordIndex] = {
              exerciseId: new mongoodb.ObjectId(exercise.exerciseId),
              ...bestSet,
            };
            newRecords.push({ exercise: exercise.name, kg: bestSet.kg });
          }
        } else {
          user.exerciseRecords.push({
            exerciseId: new mongoodb.ObjectId(exercise.exerciseId),
            ...bestSet,
          });
        }
      }

      insertMuscleDistributionData(muscleDistribution, exercise.muscles);
    });

    if (isNewChunk) {
      statistics.muscleDistribution.push(muscleDistribution);
    } else {
      statistics.muscleDistribution[
        statistics.muscleDistribution.findIndex(
          (chunk) =>
            chunk.week === getWeekNumber(referenceDate) &&
            chunk.month === referenceDate.getMonth() &&
            chunk.year === referenceDate.getFullYear()
        )
      ] = muscleDistribution;
    }

    await statistics.save();

    const workoutData = {
      userId,
      date: req.body.date,
      title: req.body.title,
      category: req.body.category,
      exercises: req.body.exercises,
      duration: req.body.duration,
      volume: req.body.volume,
      sets: req.body.sets,
    };

    const workout = await new Workout(workoutData).save();

    if (!workout) {
      return res
        .status(500)
        .json({ message: "Faulty process of saving the workout." });
    }

    user.workoutHistory.push({ date: workoutData.date, workout: workout._id });
    const essentialsRecord = user.essentialsHistory.find((essentials) => {
      return (
        essentials.date.getFullYear() === workout.date.getFullYear() &&
        essentials.date.getMonth() === workout.date.getMonth() &&
        essentials.date.getDate() === workout.date.getDate()
      );
    });
    if (essentialsRecord) {
      await Essential.findByIdAndUpdate(essentialsRecord.essentials, {
        $push: {
          workouts: workout._id,
        },
      });
    } else {
      const newEssentials = await new Essential({
        date: workout.date,
        userId: user._id,
        workouts: [workout._id],
      });

      await newEssentials.save();
    }
    await user.save();

    return res.status(201).json({
      message: "Workout saved succesfully!",
      workoutNumber: user.workoutHistory.length,
      newRecords,
      workoutData: workout,
    });
  } catch (err) {
    const error = new ResError(
      "\n- func. saveWorkout (application router): Failed saving the workout to the user's data.\nError: " +
        err
    );
    return next(error);
  }
};

const saveActivitySession = async (
  req: express.Request<{}, {}, IActivitySession>,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new ResError(
        "\n- func. saveActivitySession (application router): User was not found.",
        404
      );
      return next(error);
    }

    const sessionData: IActivitySession = {
      userId: new mongoodb.ObjectId(userId),
      date: req.body.date,
      title: req.body.title,
      category: req.body.category,
      duration: req.body.duration,
      burntCalories: req.body.burntCalories,
    };

    const session = await new ActivitySession(sessionData).save();
    if (!session) {
      return res
        .status(500)
        .json({ message: "Faulty process of saving the session." });
    }

    user.activitySessionHistory.push({
      date: session.date,
      session: session._id,
    });
    const essentialsRecord = user.essentialsHistory.find((essentials) => {
      return (
        essentials.date.getFullYear() === session.date.getFullYear() &&
        essentials.date.getMonth() === session.date.getMonth() &&
        essentials.date.getDate() === session.date.getDate()
      );
    });
    if (essentialsRecord) {
      await Essential.findByIdAndUpdate(essentialsRecord.essentials, {
        $push: {
          activities: session._id,
        },
      });
    } else {
      const newEssentials = await new Essential({
        date: session.date,
        userId: user._id,
        activities: [session._id],
      });

      await newEssentials.save();
    }

    await user.save();
    return res.status(201).json({
      message: "Session saved succesfully!",
      sessionNumber: user.activitySessionHistory.length,
      sessionData: session,
    });
  } catch (err) {
    const error = new ResError(
      "\n- func. saveActivitySession (application router): Failed to save the activity session to the user's data.\nError: " +
        err
    );
    return next(error);
  }
};

const getUserHistory = async (
  req: express.Request<{}, {}, {}, userHistory>,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;
  const { month, year } = req.query;
  const targetMonth = parseInt(month, 10);
  const targetYear = parseInt(year, 10);

  try {
    const user = await User.findById(userId).populate(
      "activitySessionHistory.session"
    );
    if (!user) {
      const error = new ResError(
        "\n- func. getUserHistory (application router): User was not found.",
        404
      );
      return next(error);
    }

    const currantMonthWorkoutHistory = user.workoutHistory.filter((workout) => {
      return (
        workout.date.getMonth() === targetMonth &&
        workout.date.getFullYear() === targetYear
      );
    });

    const currantMonthSessionHistory = user.activitySessionHistory.filter(
      (session) => {
        return (
          session.date.getMonth() === targetMonth &&
          session.date.getFullYear() === targetYear
        );
      }
    );

    return res.status(200).json({
      message: "History data retrieved succesfully.",
      workoutHistory: currantMonthWorkoutHistory,
      sessionHistory: currantMonthSessionHistory,
    });
  } catch (err) {
    const error = new ResError(
      "\n- func. getUserHistory (application router): Couldn't retrieve user's history.\nError: " +
        err
    );
    return next(error);
  }
};

const getHistoryRecords = async (
  req: express.Request<{}, {}, {}, { workoutId?: string }>,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;
  try {
    const workout = await Workout.findById(
      new mongoodb.ObjectId(req.query.workoutId)
    ).populate({
      path: "exercises.exerciseId",
      select: "image",
    });

    if (workout && workout.userId.toString() === userId.toString()) {
      return res
        .status(200)
        .json({ message: "Workout data retrieved succesfully", workout });
    }

    const error = new ResError(
      "\n- func. getHistoryRecords (application router): Workout was not found.",
      404
    );
    return next(error);
  } catch (err) {
    const error = new ResError(
      "\n- func. getHistoryRecords (application router): Failed to fetch user's history records.\nError: " +
        err
    );
    return next(error);
  }
};

const application = {
  userData,
  getRoutines,
  newRoutine,
  updateRoutine,
  deleteRoutine,
  saveWorkout,
  saveActivitySession,
  getUserHistory,
  getHistoryRecords,
};

export default application;
