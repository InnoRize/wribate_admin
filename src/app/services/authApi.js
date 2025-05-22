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
      query: (category) => `/admin/writesByCategory/${category}`,
    }),
    getMyWribateById: builder.query({
      query: (id) => `/admin/getWribateById/${id}`,
    }),
    signin: builder.mutation({
      query: (data) => ({
        url: `/admin/signin`,
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
    deleteWribate: builder.mutation({
      query: (id) => ({
        url: `/admin/deleteWribate/${id}`,
        method: "DELETE",
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

    addCountry: builder.mutation({
      query: ({ newCountry }) => ({
        url: `/admin/addCountry`,
        method: "POST",
        body: newCountry,
      }),
    }),
    getCountries: builder.query({
      query: () => `/admin/getCountries`,
    }),
    updateCountry: builder.mutation({
      query: ({ id, updatedCountry }) => ({
        url: `/admin/updateCountries/${id}`,
        method: "PATCH",
        body: updatedCountry,
      }),
    }),
    deleteCountry: builder.mutation({
      query: (id) => ({
        url: `/admin/deleteCountries/${id}`,
        method: "DELETE",
      }),
    }),
    addRole: builder.mutation({
      query: ({ newRole }) => ({
        url: `/admin/addRole`,
        method: "POST",
        body: newRole,
      }),
    }),
    getRoles: builder.query({
      query: () => `/admin/getRoles`,
    }),
    updateRole: builder.mutation({
      query: ({ id, updatedRole }) => ({
        url: `/admin/updateRole/${id}`,
        method: "PATCH",
        body: updatedRole,
      }),
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/admin/deleteRole/${id}`,
        method: "DELETE",
      }),
    }),
    addSubscription: builder.mutation({
      query: ({ newSubscription }) => ({
        url: `/admin/addSubscription`,
        method: "POST",
        body: newSubscription,
      }),
    }),
    getSubscriptions: builder.query({
      query: () => `/admin/getSubscriptions`,
    }),
    updateSubscription: builder.mutation({
      query: ({ id, updatedSubscription }) => ({
        url: `/admin/updateSubscription/${id}`,
        method: "PATCH",
        body: updatedSubscription,
      }),
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/admin/deleteSubscription/${id}`,
        method: "DELETE",
      }),
    }),
    addPage: builder.mutation({
      query: ({newPage }) => ({
        url: `/admin/addPage`,
        method: "POST",
        body: newPage,
      }),
    }),
    getPage: builder.query({
      query: ({ name }) => `/admin/getPage/${name}`,
    }),
    getAllPages: builder.query({
      query: () => `/admin/getAllPages`,
    }),
    updatePage: builder.mutation({
      query: ({ id, updatedPage }) => ({
        url: `/admin/updatePage/${id}`,
        method: "POST",
        body: updatedPage,
      }),
    }),
    deletePage: builder.mutation({
      query: ({ id, }) => ({
        url: `/admin/deletePage/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSigninMutation,
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
  useDeleteWribateMutation,

  useGetMyWribatesByCategoryQuery,
  useGetMyWribateByIdQuery,

  useCreateBatchWribateMutation,

  useGetUsersQuery,

  useAddCountryMutation,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useGetCountriesQuery,

  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,

  useAddSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionsQuery,

  useAddPageMutation,
  useDeletePageMutation,
  useGetPageQuery,
  useGetAllPagesQuery,
  useUpdatePageMutation,

} = authApi;
