import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentWribate: null,
};

const wribateSlice = createSlice({
  name: "wribate",
  initialState,
  reducers: {
    setCurrentWribate: (state, action) => {
      state.currentWribate = action.payload
    },
    clearWribate: (state) => {
      state.currentWribate = null
    },
  },
});

export const { setCurrentWribate, clearWribate } = wribateSlice.actions;

export default wribateSlice.reducer;