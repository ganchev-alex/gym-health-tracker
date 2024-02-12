import { createSlice } from "@reduxjs/toolkit";

const navigation = {
  toggleState: true,
};

const navigationManager = createSlice({
  name: "navigation",
  initialState: navigation,
  reducers: {
    toggle: (state) => {
      state.toggleState = !state.toggleState;
    },
  },
});

export const { toggle } = navigationManager.actions;
export default navigationManager.reducer;
