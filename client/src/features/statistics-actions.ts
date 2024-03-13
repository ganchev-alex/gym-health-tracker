import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMuscleDistribution {
  currant: {
    back: number;
    chest: number;
    core: number;
    shoulders: number;
    arms: number;
    legs: number;
  };
  previous: {
    back: number;
    chest: number;
    core: number;
    shoulders: number;
    arms: number;
    legs: number;
  };
  totalCurrant: number;
  totalPrevious: number;
}

export interface ITotals {
  workoutPeriodCount: number;
  activityPeriodCount: number;
  totalWorkouts: number;
  totalActivities: number;
}

interface IMusclesGraph {
  muscleGroups: string[];
  activityDates: number[];
}

export interface IEssentialsStats {
  activeTime: number;
  burntCalories: number;
  sleepTime: number;
  waterIntake: number;
  caloriesIntake: number;
}

export interface IEssentialsGraphs {
  statsData: { date: string; value: number }[];
}

const initialState: {
  timeSpan: string;
  muscleDistribution: IMuscleDistribution;
  muscleGraph: IMusclesGraph;
  totals: ITotals;
  essentialsStats: IEssentialsStats;
  essentialsGraphs: IEssentialsGraphs;
} = {
  timeSpan: "week",
  muscleDistribution: {
    currant: {
      back: 0,
      chest: 0,
      core: 0,
      shoulders: 0,
      arms: 0,
      legs: 0,
    },
    previous: { back: 0, chest: 0, core: 0, shoulders: 0, arms: 0, legs: 0 },
    totalCurrant: 0,
    totalPrevious: 0,
  },
  totals: {
    workoutPeriodCount: 0,
    activityPeriodCount: 0,
    totalWorkouts: 0,
    totalActivities: 0,
  },
  muscleGraph: {
    muscleGroups: [],
    activityDates: [],
  },
  essentialsStats: {
    activeTime: 0,
    burntCalories: 0,
    sleepTime: 0,
    waterIntake: 0,
    caloriesIntake: 0,
  },
  essentialsGraphs: {
    statsData: [],
  },
};

const statisticsManager = createSlice({
  name: "exploreManger",
  initialState,
  reducers: {
    setTimeSpan: (state, action: PayloadAction<string>) => {
      state.timeSpan = action.payload;
    },
    setStatistics: (
      state,
      action: PayloadAction<{
        muscleDistribution: IMuscleDistribution;
        totals: ITotals;
        essentialsStats: IEssentialsStats;
        muscleGroups: string[];
        activityDates: number[];
      }>
    ) => {
      state.muscleDistribution = action.payload.muscleDistribution;
      state.totals = action.payload.totals;
      state.essentialsStats = action.payload.essentialsStats;
      state.muscleGraph.muscleGroups = action.payload.muscleGroups;
      state.muscleGraph.activityDates = action.payload.activityDates;
    },
    setMuscleDistribution: (
      state,
      action: PayloadAction<IMuscleDistribution>
    ) => {
      state.muscleDistribution = { ...action.payload };
    },
    setTotals: (state, action: PayloadAction<ITotals>) => {
      state.totals = { ...action.payload };
    },
    setEssentailGraph: (
      state,
      action: PayloadAction<{ date: string; value: number }[]>
    ) => {
      state.essentialsGraphs.statsData = action.payload;
    },
  },
});

export const {
  setTimeSpan,
  setStatistics,
  setMuscleDistribution,
  setTotals,
  setEssentailGraph,
} = statisticsManager.actions;
export default statisticsManager.reducer;
