export const initialState = {
  user: JSON.parse(localStorage.getItem("current_user")) || null,

  loading: false,
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case "auth/start":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "auth/success":
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
      };
    case "auth/fail":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "auth/updateProfile":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "auth/logout":
      return {
        ...state,
        user: null,
        error: null,
      };
    default:
      return state;
  }
}
