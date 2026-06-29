import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { cartReducer, initialState } from "./cartReducer";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import * as cartService from "./cartService";

const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [{ cartItems }, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCart() {
      if (!user) {
        dispatch({ type: "cart/init", payload: [] });
        return;
      }
      try {
        setIsLoading(true);
        const cart = await cartService.getCart();
        dispatch({ type: "cart/init", payload: cart });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load cart");
      } finally {
        setIsLoading(false);
      }
    }
    loadCart();
  }, [user]);

  // Actions

  const requireAuth = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const addItem = async (item) => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      await cartService.addToCart(
        item.product_id || item.id,
        item.quantity || 1,
      );
      // Reload cart to get accurate stock and prices from DB
      const cart = await cartService.getCart();
      dispatch({ type: "cart/init", payload: cart });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id) => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      await cartService.deleteCartItem(id);
      dispatch({ type: "cart/removeItem", payload: id });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMultipleItems = async (ids) => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      // Promise.all to remove multiple, or a custom bulk endpoint could be used
      await Promise.all(ids.map((id) => cartService.deleteCartItem(id)));
      dispatch({ type: "cart/removeMultipleItems", payload: ids });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove items");
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantity = async (id) => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      const item = cartItems.find((i) => i.product_id === id || i.id === id);
      const product_id = item.product_id || item.id;
      const newQuantity = (item.quantity || 0) + 1;
      await cartService.updateCartItem(product_id, newQuantity);
      dispatch({ type: "cart/increaseQuantity", payload: id });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseQuantity = async (id) => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      const item = cartItems.find((i) => i.product_id === id || i.id === id);
      const product_id = item.product_id || item.id;
      const newQuantity = (item.quantity || 1) - 1;

      if (newQuantity <= 0) {
        await cartService.deleteCartItem(product_id);
        dispatch({ type: "cart/removeItem", payload: id });
      } else {
        await cartService.updateCartItem(product_id, newQuantity);
        dispatch({ type: "cart/decreaseQuantity", payload: id });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  };

  const clear = async () => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      await cartService.clearCart();
      dispatch({ type: "cart/clear" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  };

  // derived state
  const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: cartItems || [],
        addItem,
        removeItem,
        removeMultipleItems,
        increaseQuantity,
        decreaseQuantity,
        clear,
        totalItems,
        totalPrice,
        isLoading,
        error,
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
