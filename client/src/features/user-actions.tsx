import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Auth {
  email: string;
  password: string;
}

const initialUser: {
  auth: Auth;
  sex: string;
  selectedActivities: string[];
} = {
  auth: {
    email: "",
    password: "",
  },
  sex: "male",
  selectedActivities: [],
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
  addActivite,
  removeActivite,
  selectAllActivities,
} = userManager.actions;
export default userManager.reducer;
