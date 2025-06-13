import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentScrapped: null,
};

const scrappedSlice = createSlice({
  name: "scrapped",
  initialState,
  reducers: {
    setCurrentScrapped: (state, action) => {
      state.currentScrapped = action.payload
    },
  },
});

export const { setCurrentScrapped } = scrappedSlice.actions;

export default scrappedSlice.reducer;