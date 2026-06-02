import { createContext, useContext, useEffect, useReducer } from "react";
import orderReducer, { initialState } from "./orderReducer";
import { useAuth } from "../auth/AuthContext";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const orderKey = user ? `orders_${user.id}` : "orders";

  const [{ orders }, dispatch] = useReducer(orderReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem(orderKey);
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: "order/init", payload: parsed });
        }
      } else {
        dispatch({ type: "order/init", payload: [] });
      }
    } catch (e) {
      localStorage.removeItem(orderKey);
    }
  }, [orderKey]);

  useEffect(() => {
    localStorage.setItem(orderKey, JSON.stringify(orders));
  }, [orders, orderKey]);

  // Actions
  const createOrder = (orderDetails) => {
    const newOrder = {
      ...orderDetails,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    dispatch({ type: "order/addOrder", payload: newOrder });
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    dispatch({ type: "order/updateStatus", payload: { id, status } });
  };

  const clearOrders = () => {
    dispatch({ type: "order/clear" });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined)
    throw new Error("useOrder must be used within an OrderProvider");
  return context;
}
