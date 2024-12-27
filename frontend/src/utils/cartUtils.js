export const addDemicals = (num) => {
  return Math.round((num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // calculate items price
  state.itemsPrice = addDemicals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // calculate shipping price (If order is over $100 then free, else $10 shipping)
  state.shippingPrice = addDemicals(state.itemsPrice > 10 ? 0 : 1);

  // calculate tax price
  state.taxPrice = addDemicals(Number(0.15 * state.itemsPrice).toFixed(2));

  // calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
