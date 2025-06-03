import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentDebate: null,
};

const debateSlice = createSlice({
  name: "debate",
  initialState,
  reducers: {
    setCurrentDebate: (state, action) => {
      state.currentDebate = action.payload
    },
  },
});

export const { setCurrentDebate } = debateSlice.actions;

export default debateSlice.reducer;