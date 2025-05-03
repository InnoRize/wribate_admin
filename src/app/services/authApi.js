import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `/admin/getCategories`,
    }),
    getDashboard: builder.query({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const queryString = params.toString();
        return `/admin/dashboard${queryString ? `?${queryString}` : ""}`;
      },
    }),

    addCategory: builder.mutation({
      query: ({ newCategory }) => ({
        url: `/admin/addCategory`,
        method: "POST",
        body: newCategory,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, updatedCategory }) => ({
        url: `/admin/updateCategories/${id}`,
        method: "PATCH",
        body: updatedCategory,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/deleteCategories/${id}`,
        method: "DELETE",
      }),
    }),
    getProfile: builder.query({
      query: () => `/user/getProfile`,
    }),
    getUsers: builder.query({
      query: () => `/admin/getUsers`,
    }),
    updateUserRole: builder.mutation({
      query: (updatedUser) => ({
        url: `/admin/updateUserRole`,
        method: "POST",
        body: updatedUser,
      }),
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, updatedStatus }) => ({
        url: `/admin/updateUserStatus/${id}`,
        method: "PATCH",
        body: updatedStatus,
      }),
    }),

    getMyWribatesByCategory: builder.query({
      query: (category) => `/user/getWribateByCategory/${category}`,
    }),
    getMyWribateById: builder.query({
      query: (id) => `/user/getWribateById/${id}`,
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/admin/login`,
        method: "POST",
        body: data,
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: `/user/sendOTP`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `/user/vertfyOTP`,
        method: "POST",
        body: data,
      }),
    }),

    uploadImage: builder.mutation({
      query: ({ type, data }) => ({
        url: `/user/uploadImage?image_type=${type}`,
        method: "POST",
        body: data,
        headers: {},
      }),
    }),
    createWribate: builder.mutation({
      query: (data) => ({
        url: `/user/createWribate`,
        method: "POST",
        body: data,
      }),
    }),
    // createBatchWribate: builder.mutation({
    //   query: (data) => ({
    //     url: `/user/createBatchWribate`,
    //     method: "POST",
    //     body: data,
    //     headers: {},
    //   }),
    // }),
    createBatchWribate: builder.mutation({
      query: (data) => {
        // Console log the data object here
        // console.log("Data being sent to createBatchWribate:", data);
        console.log("FormData entries:");
        for (const pair of data.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        return {
          url: `/user/createBatchWribate`,
          method: "POST",
          body: data,
          headers: {},
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useGetDashboardQuery,

  useGetProfileQuery,
  useUploadImageMutation,
  useCreateWribateMutation,

  useGetMyWribatesByCategoryQuery,
  useGetMyWribateByIdQuery,

  useCreateBatchWribateMutation,

  useGetUsersQuery,
} = authApi;
