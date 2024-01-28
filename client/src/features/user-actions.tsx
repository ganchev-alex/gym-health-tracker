import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Exercise } from "./workout";

interface Auth {
  email: string;
  password: string;
}

export interface FetchedExercise {
  exerciseData: Exercise;
  sets: number;
  restTime: number;
}

export interface Routine {
  _id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  duration: number;
  exercises: FetchedExercise[];
}

interface loadedUserData {
  auth: { email: string };
  personalDetails: {
    firstName: string;
    lastNamee: string;
    sex: string;
    profilePicture: string;
  };
  routines: Routine[];
}

const initialUser: {
  auth: Auth;
  sex: string;
  selectedActivities: string[];
  loadedUserData: loadedUserData;
} = {
  auth: {
    email: "",
    password: "",
  },
  sex: "male",
  // selectedActivities in only viable in the routine display widget. So extract the logic there.
  selectedActivities: [],
  loadedUserData: {
    auth: { email: "" },
    personalDetails: {
      firstName: "",
      lastNamee: "",
      sex: "",
      profilePicture: "",
    },
    routines: [],
  },
};

const userManager = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setAuth: (state, action: PayloadAction<Auth>) => {
      state.auth = { ...action.payload };
    },
    selectMode: (state, action: PayloadAction<string>) => {
      state.sex = action.payload;
    },
    setLoadedUserData: (state, action: PayloadAction<loadedUserData>) => {
      state.loadedUserData = { ...action.payload };
    },
    setRoutinesData: (state, action: PayloadAction<Routine[]>) => {
      state.loadedUserData.routines = action.payload;
    },
    updateRoutinesData: (
      state,
      action: PayloadAction<{ routineId: string; replaceWith: Routine }>
    ) => {
      const previosRoutineIndex = state.loadedUserData.routines.findIndex(
        (routine) => {
          return routine._id === action.payload.routineId;
        }
      );
      if (previosRoutineIndex > -1) {
        state.loadedUserData.routines[previosRoutineIndex] = {
          ...action.payload.replaceWith,
        };
      }
    },
    // Extract and refactor this.
    addActivite: (state, action: PayloadAction<{ label: string }>) => {
      state.selectedActivities.push(action.payload.label);
    },
    removeActivite: (state, action: PayloadAction<{ label: string }>) => {
      state.selectedActivities = state.selectedActivities.filter((label) => {
        return action.payload.label !== label;
      });
    },
    selectAllActivities: (state) => {
      state.selectedActivities = [];
    },
  },
});

export const {
  setAuth,
  selectMode,
  setLoadedUserData,
  setRoutinesData,
  updateRoutinesData,
  // Extract and refactor this.
  addActivite,
  removeActivite,
  selectAllActivities,
} = userManager.actions;
export default userManager.reducer;
