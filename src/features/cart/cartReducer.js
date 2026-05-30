import { act } from "react";

export const initialState = {
  cartItems: [],
};

export function cartReducer(state, action) {
  switch (action.type) {
    case "cart/init":
      return { ...state, cartItems: action.payload };
    case "cart/addItem": {
      const item = action.payload;

      const existing = state.cartItems.find((i) => i.id === item.id);

      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, { ...item, quantity: 1 }],
      };
    }
    case "cart/removeItem":
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.id !== action.payload),
      };

    case "cart/removeMultipleItems":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => !action.payload.includes(item.id),
        ),
      };

    case "cart/increaseQuantity":
      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      };
    case "cart/decreaseQuantity":
      return {
        ...state,
        cartItems: state.cartItems
          .map((i) =>
            i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case "cart/clear":
      return { ...state, cartItems: [] };
    default:
      return state;
  }
}
