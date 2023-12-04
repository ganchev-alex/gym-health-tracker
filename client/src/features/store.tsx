import { configureStore } from "@reduxjs/toolkit";

import userReducers from "./user-actions";
import navigationReducers from "./styles-manager-actions";
import workoutWidgetReducers from "./widgets-actions";
import loadingReducers from "./loading-actions";
import errorModuleReducers from "./error-module";

const store = configureStore({
  reducer: {
    navigation: navigationReducers,
    workoutWidget: workoutWidgetReducers,
    userActions: userReducers,
    loadingManager: loadingReducers,
    errorModuleManager: errorModuleReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
