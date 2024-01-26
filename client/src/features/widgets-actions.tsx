import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise } from "./workout";

interface Notification {
  visibility: boolean;
  message?: string;
}

interface WorkoutWidget {
  selectedFilters: string[];
  isAll: boolean;
  newRoutine: {
    exercises: Exercise[];
    formVisibility: boolean;
  };
}

const widgets: {
  notificationManager: Notification;
  workoutWidget: WorkoutWidget;
} = {
  notificationManager: {
    visibility: false,
    message: "",
  },
  workoutWidget: {
    selectedFilters: [],
    isAll: true,
    newRoutine: {
      exercises: [],
      formVisibility: false,
    },
  },
};

const workoutWidgetManager = createSlice({
  name: "widgetsManager",
  initialState: widgets,
  reducers: {
    setNotificationState: (
      state,
      action: PayloadAction<{ message?: string; visibility: boolean }>
    ) => {
      state.notificationManager = { ...action.payload };
    },
    addFilter: (state, action: PayloadAction<{ label: string }>) => {
      state.workoutWidget.selectedFilters.push(action.payload.label);
    },
    removeFilter: (state, action: PayloadAction<{ label: string }>) => {
      state.workoutWidget.selectedFilters =
        state.workoutWidget.selectedFilters.filter((label) => {
          return action.payload.label !== label;
        });
    },
    selectAll: (state) => {
      state.workoutWidget.selectedFilters = [];
    },
    addToNewRoutine: (state, action: PayloadAction<Exercise>) => {
      const existingExercise = state.workoutWidget.newRoutine.exercises.find(
        (exercise) => exercise._id === action.payload._id
      );
      if (existingExercise) {
        existingExercise._id += "-" + new Date().getTime();
      }
      state.workoutWidget.newRoutine.exercises.push(action.payload);
    },
    modifyStaticSetCount: (
      state,
      action: PayloadAction<{ id: string; count: number }>
    ) => {
      const exercise = state.workoutWidget.newRoutine.exercises.find(
        (exercise) => {
          return exercise._id === action.payload.id;
        }
      );
      if (exercise) {
        exercise.sets = action.payload.count;
      }
    },
    removeFromNewRoutine: (state, action: PayloadAction<string>) => {
      state.workoutWidget.newRoutine.exercises =
        state.workoutWidget.newRoutine.exercises.filter(
          (exersice) => exersice._id !== action.payload
        );
    },
    replaceExerciseFromRoutine: (
      state,
      action: PayloadAction<{ currant: string; replaceWith: Exercise }>
    ) => {
      const currantExericeIndex =
        state.workoutWidget.newRoutine.exercises.findIndex((exercise) => {
          return exercise._id === action.payload.currant;
        });
      if (currantExericeIndex >= 0) {
        const existingExercise = state.workoutWidget.newRoutine.exercises.find(
          (exercise) => exercise._id === action.payload.replaceWith._id
        );
        if (existingExercise) {
          existingExercise._id += "-" + new Date().getTime();
        }
        state.workoutWidget.newRoutine.exercises[currantExericeIndex] = {
          ...action.payload.replaceWith,
        };
      }
    },
    setResetTimerRoutine: (
      state,
      action: PayloadAction<{ id: string; time: number }>
    ) => {
      const exerciseIndex = state.workoutWidget.newRoutine.exercises.findIndex(
        (exercise) => {
          return exercise._id === action.payload.id;
        }
      );
      if (exerciseIndex > -1) {
        state.workoutWidget.newRoutine.exercises[exerciseIndex].restTime =
          action.payload.time;
      }
    },
    setFormVisibility: (state, action: PayloadAction<boolean>) => {
      state.workoutWidget.newRoutine.formVisibility = action.payload;
    },
    restoreNewRoutineInitState: (state) => {
      state.workoutWidget.newRoutine = widgets.workoutWidget.newRoutine;
    },
    restoreWidgetsInitialState: (state) => {
      state.notificationManager = widgets.notificationManager;
      state.workoutWidget = widgets.workoutWidget;
    },
  },
});

export const {
  setNotificationState,
  addFilter,
  removeFilter,
  selectAll,
  addToNewRoutine,
  modifyStaticSetCount,
  removeFromNewRoutine,
  replaceExerciseFromRoutine,
  setResetTimerRoutine,
  setFormVisibility,
  restoreNewRoutineInitState,
  restoreWidgetsInitialState,
} = workoutWidgetManager.actions;
export default workoutWidgetManager.reducer;
