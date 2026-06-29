import { api } from "../../lib/axios";

export const getWishlist = async () => {
  const response = await api.get("/wishlists");
  return response.data.data.wishlist;
};

export const addToWishlist = async (product_id) => {
  const response = await api.post("/wishlists", { product_id });
  return response.data.data.item;
};

export const deleteWishlistItem = async (product_id) => {
  await api.delete(`/wishlists/${product_id}`);
};

export const clearWishlist = async () => {
  await api.delete("/wishlists");
};
