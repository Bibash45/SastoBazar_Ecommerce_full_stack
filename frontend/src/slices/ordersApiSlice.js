import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: ({ orderId }) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, paymentResult }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: { ...paymentResult },
      }),
      invalidatesTags: ["Orders"],
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
        // method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
        method: "GET",
      }),
    }),
    getTotal: builder.query({
      query: () => ({
        url: `/api/orders/total`,
        method: "GET",
      }),
      providesTags: ["Orders"],
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: ({
       ...filters
      }) => ({
        url: ORDERS_URL,
        params: {
          ...filters
        },
        method: "GET",
      }),
      keepUnusedDataFor: 5, // This is fine, but can be adjusted based on your needs
    }),

    deliverOrder: builder.mutation({
      query: ({ orderId, order }) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
        body: order,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useGetTotalQuery,
} = orderApiSlice;
