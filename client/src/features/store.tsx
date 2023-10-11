import { configureStore } from "@reduxjs/toolkit";
import navigationReducers from "./styles-manager/actions";

const store = configureStore({
  reducer: {
    navigation: navigationReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
