import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Exercise = {
  _id: string;
  name: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  image: string;
  sets?: number;
  restTime?: number;
  notes?: string;
  setsData?: { state: boolean; reps: number; kg: number }[];
  bestSet?: { kg: number; reps: number };
};

type Workout = {
  workoutActivity: boolean;
  workoutVisibility: boolean;
  workoutTitle: string;
  workoutCategory: string;
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
  duration: number;
  totalVolume: number;
  totalSets: number;
  restTimer: {
    timer: number;
    active: boolean;
  };
};

const initialState: Workout = {
  workoutActivity: false,
  workoutVisibility: false,
  workoutTitle: "",
  workoutCategory: "Gym & Weightlifting",
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
  duration: 0,
  totalVolume: 0,
  totalSets: 0,
  restTimer: {
    timer: 0,
    active: false,
  },
};

const workoutState = createSlice({
  name: "workoutState",
  initialState,
  reducers: {
    setWorkoutState: (
      state,
      action: PayloadAction<{ visibility: boolean; activity?: boolean }>
    ) => {
      state.workoutVisibility = action.payload.visibility;
      if (action.payload.visibility) {
        state.workoutActivity = true;
      }
      state.workoutActivity = action.payload.activity || state.workoutActivity;
    },
    setWorkoutTitle: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.workoutTitle = action.payload;
      } else {
        const date = new Date().toDateString();
        state.workoutTitle = "Workout Session: " + date;
      }
    },
    setWorkoutCategory: (state, action: PayloadAction<string>) => {
      state.workoutCategory = action.payload;
    },
    addExercise: (state, action: PayloadAction<Exercise>) => {
      const existingExercise = state.exercises.find(
        (exercise) => exercise._id === action.payload._id
      );
      if (existingExercise) {
        action.payload._id += "-" + new Date().getTime();
      }
      action.payload.restTime = 0;
      action.payload.sets = 1;
      action.payload.setsData = [{ state: false, reps: 0, kg: 0 }];
      state.exercises.push(action.payload);
    },
    removeExercise: (state, action: PayloadAction<string>) => {
      if (state.workoutActivity) {
        const exercise = state.exercises.find(
          (exercise) => exercise._id === action.payload
        );
        if (exercise) {
          const setsData = exercise.setsData;
          if (setsData) {
            state.totalSets -= setsData.reduce((accumalator, set) => {
              if (set.state) {
                return accumalator + 1;
              } else {
                return accumalator;
              }
            }, 0);
            state.totalVolume -= setsData.reduce((accumalator, set) => {
              if (set.state) {
                return accumalator + set.kg * set.reps;
              } else {
                return accumalator;
              }
            }, 0);
          }
        }
      }
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
        if (state.workoutActivity) {
          const exercise = state.exercises[currantExericeIndex];
          const setsData = exercise.setsData;
          if (setsData) {
            state.totalSets -= setsData.reduce((accumalator, set) => {
              if (set.state) {
                return accumalator + 1;
              } else {
                return accumalator;
              }
            }, 0);
            state.totalVolume -= setsData.reduce((accumalator, set) => {
              if (set.state) {
                return accumalator + set.kg * set.reps;
              } else {
                return accumalator;
              }
            }, 0);
          }
        }
        const existingExercise = state.exercises.find(
          (exercise) => exercise._id === action.payload.replaceWith._id
        );
        if (existingExercise) {
          action.payload.replaceWith._id += "-" + new Date().getTime();
        }
        action.payload.replaceWith.restTime = 0;
        action.payload.replaceWith.sets = 1;
        action.payload.replaceWith.setsData = [
          { state: false, reps: 0, kg: 0 },
        ];
        state.exercises[currantExericeIndex] = {
          ...action.payload.replaceWith,
        };
      }
    },
    setWorkoutExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.exercises = action.payload;
    },
    modifySetCount: (
      state,
      action: PayloadAction<{ id: string; count: number }>
    ) => {
      const exercise = state.exercises.find((exercise) => {
        return exercise._id === action.payload.id;
      });
      if (exercise) {
        exercise.sets = action.payload.count;
      }
    },
    setRestTime: (
      state,
      action: PayloadAction<{ id: string; time: number }>
    ) => {
      const exerciseIndex = state.exercises.findIndex((exercise) => {
        return exercise._id === action.payload.id;
      });
      if (exerciseIndex > -1) {
        state.exercises[exerciseIndex].restTime = action.payload.time;
      }
    },
    setExerciseNotes: (
      state,
      action: PayloadAction<{ exerciseIndex: number; notes: string }>
    ) => {
      state.exercises[action.payload.exerciseIndex].notes =
        action.payload.notes;
    },
    setSetState: (
      state,
      action: PayloadAction<{
        exerciseIndex: number;
        setIndex: number;
        setState: boolean;
      }>
    ) => {
      if (state.exercises[action.payload.exerciseIndex].setsData) {
        const setsData = state.exercises[action.payload.exerciseIndex].setsData;
        if (setsData) {
          setsData[action.payload.setIndex].state = action.payload.setState;
        }
      }
    },
    setSetData: (
      state,
      action: PayloadAction<{
        exerciseIndex: number;
        setIndex: number;
        reps: number;
        volume: number;
      }>
    ) => {
      if (state.exercises[action.payload.exerciseIndex].setsData) {
        const setsData = state.exercises[action.payload.exerciseIndex].setsData;
        if (setsData) {
          setsData[action.payload.setIndex].kg = action.payload.volume;
          setsData[action.payload.setIndex].reps = action.payload.reps;
        }
      }
    },
    addSetData: (
      state,
      action: PayloadAction<{
        exerciseIndex: number;
        setData: { state: boolean; reps: number; kg: number };
      }>
    ) => {
      const currantSetData =
        state.exercises[action.payload.exerciseIndex].setsData;
      if (currantSetData) {
        currantSetData.push(action.payload.setData);
        state.exercises[action.payload.exerciseIndex].setsData = [
          ...currantSetData,
        ];
      }
    },
    removeSetData: (
      state,
      action: PayloadAction<{ exerciseIndex: number; setIndex: number }>
    ) => {
      const currantSetData =
        state.exercises[action.payload.exerciseIndex].setsData;
      if (currantSetData) {
        currantSetData.splice(action.payload.setIndex, 1);
        state.exercises[action.payload.exerciseIndex].setsData = [
          ...currantSetData,
        ];
      }
    },
    setTotalValues: (
      state,
      action: PayloadAction<{ increasment: boolean; volume: number }>
    ) => {
      if (action.payload.increasment) {
        state.totalSets++;
        state.totalVolume += action.payload.volume;
      } else {
        state.totalSets--;
        state.totalVolume -= action.payload.volume;
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
    incrementWorkoutDuration: (state) => {
      state.duration++;
    },
    setRestTimerState: (
      state,
      action: PayloadAction<{ activity: boolean; timer?: number }>
    ) => {
      state.restTimer.active = action.payload.activity;
      if (!action.payload.activity) {
        state.restTimer.timer = 0;
      }

      if (action.payload.timer) {
        state.restTimer.timer = action.payload.timer;
      }
    },
    decreaseRestTimer: (state) => {
      state.restTimer.timer--;
    },
    operateOnRestTimer: (
      state,
      action: PayloadAction<{ increment: boolean; value: number }>
    ) => {
      if (action.payload.increment) {
        state.restTimer.timer += action.payload.value;
      } else {
        state.restTimer.timer -= action.payload.value;
      }
    },
    restoreWorkoutState: (state, action: PayloadAction<Workout>) => {
      return { ...action.payload };
    },
    restoreWorkoutInitialState: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setWorkoutState,
  setWorkoutTitle,
  setWorkoutCategory,
  addExercise,
  removeExercise,
  replaceExercise,
  setWorkoutExercises,
  modifySetCount,
  setRestTime,
  setExerciseNotes,
  setSetState,
  setSetData,
  addSetData,
  removeSetData,
  setTotalValues,
  setAddExerciseState,
  setExerciseSummaryVisibility,
  setExerciseData,
  setSearchExercise,
  setFitlerState,
  setFilterValue,
  setOptionsMenuState,
  incrementWorkoutDuration,
  setRestTimerState,
  decreaseRestTimer,
  operateOnRestTimer,
  restoreWorkoutState,
  restoreWorkoutInitialState,
} = workoutState.actions;
export default workoutState.reducer;
