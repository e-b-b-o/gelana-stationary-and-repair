import { createContext, useReducer, useContext, useEffect } from "react";
import { authReducer, initialState } from "./authReducer";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import { authService } from "./authService";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const register = async (fullname, email, password) => {
    dispatch({ type: "auth/start" });

    try {
      const user = await authService.register(fullname, email, password);
      dispatch({ type: "auth/success", payload: user });
    } catch (error) {
      dispatch({ type: "auth/fail", payload: error.message });

      throw error;
    }
  };

  const login = async (email, password) => {
    dispatch({ type: "auth/start" });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: "auth/success", payload: user });
    } catch (error) {
      dispatch({ type: "auth/fail", payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: "auth/logout" });
  };

  const isAuthenticated = state.user !== null;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
