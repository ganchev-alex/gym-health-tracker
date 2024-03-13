import express = require("express");
import mongoodb = require("mongodb");
import mongoose = require("mongoose");
import ResError from "../util/ResError";
import Statistic from "../models/statistic";
import User from "../models/user";
import { getWeekNumber } from "../util/dateModification";
import Essential from "../models/essentials";
import Workout from "../models/workout";
import Exercise from "../models/exercise";

interface IDistributionStats {
  back: number;
  chest: number;
  core: number;
  shoulders: number;
  arms: number;
  legs: number;
}

export const insertMuscleDistributionData = function (
  chunk: {
    week: number;
    month: number;
    year: number;
    tracker: {
      muscle: string;
      counter: number;
    }[];
  },
  muscles: string[]
) {
  muscles.forEach((muscle) => {
    switch (muscle) {
      case "chest":
        chunk.tracker.find((record) => record.muscle === "chest").counter++;
        break;
      case "abdominals":
      case "obliques":
      case "rectus abdominis":
      case "transverse abdominis":
      case "core":
        chunk.tracker.find((record) => record.muscle === "core").counter++;
        break;
      case "shoulders":
      case "rear delts":
        chunk.tracker.find((record) => record.muscle === "shoulders").counter++;
        break;
      case "triceps":
      case "biceps":
      case "forearms":
        chunk.tracker.find((record) => record.muscle === "arms").counter++;
        break;
      case "quadriceps":
      case "hamstrings":
      case "glutes":
      case "calves":
        chunk.tracker.find((record) => record.muscle === "legs").counter++;
        break;
      case "trapezius":
      case "rhomboids":
      case "lats":
      case "lower back":
      case "upper back":
        chunk.tracker.find((record) => record.muscle === "back").counter++;
        break;
    }
  });
};

const getEssential = async (
  req: express.Request<{}, {}, {}, { essential: string }>,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new ResError("User was not found.", 404);
      return next(error);
    }

    const { essential } = req.query;
    const today = new Date();
    const referenceDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const filteredEssenstialsHistory = user.essentialsHistory.filter(
      (record) => record.date <= today && record.date >= referenceDate
    );

    const statsData: { date: Date; value: number }[] = [];
    await Promise.all(
      filteredEssenstialsHistory.map(async (record) => {
        const {
          activityTime,
          burntCalories,
          sleepTime,
          water,
          consumedCalories,
        } = await Essential.findById(record.essentials);

        switch (essential) {
          case "active-time":
            statsData.push({ date: record.date, value: activityTime });
            break;
          case "burnt-calories":
            statsData.push({ date: record.date, value: burntCalories });
            break;
          case "sleep-time":
            statsData.push({ date: record.date, value: sleepTime });
            break;
          case "hydration":
            statsData.push({ date: record.date, value: water });
            break;
          case "consumed-calories":
            statsData.push({ date: record.date, value: consumedCalories });
            break;
        }
      })
    );

    return res.status(200).json({
      message: "Successfully fetched the essential stats.",
      statsData,
    });
  } catch (err) {
    const error = new ResError(
      "\n- func. getStatistics (statistics router): Failed Retrieving statistics data.\nError: " +
        err
    );
    return next(error);
  }
};

const getStatistics = async (
  req: express.Request<
    {},
    {},
    {},
    { span: string; week: string; month: string; year: string }
  >,
  res: express.Response,
  next: express.NextFunction
) => {
  const userId = (req as any).userId;
  const { span, week, month, year } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new ResError("No user was found.", 404);
      return next(error);
    }

    let statistics = await Statistic.findOne({ userId });

    if (!statistics) {
      statistics = new Statistic({ userId, muscleDistribution: [] });
    }

    const { muscleDistribution } = statistics;
    const { workoutHistory, activitySessionHistory, essentialsHistory } = user;
    const distributionStats = getMuscleDistribion(
      muscleDistribution,
      span,
      +week,
      +month,
      +year
    );
    const totals = getTotalWorkouts(
      workoutHistory,
      activitySessionHistory,
      span,
      +week,
      +month,
      +year
    );

    const essentialsStats = await getEssentialsStats(
      userId,
      span,
      +year,
      +month,
      +week
    );

    const muslcePreview = await getTargetedMuscles(workoutHistory);

    return res.status(200).json({
      message: "Statistics Data retrieved succesfully",
      distributionStats,
      totals,
      essentialsStats,
      muscleGroups: muslcePreview.muscleGroups,
      activityDates: muslcePreview.activityDates,
    });
  } catch (err) {
    const error = new ResError(
      "\n- func. getStatistics (statistics router): Failed Retrieving statistics data.\nError: " +
        err
    );
    return next(error);
  }
};

