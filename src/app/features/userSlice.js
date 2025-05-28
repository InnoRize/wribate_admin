import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    clearUser: (state) => {
      state.currentUser = null
    },
  },
});

export const { setCurrentUser, clearUser } = userSlice.actions;

export default userSlice.reducer;