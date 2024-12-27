import { apiSlice } from "./apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: `/api/allcategory`,
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),
    getCategories: builder.query({
      query: ({ pageNumber, keyword }) => ({
        url: `/api/categorylist`,
        params: {
          pageNumber,
          keyword,
        },
      }),
      providesTags: ["Category"],
      keepUnusedDataFor: 5,
    }),
    getCategoryDetails: builder.query({
      query: (CategoryId) => ({
        url: `/api/categorydetails/${CategoryId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `/api/postcategory`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, category_name }) => ({
        url: `/api/updatecategory/${categoryId}`,
        method: "PUT",
        body: { category_name },
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (CategoryId) => ({
        url: `/api/deletecategory/${CategoryId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryDetailsQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} = categoryApiSlice;