const getMuscleDistribion = function (
  muscleDistribution,
  span: string,
  week: number,
  month: number,
  year: number
) {
  const distributionStats = {
    previous: {
      back: 0,
      chest: 0,
      core: 0,
      shoulders: 0,
      arms: 0,
      legs: 0,
    },
    currant: {
      back: 0,
      chest: 0,
      core: 0,
      shoulders: 0,
      arms: 0,
      legs: 0,
    },
  };
  let totalCurrant = 0;
  let totalPrevious = 0;
  if (muscleDistribution.length > 0) {
    const previousWeek: { weekNumber: number; year: number } = {
      weekNumber: week - 1 || 52,
      year: week - 1 === 0 ? year - 1 : year,
    };

    const previousMonth: { monthNumber: number; year: number } = {
      monthNumber: month - 1 === -1 ? 11 : month - 1,
      year: month - 1 === -1 ? year - 1 : year,
    };

    const previousYear = year - 1;

    calculateMuslceDistribution(
      span,
      week,
      month,
      year,
      distributionStats.currant,
      muscleDistribution
    );

    if (span === "week") {
      calculateMuslceDistribution(
        span,
        previousWeek.weekNumber,
        0,
        previousWeek.year,
        distributionStats.previous,
        muscleDistribution
      );
    } else if (span === "month") {
      calculateMuslceDistribution(
        span,
        0,
        previousMonth.monthNumber,
        previousMonth.year,
        distributionStats.previous,
        muscleDistribution
      );
    } else if (span === "week") {
      calculateMuslceDistribution(
        span,
        0,
        0,
        previousYear,
        distributionStats.previous,
        muscleDistribution
      );
    }

    for (const muscle in distributionStats.currant) {
      if (
        Object.prototype.hasOwnProperty.call(distributionStats.currant, muscle)
      ) {
        totalCurrant += distributionStats.currant[muscle];
      }
    }
    for (const muscle in distributionStats.previous) {
      if (
        Object.prototype.hasOwnProperty.call(distributionStats.previous, muscle)
      ) {
        totalPrevious += distributionStats.previous[muscle];
      }
    }
  }

  return { ...distributionStats, totalCurrant, totalPrevious };
};

const getTotalWorkouts = function (
  workoutHistory: {
    date: Date;
    workout: mongoose.Types.ObjectId;
  }[],
  activitySessionHistory: {
    date: Date;
    session: mongoose.Types.ObjectId;
  }[],
  span: string,
  week: number,
  month: number,
  year: number
) {
  const result = {
    workoutPeriodCount: 0,
    activityPeriodCount: 0,
    totalWorkouts: workoutHistory.length,
    totalActivities: activitySessionHistory.length,
  };

  const calculateTotal = (
    records: {
      date: Date;
      session?: mongoose.Types.ObjectId;
      workout?: mongoose.Types.ObjectId;
    }[],
    year: number,
    month: number,
    week: number
  ) => {
    return records.filter((record) => {
      if (!Number.isNaN(week)) {
        return (
          getWeekNumber(record.date) === week &&
          record.date.getFullYear() === year
        );
      }

      if (!Number.isNaN(month)) {
        return (
          record.date.getMonth() === month && record.date.getFullYear() === year
        );
      }

      return record.date.getFullYear() === year;
    }).length;
  };

  if (span === "week") {
    result.workoutPeriodCount = calculateTotal(
      workoutHistory,
      year,
      month,
      week
    );
    result.activityPeriodCount = calculateTotal(
      activitySessionHistory,
      year,
      month,
      week
    );
  } else if (span === "month") {
    result.workoutPeriodCount = calculateTotal(
      workoutHistory,
      year,
      month,
      week
    );
    result.activityPeriodCount = calculateTotal(
      activitySessionHistory,
      year,
      month,
      week
    );
  } else if (span === "year") {
    result.workoutPeriodCount = calculateTotal(
      workoutHistory,
      year,
      month,
      week
    );
    result.activityPeriodCount = calculateTotal(
      activitySessionHistory,
      year,
      month,
      week
    );
  }

  return result;
};

