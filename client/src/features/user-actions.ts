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
  notes: string;
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
  auth: {
    email: string;
    verification: boolean;
  };
  personalDetails: {
    firstName: string;
    lastName: string;
    sex: string;
    profilePicture: string;
    weight: number;
    height: number;
    age: number;
  };
  routines: Routine[];
  preferences: {
    selectedActivities: string[];
    fitnessLevel: string;
    frequencyStatus: string;
    fitnessGoal: string;
  };
  explorations: {
    _id: string;
    title: string;
    category: string;
    duration: number;
    image: string;
    content: { description: string };
  }[];
}

const initialUser: {
  auth: Auth;
  sex: string;
  isMale: boolean;
  loadedUserData: loadedUserData;
} = {
  auth: {
    email: "",
    password: "",
  },
  sex: "male",
  isMale: true,
  loadedUserData: {
    auth: {
      email: "",
      verification: false,
    },
    personalDetails: {
      firstName: "",
      lastName: "",
      sex: "",
      profilePicture: "",
      weight: 0,
      height: 0,
      age: 0,
    },
    routines: [],
    preferences: {
      selectedActivities: [],
      fitnessLevel: "",
      frequencyStatus: "",
      fitnessGoal: "",
    },
    explorations: [],
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
      state.isMale = action.payload === "male";
    },
    setLoadedUserData: (state, action: PayloadAction<loadedUserData>) => {
      state.loadedUserData = { ...action.payload };
      state.isMale = action.payload.personalDetails.sex === "male";
    },
    setRoutinesData: (
      state,
      action: PayloadAction<{ routines: Routine[]; append?: boolean }>
    ) => {
      if (action.payload.append === true) {
        state.loadedUserData.routines = [
          ...state.loadedUserData.routines,
          ...action.payload.routines,
        ];
      } else {
        state.loadedUserData.routines = action.payload.routines;
      }
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
  },
});

export const {
  setAuth,
  selectMode,
  setLoadedUserData,
  setRoutinesData,
  updateRoutinesData,
} = userManager.actions;
export default userManager.reducer;
