export const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

export function authReducer(state, action) {
  switch (action.type) {
    case "auth/login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "auth/logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "auth/loading":
      return {
        ...state,
        loading: true,
      };
    case "auth/stopLoading":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
