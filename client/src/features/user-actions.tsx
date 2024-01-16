import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Auth {
  email: string;
  password: string;
}

interface loadedUserData {
  auth: { email: string };
  personalDetails: {
    firstName: string;
    lastNamee: string;
    sex: string;
    profilePicture: string;
  };
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
  selectedActivities: [],
  loadedUserData: {
    auth: { email: "" },
    personalDetails: {
      firstName: "",
      lastNamee: "",
      sex: "",
      profilePicture: "",
    },
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
  // Extract and refactor this.
  addActivite,
  removeActivite,
  selectAllActivities,
} = userManager.actions;
export default userManager.reducer;
