import { createContext, useContext, useEffect, useReducer } from "react";
import wishlistRaducer, { initialState } from "./wishlistReducer";

const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const [{ wishlistItems }, dispatch] = useReducer(
    wishlistRaducer,
    initialState,
  );

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: "wishlist/init", payload: parsed });
        }
      }
    } catch (e) {
      localStorage.removeItem("wishlist");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  //Actions

  const toggleWishlist = (wishlistItem) => {
    dispatch({ type: "TOGGLE_WISHLIST", payload: wishlistItem });
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
