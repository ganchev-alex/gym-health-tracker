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

const calendarWidget: { currantYear: number; currantMonth: number } = {
  currantYear: new Date().getFullYear(),
  currantMonth: new Date().getMonth(),
};

const calendarWidgetManager = createSlice({
  name: "calendarWidget",
  initialState: calendarWidget,
  reducers: {
    renderCalendar: (state) => {
      const firstDayMonth = new Date(
        state.currantYear,
        state.currantMonth,
        1
      ).getDate();
      const lastDateMonth = new Date(
        state.currantYear,
        state.currantMonth + 1,
        0
      ).getDate();
      const lastDayMonth = new Date(
        state.currantYear,
        state.currantMonth,
        lastDateMonth
      ).getDay();
      const lastDateLastMonth = new Date(
        state.currantYear,
        state.currantMonth,
        0
      ).getMonth();
    },
  },
});

export const { addFilter, removeFilter, selectAll } =
  workoutWidgetManager.actions;
export default workoutWidgetManager.reducer;
