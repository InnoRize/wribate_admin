import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userId: null,
  userRole: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.userRole = action.payload.userRole;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
      state.userRole = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
