import { PRODUCT_URL, UPLOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        pageNumber,
        keyword,
        category,
        minPrice,
        maxPrice,
        minRating,
      }) => ({
        url: PRODUCT_URL,
        params: {
          pageNumber,
          keyword,
          category,
          minPrice,
          maxPrice,
          minRating,
        },
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),
    getTotalProducts: builder.query({
      query: () => ({
        url: `/api/products/total`,
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),
    getOutOfStockProducts: builder.query({
      query: (stock) => ({
        url: `/api/products/checkstock`,
        params: { stock },
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),
    getSimilarProducts: builder.query({
      query: ({ productId }) => ({
        url: `/api/products/${productId}/similar`,
        method: "GET",
        // params: {
        //   pageNumber,
        //   keyword,
        // },
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCT_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOADS_URL,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetSimilarProductsQuery,
  useGetTotalProductsQuery,
  useGetOutOfStockProductsQuery,
} = productsApiSlice;
