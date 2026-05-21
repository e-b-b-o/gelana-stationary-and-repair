import { createContext, useReducer, useContext } from "react";
import { authReducer, initialState } from "./authReducer";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, loading }, dispatch] = useReducer(
    authReducer,
    initialState,
  );

  function login(userData) {
    dispatch({ type: "auth/login", payload: userData });
  }

  function logout(userData) {
    dispatch({ type: "auth/logout" });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("Auth context was used outside of AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
