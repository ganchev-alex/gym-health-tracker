import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const navigation = {
  toggleState: true,
  explorePreviewVisibility: false,
  headers: {
    centered: false,
    mainHeaderContent: "",
    subHeaderContent: "",
  },
};

const styleManager = createSlice({
  name: "navigation",
  initialState: navigation,
  reducers: {
    toggleNavigation: (state) => {
      state.toggleState = !state.toggleState;
    },
    setHeadersState: (
      state,
      action: PayloadAction<{
        mainHeader: string;
        subHeader: string;
        centered?: boolean;
      }>
    ) => {
      state.headers.mainHeaderContent = action.payload.mainHeader;
      state.headers.subHeaderContent = action.payload.subHeader;
      if (action.payload.centered) {
        state.headers.centered = action.payload.centered;
      } else {
        state.headers.centered = false;
      }
    },
    setExplorePreviewVisibility: (state, action: PayloadAction<boolean>) => {
      state.explorePreviewVisibility = action.payload;
    },
  },
});

export const {
  toggleNavigation,
  setHeadersState,
  setExplorePreviewVisibility,
} = styleManager.actions;
export default styleManager.reducer;
