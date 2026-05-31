import { createContext, useContext, useEffect, useReducer } from "react";
import { cartReducer, initialState } from "./cartReducer";

const CartContext = createContext();

function CartProvider({ children }) {
  const [{ cartItems }, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: "cart/init", payload: parsed });
        }
      }
    } catch (e) {
      localStorage.removeItem("cart");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Actions

  const addItem = (item) => {
    dispatch({ type: "cart/addItem", payload: item });
  };
  const removeItem = (id) => {
    dispatch({ type: "cart/removeItem", payload: id });
  };
  const removeMultipleItems = (ids) => {
    dispatch({ type: "cart/removeMultipleItems", payload: ids });
  };
  const increaseQuantity = (id) => {
    dispatch({ type: "cart/increaseQuantity", payload: id });
  };
  const decreaseQuantity = (id) => {
    dispatch({ type: "cart/decreaseQuantity", payload: id });
  };
  const clear = () => {
    dispatch({ type: "cart/clear" });
  };

  //derived state

  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: cartItems,
        addItem,
        removeItem,
        removeMultipleItems,
        increaseQuantity,
        decreaseQuantity,
        clear,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);

  if (context === undefined)
    throw new Error("CartContext was used outside of CartProvider");
  return context;
}

export { CartProvider, useCart };
