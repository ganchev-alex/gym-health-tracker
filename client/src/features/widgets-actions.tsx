import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const workoutsWidget: { selectedFilters: string[]; isAll: boolean } = {
  selectedFilters: [],
  isAll: true,
};

const workoutWidgetManager = createSlice({
  name: "workoutWidget",
  initialState: workoutsWidget,
  reducers: {
    addFilter: (state, action: PayloadAction<{ label: string }>) => {
      state.selectedFilters.push(action.payload.label);
    },
    removeFilter: (state, action: PayloadAction<{ label: string }>) => {
      state.selectedFilters = state.selectedFilters.filter((label) => {
        return action.payload.label !== label;
      });
    },
    selectAll: (state) => {
      state.selectedFilters = [];
    },
  },
});

export const { addFilter, removeFilter, selectAll } =
  workoutWidgetManager.actions;
export default workoutWidgetManager.reducer;
