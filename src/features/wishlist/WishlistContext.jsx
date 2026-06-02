import { createContext, useContext, useEffect, useReducer } from "react";
import wishlistRaducer, { initialState } from "./wishlistReducer";
import { useAuth } from "../auth/AuthContext";

const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const { user } = useAuth();
  const wishlistKey = user ? `wishlist_${user.id}` : "wishlist";
  const [{ wishlistItems }, dispatch] = useReducer(
    wishlistRaducer,
    initialState,
  );

  useEffect(() => {
    const saved = localStorage.getItem(wishlistKey);
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: "wishlist/init", payload: parsed });
        }
      } else {
        dispatch({ type: "wishlist/init", payload: [] });
      }
    } catch {
      localStorage.removeItem(wishlistKey);
    }
  }, [wishlistKey]);

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, wishlistKey]);

  //Actions

  const toggleWishlist = (wishlistItem) => {
    dispatch({ type: "TOGGLE_WISHLIST", payload: wishlistItem });
  };

  const removeMultipleItems = (ids) => {
    dispatch({ type: "wishlist/removeMultiple", payload: ids });
  };

  const clearWishlist = () => {
    dispatch({ type: "wishlist/clear" });
  };

  return (
    <WishlistContext.Provider
      value={{
        toggleWishlist,
        wishlistItems,
        clearWishlist,
        removeMultipleItems,
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

// eslint-disable-next-line react-refresh/only-export-components
export { WishlistProvider, useWishlist };
