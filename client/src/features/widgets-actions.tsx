import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise } from "./workout";
import { Routine } from "./user-actions";

interface Notification {
  visibility: boolean;
  message?: string;
}

interface CategoriesWidget {
  sessionActivity: boolean;
  selectedActivity: string;
}

interface RoutineWidget {
  selectedFilters: string[];
  isAll: boolean;
  newRoutine: {
    exercises: Exercise[];
    formVisibility: boolean;
  };
  routineOptions: { visibility: boolean; routineId?: string };
  routineEditForm: {
    mode: string;
    title: string;
    category: string;
    description: string;
  };
  routinePreviewForm: {
    visibility: boolean;
    routineId?: string;
    routineData?: Routine;
  };
}

interface CalendarWidget {
  monthData: {
    month: number;
    year: number;
    workoutRecords: { workoutId: string; date: string }[];
    sessionRecords: {
      date: string;
      title: string;
      category: string;
      duration: number;
      burnedCalories: number;
    }[];
  }[];
  previewRecords: {
    workoutRecords: { workoutId: string; date: string }[];
    sessionRecords: {
      date: string;
      title: string;
      category: string;
      duration: number;
      burnedCalories: number;
    }[];
  };
}

const widgets: {
  notificationManager: Notification;
  routinesWidget: RoutineWidget;
  calendarWidget: CalendarWidget;
  categoriesWidget: CategoriesWidget;
} = {
  notificationManager: {
    visibility: false,
    message: "",
  },
  routinesWidget: {
    selectedFilters: [],
    isAll: true,
    newRoutine: {
      exercises: [],
      formVisibility: false,
    },
    routineEditForm: {
      mode: "ADD",
      title: "",
      category: "",
      description: "",
    },
    routinePreviewForm: {
      visibility: false,
      routineId: "",
      routineData: {
        _id: "",
        userId: "",
        title: "",
        category: "",
        description: "",
        duration: 0,
        exercises: [],
      },
    },
    routineOptions: { visibility: false, routineId: "" },
  },
  calendarWidget: {
    monthData: [],
    previewRecords: { workoutRecords: [], sessionRecords: [] },
  },
  categoriesWidget: {
    sessionActivity: false,
    selectedActivity: "",
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
      state.routinesWidget.selectedFilters.push(action.payload.label);
    },
    removeFilter: (state, action: PayloadAction<{ label: string }>) => {
      state.routinesWidget.selectedFilters =
        state.routinesWidget.selectedFilters.filter((label) => {
          return action.payload.label !== label;
        });
    },
    selectAll: (state) => {
      state.routinesWidget.selectedFilters = [];
    },
    setRoutineOptionsState: (
      state,
      action: PayloadAction<{ visibility: boolean; routineId?: string }>
    ) => {
      state.routinesWidget.routineOptions = { ...action.payload };
    },
    addToNewRoutine: (state, action: PayloadAction<Exercise>) => {
      const existingExercise = state.routinesWidget.newRoutine.exercises.find(
        (exercise) => exercise._id === action.payload._id
      );
      if (existingExercise) {
        action.payload._id += "-" + new Date().getTime();
      }
      state.routinesWidget.newRoutine.exercises.push(action.payload);
    },
    modifyStaticSetCount: (
      state,
      action: PayloadAction<{ id: string; count: number }>
    ) => {
      const exercise = state.routinesWidget.newRoutine.exercises.find(
        (exercise) => {
          return exercise._id === action.payload.id;
        }
      );
      if (exercise) {
        exercise.sets = action.payload.count;
      }
    },
    setRoutineNotes: (
      state,
      action: PayloadAction<{ exerciseIndex: number; notes: string }>
    ) => {
      state.routinesWidget.newRoutine.exercises[
        action.payload.exerciseIndex
      ].notes = action.payload.notes;
    },
    removeFromNewRoutine: (state, action: PayloadAction<string>) => {
      state.routinesWidget.newRoutine.exercises =
        state.routinesWidget.newRoutine.exercises.filter(
          (exersice) => exersice._id !== action.payload
        );
    },
    replaceExerciseFromRoutine: (
      state,
      action: PayloadAction<{ currant: string; replaceWith: Exercise }>
    ) => {
      const currantExericeIndex =
        state.routinesWidget.newRoutine.exercises.findIndex((exercise) => {
          return exercise._id === action.payload.currant;
        });
      if (currantExericeIndex >= 0) {
        const existingExercise = state.routinesWidget.newRoutine.exercises.find(
          (exercise) => exercise._id === action.payload.replaceWith._id
        );
        if (existingExercise) {
          action.payload.replaceWith._id += "-" + new Date().getTime();
        }
        state.routinesWidget.newRoutine.exercises[currantExericeIndex] = {
          ...action.payload.replaceWith,
        };
      }
    },
    setResetTimerRoutine: (
      state,
      action: PayloadAction<{ id: string; time: number }>
    ) => {
      const exerciseIndex = state.routinesWidget.newRoutine.exercises.findIndex(
        (exercise) => {
          return exercise._id === action.payload.id;
        }
      );
      if (exerciseIndex > -1) {
        state.routinesWidget.newRoutine.exercises[exerciseIndex].restTime =
          action.payload.time;
      }
    },
    setRoutineNote: (
      state,
      action: PayloadAction<{ exerciseIndex: number; note: string }>
    ) => {
      state.routinesWidget.newRoutine.exercises[
        action.payload.exerciseIndex
      ].notes = action.payload.note;
    },
    setFormVisibility: (state, action: PayloadAction<boolean>) => {
      state.routinesWidget.newRoutine.formVisibility = action.payload;
    },
    setEditFormData: (
      state,
      action: PayloadAction<{
        fieldData: {
          mode: string;
          title: string;
          category: string;
          description: string;
        };
        exercises: Exercise[];
      }>
    ) => {
      state.routinesWidget.routineEditForm = { ...action.payload.fieldData };
      state.routinesWidget.newRoutine.exercises = action.payload.exercises;
    },
    setRoutinePreviewState: (
      state,
      action: PayloadAction<{
        visibility: boolean;
        routineId?: string;
        routineData?: Routine;
      }>
    ) => {
      state.routinesWidget.routinePreviewForm = { ...action.payload };
    },
    appendHistory: (
      state,
      action: PayloadAction<{
        month: number;
        year: number;
        workoutRecords: { workoutId: string; date: string }[];
        sessionRecords: {
          date: string;
          title: string;
          category: string;
          duration: number;
          burnedCalories: number;
        }[];
      }>
    ) => {
      state.calendarWidget.monthData.push({ ...action.payload });
    },
    showHistoryRecords: (state, action: PayloadAction<string>) => {
      const referenceDate = new Date(action.payload);
      const dataChunk = state.calendarWidget.monthData.find(
        (chunk) =>
          chunk.month === referenceDate.getMonth() &&
          chunk.year === referenceDate.getFullYear()
      );
      if (dataChunk) {
        state.calendarWidget.previewRecords.workoutRecords =
          dataChunk.workoutRecords.filter(
            (record) =>
              referenceDate.getDate() === new Date(record.date).getDate()
          );
        state.calendarWidget.previewRecords.sessionRecords =
          dataChunk.sessionRecords.filter(
            (record) =>
              referenceDate.getDate() === new Date(record.date).getDate()
          );
      }
    },
    resetHistoryRecords: (state) => {
      state.calendarWidget.previewRecords = {
        workoutRecords: [],
        sessionRecords: [],
      };
    },
    setSessionActivity: (
      state,
      action: PayloadAction<{
        sessionActivity: boolean;
        selectedActivity: string;
      }>
    ) => {
      state.categoriesWidget = { ...action.payload };
    },
    restoreNewRoutineInitState: (state) => {
      state.routinesWidget.newRoutine = widgets.routinesWidget.newRoutine;
    },
    restoreRoutinesWidgetInitialState: (state) => {
      state.notificationManager = widgets.notificationManager;
      state.routinesWidget = widgets.routinesWidget;
    },
  },
});

export const {
  setNotificationState,
  addFilter,
  removeFilter,
  selectAll,
  setRoutineOptionsState,
  addToNewRoutine,
  modifyStaticSetCount,
  removeFromNewRoutine,
  replaceExerciseFromRoutine,
  setRoutineNotes,
  setResetTimerRoutine,
  setFormVisibility,
  setEditFormData,
  setRoutinePreviewState,
  appendHistory,
  showHistoryRecords,
  resetHistoryRecords,
  setSessionActivity,
  restoreNewRoutineInitState,
  restoreRoutinesWidgetInitialState,
} = workoutWidgetManager.actions;
export default workoutWidgetManager.reducer;
