import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ChoiceModal {
  visibility: boolean;
}

interface HelpModal {
  visibility: boolean;
  tip: string;
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

interface SummaryPreviewModal {
  visibility: boolean;
  essential: string;
  metrix: string;
  color: string;
}

const initialState: {
  choiceModal: ChoiceModal;
  helpModal: HelpModal;
  errorModal: ErrorModal;
  workoutFinishedModal: WorkoutFinishedModal;
  summaryPreviewModal: SummaryPreviewModal;
} = {
  choiceModal: {
    visibility: false,
  },
  helpModal: {
    visibility: false,
    tip: "",
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
  summaryPreviewModal: {
    visibility: false,
    essential: "",
    metrix: "",
    color: "",
  },
};

const modalsState = createSlice({
  name: "modalsState",
  initialState,
  reducers: {
    setErrorModalVisibility: (state, action: PayloadAction<boolean>) => {
      state.errorModal.visibility = action.payload;
    },
    setErrorModalState: (state, action: PayloadAction<ErrorModal>) => {
      state.errorModal = { ...action.payload };
    },
    setHelpModalState: (
      state,
      action: PayloadAction<{ visibility: boolean; tip?: string }>
    ) => {
      state.helpModal.visibility = action.payload.visibility;
      if (action.payload.tip) {
        state.helpModal.tip = action.payload.tip;
      }
    },
    setChoiceModalVisibility: (state, action: PayloadAction<boolean>) => {
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
    setEssentialPreviewModalState: (
      state,
      action: PayloadAction<{
        visibility: boolean;
        essenstial?: string;
        metrix?: string;
        color?: string;
      }>
    ) => {
      state.summaryPreviewModal.visibility = action.payload.visibility;
      if (action.payload.essenstial !== undefined) {
        state.summaryPreviewModal.essential = action.payload.essenstial;
      }
      if (action.payload.metrix !== undefined) {
        state.summaryPreviewModal.metrix = action.payload.metrix;
      }
      if (action.payload.color !== undefined) {
        state.summaryPreviewModal.color = action.payload.color;
      }
    },
  },
});

export const {
  setErrorModalVisibility,
  setErrorModalState,
  setHelpModalState,
  setChoiceModalVisibility,
  changeFinishedWorkoutVisibility,
  finishedWorkoutData,
  setEssentialPreviewModalState,
} = modalsState.actions;
export default modalsState.reducer;
