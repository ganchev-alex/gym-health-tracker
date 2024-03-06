import { configureStore } from "@reduxjs/toolkit";

import userReducers from "./user-actions";
import styleManager from "./styles-manager-actions";
import widgetsManager from "./workout-page-actions";
import loadingReducers from "./loading-actions";
import modalsReducers from "./modals";
import workoutStateReducers from "./workout";
import healthEssentialsReducers from "./health-essentials-actions";
import exploreReducers from "./explore-actions";

const store = configureStore({
  reducer: {
    styleManager: styleManager,
    widgetsManager: widgetsManager,
    userActions: userReducers,
    loadingManager: loadingReducers,
    modalsManager: modalsReducers,
    workoutState: workoutStateReducers,
    healthEssentials: healthEssentialsReducers,
    exploreState: exploreReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
