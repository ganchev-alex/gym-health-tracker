import { configureStore } from "@reduxjs/toolkit";

import userReducers from "./user-actions";
import navigationReducers from "./styles-manager-actions";
import widgetsManager from "./widgets-actions";
import loadingReducers from "./loading-actions";
import modalsReducers from "./modals";
import workoutStateReducers from "./workout";

const store = configureStore({
  reducer: {
    navigation: navigationReducers,
    widgetsManager: widgetsManager,
    userActions: userReducers,
    loadingManager: loadingReducers,
    modalsManager: modalsReducers,
    workoutState: workoutStateReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
