import { createContext, useReducer, useContext } from "react";
import { authReducer, initialState } from "./authReducer";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import authService from "./authService.js";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const register = async (userData) => {
    dispatch({ type: "auth/start" });

    try {
      const user = await authService.register(userData);
      dispatch({ type: "auth/success", payload: user });
    } catch (error) {
      dispatch({ type: "auth/fail", payload: error.message });

      throw error;
    }
  };

  const login = async (credentials) => {
    dispatch({ type: "auth/start" });
    try {
      const user = await authService.login(credentials);
      dispatch({ type: "auth/success", payload: user });
    } catch (error) {
      dispatch({ type: "auth/fail", payload: error.message });
      throw error;
    }
  };

  const updateUser = async (updatedData) => {
    dispatch({ type: "auth/start" });
    try {
      const user = await authService.updateProfile(updatedData);
      dispatch({ type: "auth/success", payload: user });
    } catch (error) {
      dispatch({ type: "auth/fail", payload: error.message });
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    await authService.changePassword(passwordData);
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
        updateUser,
        changePassword,
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

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
