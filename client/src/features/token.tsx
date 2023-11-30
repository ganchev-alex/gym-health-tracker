import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthToken {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthToken = {
  token: null,
  isAuthenticated: false,
};

const tokenManager = createSlice({
  name: "tokenManager",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setToken, clearToken } = tokenManager.actions;
export default tokenManager.reducer;
