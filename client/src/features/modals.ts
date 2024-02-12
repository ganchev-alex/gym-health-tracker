import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ChoiceModal {
  visibility: boolean;
}

interface WorkoutFinishedModal {
  visibility: boolean;
  finishedWorkoutData: {
    records: { exercise: string; kg: number }[];
    number: number;
  };
}

interface ErrorModal {
  visibility?: boolean;
  responseCode: number;
  title: string;
  details: string;
  label: string;
  redirectionRoute: string;
}

const initialState: {
  choiceModal: ChoiceModal;
  errorModal: ErrorModal;
  workoutFinishedModal: WorkoutFinishedModal;
} = {
  choiceModal: {
    visibility: false,
  },
  workoutFinishedModal: {
    visibility: false,
    finishedWorkoutData: {
      records: [],
      number: 0,
    },
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
    changeFinishedWorkoutVisibility: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.workoutFinishedModal.visibility = action.payload;
    },
    finishedWorkoutData: (
      state,
      action: PayloadAction<{
        records: { exercise: string; kg: number }[];
        number: number;
      }>
    ) => {
      state.workoutFinishedModal.finishedWorkoutData = { ...action.payload };
    },
  },
});

export const {
  changeErrorModalVisibility,
  setErrorModalState,
  changeChoiceModalVisibility,
  changeFinishedWorkoutVisibility,
  finishedWorkoutData,
} = modalsState.actions;
export default modalsState.reducer;
