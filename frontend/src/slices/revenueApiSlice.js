import { apiSlice } from "./apiSlice";

export const revenueApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTotalRevenue: builder.query({
      query: () => ({
        url: `/api/revenue`,
        method: "GET",
      }),
      providesTags: ["Revenue"],
      keepUnusedDataFor: 5,
    }),
    getMonthlyRevenue: builder.query({
      query: () => ({
        url: `/api/revenue/monthly`,
        method: "GET",
      }),
      providesTags: ["Revenue"],
      keepUnusedDataFor: 5,
    }),
    getTopSellingProducts: builder.query({
      query: () => ({
        url: `/api/top-selling-products`,
        method: "GET",
      }),
      providesTags: ["Revenue"],
      keepUnusedDataFor: 5,
    }),
    getMonthlyVisit: builder.query({
      query: () => ({
        url: `/api/visit/monthly`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetTotalRevenueQuery,
  useGetMonthlyRevenueQuery,
  useGetTopSellingProductsQuery,
  useGetMonthlyVisitQuery,
} = revenueApiSlice;
