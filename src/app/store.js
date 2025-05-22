import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./services/baseApi";
import authSlice from "./features/authSlice";
import blogSlice from "./features/blogSlice";
import wribateSlice from "./features/wribateSlice";
import subscriptionSlice from "./features/subscriptionSlice";
import pageSlice from "./features/pageSlice"
// import storeSlice from "./services/storeSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    // store: storeSlice,
    blog: blogSlice,
    wribate: wribateSlice,
    subscription: subscriptionSlice,
    page: pageSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: true,
});

// Optional: Setup listeners for cache invalidation or polling
setupListeners(store.dispatch);

export default store;
