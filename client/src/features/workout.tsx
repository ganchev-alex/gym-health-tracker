import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Exercise = {
  _id: string;
  name: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  image: string;
};

type Workout = {
  isActive: boolean;
  isShown: boolean;
  exercises: Exercise[];
  addExerciseState: { visibility: boolean; mode?: String };
  exerciseSummaryVisibility: boolean;
  singleExerciseData: Exercise;
  searchExercise: string | null;
  filterState: { visibility: boolean; type?: string };
  filterValue: { equipment?: string; muscle?: string };
  optionsMenuState: {
    visibility: boolean;
    exerciseId?: string;
  };
};

const initialState: Workout = {
  isActive: true,
  isShown: false,
  exercises: [],
  addExerciseState: { visibility: false, mode: "ADD" },
  exerciseSummaryVisibility: false,
  singleExerciseData: {
    _id: "",
    name: "",
    equipment: "",
    primaryMuscles: [],
    secondaryMuscles: [],
    instructions: [],
    image: "",
  },
  searchExercise: null,
  filterState: { visibility: false },
  filterValue: {},
  optionsMenuState: { visibility: false },
};

const workoutState = createSlice({
  name: "workoutState",
  initialState,
  reducers: {
    addExercise: (state, action: PayloadAction<Exercise>) => {
      const existingExercise = state.exercises.find(
        (exercise) => exercise._id === action.payload._id
      );
      if (existingExercise) {
        existingExercise._id += "-" + new Date().getTime();
      }
      state.exercises.push(action.payload);
    },
    removeExercise: (state, action: PayloadAction<string>) => {
      state.exercises = state.exercises.filter(
        (exersice) => exersice._id !== action.payload
      );
    },
    replaceExercise: (
      state,
      action: PayloadAction<{ currant: string; replaceWith: Exercise }>
    ) => {
      const currantExericeIndex = state.exercises.findIndex(
        (exercise) => exercise._id === action.payload.currant
      );
      if (currantExericeIndex >= 0) {
        state.exercises[currantExericeIndex] = {
          ...action.payload.replaceWith,
        };
      }
    },
    setAddExerciseState: (
      state,
      action: PayloadAction<{ visibility: boolean; mode?: string }>
    ) => {
      state.addExerciseState = { ...action.payload };
    },
    setExerciseSummaryVisibility: (state, action: PayloadAction<boolean>) => {
      state.exerciseSummaryVisibility = action.payload;
    },
    setExerciseData: (state, action: PayloadAction<Exercise>) => {
      state.singleExerciseData = action.payload;
    },
    setSearchExercise: (state, action: PayloadAction<string | null>) => {
      state.searchExercise = action.payload;
    },
    setFitlerState: (
      state,
      action: PayloadAction<boolean | { visibility: boolean; type: string }>
    ) => {
      if (typeof action.payload === "boolean") {
        state.filterState.visibility = action.payload;
      } else {
        state.filterState = action.payload;
      }
    },
    setFilterValue: (
      state,
      action: PayloadAction<{ equipment?: string; muscle?: string }>
    ) => {
      state.filterValue = { ...state.filterValue, ...action.payload };
    },
    setOptionsMenuState: (
      state,
      action: PayloadAction<{ visibility: boolean; exerciseId?: string }>
    ) => {
      state.optionsMenuState = { ...action.payload };
    },
    setWorkoutActiveState: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    setWorkoutVisibility: (state) => {
      if (!state.isActive) {
        state.isShown = false;
      } else {
        state.isShown = !state.isShown;
      }
    },
  },
});

export const {
  addExercise,
  removeExercise,
  replaceExercise,
  setAddExerciseState,
  setExerciseSummaryVisibility,
  setExerciseData,
  setSearchExercise,
  setFitlerState,
  setFilterValue,
  setOptionsMenuState,
  setWorkoutActiveState,
  setWorkoutVisibility,
} = workoutState.actions;
export default workoutState.reducer;
