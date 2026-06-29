import { api } from "../../lib/axios";

export const getCart = async () => {
  const response = await api.get("/carts");
  return response.data.data.cart;
};

export const addToCart = async (product_id, quantity = 1) => {
  const response = await api.post("/carts", { product_id, quantity });
  return response.data.data.item;
};

export const updateCartItem = async (product_id, quantity) => {
  const response = await api.patch(`/carts/${product_id}`, { quantity });
  return response.data.data.item;
};

export const deleteCartItem = async (product_id) => {
  await api.delete(`/carts/${product_id}`);
};

export const clearCart = async () => {
  await api.delete("/carts");
};
