import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSubscription: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setCurrentSubscription: (state, action) => {
      state.currentSubscription = action.payload
    },
    clearSubscription: (state) => {
      state.currentSubscription = null
    },
  },
});

export const { setCurrentSubscription, clearSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;