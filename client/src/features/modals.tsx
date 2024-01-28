import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ChoiceModal {
  visibility: boolean;
}

interface ErrorModal {
  visibility?: boolean;
  responseCode: number;
  title: string;
  details: string;
  label: string;
  redirectionRoute: string;
}

const initialState: { choiceModal: ChoiceModal; errorModal: ErrorModal } = {
  choiceModal: {
    visibility: false,
  },
  errorModal: {
    visibility: false,
    responseCode: 0,
    title: "",
    details: "",
    label: "",
    redirectionRoute: "",
  },
};

const modalsState = createSlice({
  name: "modalsState",
  initialState,
  reducers: {
    changeErrorModalVisibility: (state, action: PayloadAction<boolean>) => {
      state.errorModal.visibility = action.payload;
    },
    setErrorModalState: (state, action: PayloadAction<ErrorModal>) => {
      state.errorModal = { ...action.payload };
    },
    changeChoiceModalVisibility: (state, action: PayloadAction<boolean>) => {
      state.choiceModal.visibility = action.payload;
    },
  },
});

export const {
  changeErrorModalVisibility,
  setErrorModalState,
  changeChoiceModalVisibility,
} = modalsState.actions;
export default modalsState.reducer;
