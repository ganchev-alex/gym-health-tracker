import { configureStore } from "@reduxjs/toolkit";

import userReducers from "./user-actions";
import navigationReducers from "./styles-manager-actions";
import widgetsManager from "./workout-page-actions";
import loadingReducers from "./loading-actions";
import modalsReducers from "./modals";
import workoutStateReducers from "./workout";
import healthEssentialsReducers from "./health-essentials-actions";

const store = configureStore({
  reducer: {
    navigation: navigationReducers,
    widgetsManager: widgetsManager,
    userActions: userReducers,
    loadingManager: loadingReducers,
    modalsManager: modalsReducers,
    workoutState: workoutStateReducers,
    healthEssentials: healthEssentialsReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
