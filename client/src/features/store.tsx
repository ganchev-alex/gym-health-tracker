import { configureStore } from "@reduxjs/toolkit";
import navigationReducers from "./styles-manager/actions";
import workoutWidgetReducers from "./widgets/actions";

const store = configureStore({
  reducer: {
    navigation: navigationReducers,
    workoutWidget: workoutWidgetReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
