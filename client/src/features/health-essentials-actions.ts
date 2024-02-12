import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Session,
  Workout,
} from "../components/workouts_page/history_preview/HistoryPreview";

export interface Essentials {
  workouts: Workout[];
  activities: Session[];
  activityTime: number;
  burntCalories: number;
  wakeTime: string;
  bedTime: string;
  sleepTime: number;
  water: number;
  consumedCalories: number;
  calHistory: {
    timespan: string;
    meal: string;
    calories: number;
  }[];
}

interface Targets {
  activityTimeTarget: number;
  burntCaloriesTarget: number;
  sleepTarget: number;
  waterTarget: number;
}

const essentials: {
  isToday: boolean;
  loaded: boolean;
  updated: boolean;
  targets: Targets;
  today: Essentials;
  yesterday: Essentials;
} = {
  isToday: true,
  loaded: false,
  updated: true,
  targets: {
    activityTimeTarget: 0,
    burntCaloriesTarget: 0,
    sleepTarget: 0,
    waterTarget: 0,
  },
  today: {
    workouts: [],
    activities: [],
    activityTime: 0,
    burntCalories: 0,
    wakeTime: "",
    bedTime: "",
    sleepTime: 0,
    water: 0,
    consumedCalories: 0,
    calHistory: [],
  },
  yesterday: {
    workouts: [],
    activities: [],
    activityTime: 0,
    burntCalories: 0,
    wakeTime: "",
    bedTime: "",
    sleepTime: 0,
    water: 0,
    consumedCalories: 0,
    calHistory: [],
  },
};

const essentialsManager = createSlice({
  name: "essentialsManager",
  initialState: essentials,
  reducers: {
    setLoadedEssentialsData: (
      state,
      action: PayloadAction<{ todayEss: Essentials; yesterdayEss: Essentials }>
    ) => {
      state.today = { ...action.payload.todayEss };
      state.yesterday = { ...action.payload.yesterdayEss };
      state.loaded = true;
      state.updated = true;
    },
    setDataStream: (state) => {
      state.isToday = !state.isToday;
    },
    setTargets: (state, action: PayloadAction<Targets>) => {
      state.targets = { ...action.payload };
    },
    appendWorkoutsData: (state, action: PayloadAction<Workout[]>) => {
      state.today.workouts = [...state.today.workouts, ...action.payload];
      const additionalDuration = action.payload.reduce(
        (totalDuration, workout) => {
          return (totalDuration += workout.duration);
        },
        0
      );
      const additionalCalories = action.payload.reduce(
        (totalCalories, workout) => {
          return (totalCalories += workout.sets * 3);
        },
        0
      );
      state.today.activityTime += additionalDuration;
      state.today.burntCalories += additionalCalories;
    },
    appendSessionData: (state, action: PayloadAction<Session[]>) => {
      state.today.activities = [...state.today.activities, ...action.payload];
      const additionalDuration = action.payload.reduce(
        (totalDuration, session) => {
          return (totalDuration += session.duration);
        },
        0
      );
      const additionalCalories = action.payload.reduce(
        (totalCalories, session) => {
          return (totalCalories += session.burntCalories);
        },
        0
      );
      state.today.activityTime += additionalDuration;
      state.today.burntCalories += additionalCalories;
    },
    calculateActiveTime: (state) => {
      if (state.isToday) {
        const workoutTotalDuration = state.today.workouts.reduce(
          (totalDuration, workout) => {
            return (totalDuration += workout.duration);
          },
          0
        );
        const activitiesTotalDuration = state.today.activities.reduce(
          (totalDuration, session) => {
            return (totalDuration += session.duration);
          },
          0
        );
        state.today.activityTime =
          workoutTotalDuration + activitiesTotalDuration;
      } else {
        const workoutTotalDuration = state.yesterday.workouts.reduce(
          (totalDuration, workout) => {
            return (totalDuration += workout.duration);
          },
          0
        );
        const activitiesTotalDuration = state.yesterday.activities.reduce(
          (totalDuration, session) => {
            return (totalDuration += session.duration);
          },
          0
        );
        state.yesterday.activityTime =
          workoutTotalDuration + activitiesTotalDuration;
      }
    },
    calculateBurntCalories: (state) => {
      if (state.isToday) {
        const workoutCalories = state.today.workouts.reduce(
          (burntCalories, workout) => {
            return (burntCalories += workout.sets * 3);
          },
          0
        );
        const activitiesCalories = state.today.activities.reduce(
          (burntCalories, activity) => {
            return (burntCalories += activity.burntCalories);
          },
          0
        );
        state.today.burntCalories = workoutCalories + activitiesCalories;
      } else {
        const workoutCalories = state.yesterday.workouts.reduce(
          (burntCalories, workout) => {
            return (burntCalories += workout.sets * 3);
          },
          0
        );
        const activitiesCalories = state.yesterday.activities.reduce(
          (burntCalories, activity) => {
            return (burntCalories += activity.burntCalories);
          },
          0
        );
        state.yesterday.burntCalories = workoutCalories + activitiesCalories;
      }
    },
    setSleepData: (
      state,
      action: PayloadAction<{
        bedTime: string;
        wakeTime: string;
        sleepTime: number;
      }>
    ) => {
      const { bedTime, wakeTime, sleepTime } = action.payload;
      if (state.isToday) {
        state.today.sleepTime = sleepTime;
        state.today.bedTime = bedTime;
        state.today.wakeTime = wakeTime;
      } else {
        state.yesterday.sleepTime = sleepTime;
        state.yesterday.bedTime = bedTime;
        state.yesterday.wakeTime = wakeTime;
      }
      state.updated = false;
    },
    setBedTime: (state, action: PayloadAction<string>) => {
      if (state.isToday) {
        state.today.bedTime = action.payload;
      } else {
        state.yesterday.bedTime = action.payload;
      }
      state.updated = false;
    },
    setWakeTime: (state, action: PayloadAction<string>) => {
      if (state.isToday) {
        state.today.wakeTime = action.payload;
      } else {
        state.yesterday.wakeTime = action.payload;
      }
      state.updated = false;
    },
    modifyWaterIntake: (state, action: PayloadAction<boolean>) => {
      if (state.isToday) {
        if (action.payload) {
          state.today.water += 250;
        } else {
          if (state.today.water != 0) state.today.water -= 250;
        }
      } else {
        if (action.payload) {
          state.yesterday.water += 250;
        } else {
          if (state.yesterday.water != 0) state.yesterday.water -= 250;
        }
      }
      state.updated = false;
    },
    appendCaloriesHistory: (
      state,
      action: PayloadAction<{
        meal: string;
        calories: number;
      }>
    ) => {
      if (state.isToday) {
        state.today.calHistory.push({
          timespan: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          meal: action.payload.meal,
          calories: action.payload.calories,
        });
        state.today.consumedCalories += action.payload.calories;
      } else {
        state.yesterday.calHistory.push({
          timespan: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          meal: action.payload.meal,
          calories: action.payload.calories,
        });
        state.yesterday.consumedCalories += action.payload.calories;
      }
      state.updated = false;
    },
  },
});

export const {
  setLoadedEssentialsData,
  setDataStream,
  setTargets,
  appendWorkoutsData,
  appendSessionData,
  calculateActiveTime,
  calculateBurntCalories,
  setSleepData,
  setBedTime,
  setWakeTime,
  modifyWaterIntake,
  appendCaloriesHistory,
} = essentialsManager.actions;
export default essentialsManager.reducer;
