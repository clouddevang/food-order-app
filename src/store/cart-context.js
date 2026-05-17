import React from "react";

export const CartStateContext = React.createContext({
  items: [],
  totalAmount: 0,
});

export const CartDispatchContext = React.createContext({
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});
