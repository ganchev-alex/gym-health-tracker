import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const loadingState = createSlice({
  name: "loadingState",
  initialState,
  reducers: {
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoadingState } = loadingState.actions;
export default loadingState.reducer;
