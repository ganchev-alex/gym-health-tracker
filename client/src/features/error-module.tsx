import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ModuleData = {
  responseCode: number;
  title: string;
  details: string;
  label: string;
  redirectionRoute: string;
};

const initialState = {
  isShown: false,
  moduleData: {
    responseCode: 0,
    title: "",
    details: "",
    label: "",
    redirectionRoute: "",
  },
};

const errorModuleState = createSlice({
  name: "errorModuleState",
  initialState,
  reducers: {
    changeVisibility: (state, action: PayloadAction<boolean>) => {
      state.isShown = action.payload;
    },
    setModuleData: (state, action: PayloadAction<ModuleData>) => {
      state.moduleData = { ...action.payload };
    },
  },
});

export const { changeVisibility, setModuleData } = errorModuleState.actions;
export default errorModuleState.reducer;
