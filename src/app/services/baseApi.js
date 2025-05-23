import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
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
