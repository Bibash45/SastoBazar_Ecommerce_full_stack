import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "Paypal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cartItems.find((x) => x._id === item._id);

      if (existingItem) {
        state.cartItems = state.cartItems.map((x) =>
          // x._id === existingItem._id
          //   ? { ...existingItem, qty: existingItem.qty + item.qty }
          //   : x
          x._id === existingItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== productId);

      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
