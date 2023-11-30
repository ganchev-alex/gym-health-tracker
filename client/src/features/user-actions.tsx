import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Auth {
  email: string;
  password: string;
}

interface PersonalDetails {
  firstName: string;
  lastName: string;
  age: number;
  sex: string;
  weight: number;
  height: number;
}

interface ActivitiesPreference {
  fitnessLevel: string;
  frequencyStatus: string;
  fitnessGoal: string;
}

const initialUser: {
  auth: Auth;
  personalDetails: PersonalDetails;
  selectedActivities: string[];
  activitiesPreference: ActivitiesPreference;
} = {
  auth: {
    email: "",
    password: "",
  },
  personalDetails: {
    firstName: "",
    lastName: "",
    age: 0,
    sex: "male",
    weight: 0,
    height: 0,
  },
  selectedActivities: [],
  activitiesPreference: {
    fitnessLevel: "",
    frequencyStatus: "",
    fitnessGoal: "",
  },
};

const userManager = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setAuth: (state, action: PayloadAction<Auth>) => {
      state.auth = { ...action.payload };
    },
    setPersonalDetails: (state, action: PayloadAction<PersonalDetails>) => {
      state.personalDetails = { ...action.payload };
    },
    selectMode: (state, action: PayloadAction<string>) => {
      state.personalDetails.sex = action.payload;
    },
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
    setPreferences: (state, action: PayloadAction<ActivitiesPreference>) => {
      state.activitiesPreference = { ...action.payload };
    },
  },
});

export const {
  setAuth,
  setPersonalDetails,
  selectMode,
  addActivite,
  removeActivite,
  selectAllActivities,
  setPreferences,
} = userManager.actions;
export default userManager.reducer;
