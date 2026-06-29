import { createContext, useContext, useEffect, useReducer, useState } from "react";
import wishlistReducer, { initialState } from "./wishlistReducer";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import * as wishlistService from "./wishlistService";

const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [{ wishlistItems }, dispatch] = useReducer(wishlistReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadWishlist() {
      if (!user) {
        dispatch({ type: "wishlist/init", payload: [] });
        return;
      }
      try {
        setIsLoading(true);
        const wishlist = await wishlistService.getWishlist();
        dispatch({ type: "wishlist/init", payload: wishlist });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load wishlist");
      } finally {
        setIsLoading(false);
      }
    }
    loadWishlist();
  }, [user]);

  const requireAuth = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  // Actions

  const toggleWishlist = async (wishlistItem) => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      const product_id = wishlistItem.product_id || wishlistItem.id;
      const exists = wishlistItems.some(i => i.product_id === product_id || i.id === product_id);
      
      if (exists) {
        await wishlistService.deleteWishlistItem(product_id);
      } else {
        await wishlistService.addToWishlist(product_id);
      }
      
      // Reload wishlist from backend for consistency
      const wishlist = await wishlistService.getWishlist();
      dispatch({ type: "wishlist/init", payload: wishlist });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to modify wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMultipleItems = async (ids) => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      await Promise.all(ids.map(id => wishlistService.deleteWishlistItem(id)));
      
      const wishlist = await wishlistService.getWishlist();
      dispatch({ type: "wishlist/init", payload: wishlist });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove items");
    } finally {
      setIsLoading(false);
    }
  };

  const clearWishlist = async () => {
    if (!requireAuth()) return;
    try {
      setIsLoading(true);
      await wishlistService.clearWishlist();
      dispatch({ type: "wishlist/clear" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        toggleWishlist,
        wishlistItems: wishlistItems || [],
        clearWishlist,
        removeMultipleItems,
        isLoading,
        error
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined)
    throw new Error("Wishlist context was used outside of WishList Provider");
  return context;
}

export { WishlistProvider, useWishlist };
