export const initialState = {
  wishlistItems: [],
};

export default function wishlistRaducer(state, action) {
  switch (action.type) {
    case "wishlist/init":
      return { ...state, wishlistItems: action.payload };
    case "TOGGLE_WISHLIST": {
      const exist = state.wishlistItems.find(
        (item) => item.id === action.payload.id,
      );

      if (exist) {
        return {
          ...state,
          wishlistItems: state.wishlistItems.filter(
            (item) => item.id !== action.payload.id,
          ),
        };
      } else {
        return {
          ...state,
          wishlistItems: [...state.wishlistItems, action.payload],
        };
      }
    }
    case "wishlist/removeMultiple":
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (item) => !action.payload.includes(item.id),
        ),
      };
    case "wishlist/clear":
      return { ...state, wishlistItems: [] };
    default:
      return state;
  }
}
