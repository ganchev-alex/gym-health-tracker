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
  exercises: Exercise[];
  addExerciseVisibility: boolean;
  exerciseSummaryVisibility: boolean;
  singleExerciseData: Exercise;
  searchExercise: string | null;
  filterState: { visibility: boolean; type?: string };
  filterValue: { equipment?: string; muscle?: string };
};

const initialState: Workout = {
  exercises: [],
  addExerciseVisibility: false,
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
    setAddExerciseVisibility: (state, action: PayloadAction<boolean>) => {
      state.addExerciseVisibility = action.payload;
    },
    setExerciseVisibility: (state, action: PayloadAction<boolean>) => {
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
  },
});

export const {
  addExercise,
  removeExercise,
  setAddExerciseVisibility,
  setExerciseVisibility,
  setExerciseData,
  setSearchExercise,
  setFitlerState,
  setFilterValue,
} = workoutState.actions;
export default workoutState.reducer;