const getEssentialsStats = async function (
  userId: string,
  span: string,
  year: number,
  month: number,
  week: number
) {
  try {
    const essentials = await Essential.find({ userId });

    let filteredEssentials: typeof essentials = [];
    let devider = 1;
    if (span === "week") {
      devider = 7;
      filteredEssentials = essentials.filter(
        (essential) =>
          getWeekNumber(essential.date) === week &&
          essential.date.getFullYear() === year
      );
    } else if (span === "month") {
      devider = 30;
      filteredEssentials = essentials.filter(
        (essential) =>
          essential.date.getMonth() === month &&
          essential.date.getFullYear() === year
      );
    } else if (span === "year") {
      devider = 365;
      filteredEssentials = essentials.filter(
        (essential) => essential.date.getFullYear() === year
      );
    }

    const result = {
      activeTime: 0,
      burntCalories: 0,
      sleepTime: 0,
      waterIntake: 0,
      caloriesIntake: 0,
    };

    if (filteredEssentials.length > 0) {
      filteredEssentials.forEach((record) => {
        result.activeTime += record.activityTime;
        result.burntCalories += record.burntCalories;
        result.sleepTime += record.sleepTime;
        result.waterIntake += record.water;
        result.caloriesIntake += record.consumedCalories;
      });
    }
    for (const stat in result) {
      if (Object.prototype.hasOwnProperty.call(result, stat)) {
        result[stat] /= devider;
      }
    }

    return result;
  } catch (error) {
    console.log(
      "\n- func. getEssentialsStats (statistics router): Failed retrieving essentials statistics.\nError: " +
        error
    );
    return [];
  }
};

const getTargetedMuscles = async function (
  workoutHistory: {
    date: Date;
    workout: mongoose.Types.ObjectId;
  }[]
) {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const filteredHistory = workoutHistory.filter(
    ({ date }) => date <= today && date >= sevenDaysAgo
  );

  try {
    const exercisesIds = (
      await Workout.find({
        _id: { $in: filteredHistory.map((record) => record.workout) },
      })
    ).flatMap((workout) =>
      workout.exercises.flatMap((exercise) => exercise.exerciseId)
    );

    if (exercisesIds.length == 0) {
      return { activityDates: [] as number[], muscleGroups: [] as string[] };
    }

    const exercises = await Exercise.find({ _id: { $in: exercisesIds } });

    const muscleGroups = exercises.flatMap((exercise) => [
      ...exercise.primaryMuscles,
      ...exercise.secondaryMuscles,
    ]);

    return {
      activityDates: Array.from(
        new Set(filteredHistory.map((record) => record.date.getDate()))
      ),
      muscleGroups: Array.from(new Set(muscleGroups)),
    };
  } catch {
    return { activityDates: [] as number[], muscleGroups: [] as string[] };
  }
};

const calculateMuslceDistribution = function (
  span: string,
  week: number,
  month: number,
  year: number,
  stats: IDistributionStats,
  muscleDistribution
) {
  switch (span) {
    case "week":
      const record = muscleDistribution.find(
        (chunk) => chunk.week === week && chunk.year === year
      );
      if (record) {
        stats.back = record.tracker[0].counter;
        stats.chest = record.tracker[1].counter;
        stats.core = record.tracker[2].counter;
        stats.shoulders = record.tracker[3].counter;
        stats.arms = record.tracker[4].counter;
        stats.legs = record.tracker[5].counter;
      }
      break;
    case "month":
      const monthRecords = muscleDistribution.filter(
        (chunk) => chunk.month === month && chunk.year === year
      );
      if (monthRecords.length > 0) {
        monthRecords.forEach((week) => {
          stats.back += week.tracker[0].counter;
          stats.chest += week.tracker[1].counter;
          stats.core += week.tracker[2].counter;
          stats.shoulders += week.tracker[3].counter;
          stats.arms += week.tracker[4].counter;
          stats.legs += week.tracker[5].counter;
        });
      }
      break;
    case "year":
      const yearRecords = muscleDistribution.filter(
        (chunk) => chunk.year === year
      );
      if (yearRecords.length > 0) {
        yearRecords.forEach((year) => {
          stats.back += year.tracker[0].counter;
          stats.chest += year.tracker[1].counter;
          stats.core += year.tracker[2].counter;
          stats.shoulders += year.tracker[3].counter;
          stats.arms += year.tracker[4].counter;
          stats.legs += year.tracker[5].counter;
        });
      }
      break;
  }
};

const statistic = {
  getStatistics,
  getEssential,
};

export default statistic;
