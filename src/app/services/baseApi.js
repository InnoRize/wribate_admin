import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_BASE_URL,
  // credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token"); // Fetch latest token before each request

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // headers.set("Custom-Header", "YourHeaderValue"); // Other custom headers
    return headers;
  },
});

export const baseApi = createApi({
  baseQuery,
  endpoints: () => ({}),
});
