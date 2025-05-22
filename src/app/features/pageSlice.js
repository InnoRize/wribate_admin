import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: null,
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    clearPage: (state) => {
      state.currentPage = null
    },
  },
});

export const { setCurrentPage, clearPage } = pageSlice.actions;

export default pageSlice.reducer;