import { createContext, useReducer, useContext, useEffect } from "react";
import { authReducer , initialState } from "./authReducer";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, loading }, dispatch] = useReducer(
    authReducer,
    initialState,
  );

 useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed && typeof parsed === "object") {
        dispatch({ type: "auth/login", payload: parsed });
      }
    }
  } catch (e) {
    localStorage.removeItem("user");
  }
}, []);


  function login(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch({
      type: "auth/login",
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem("user");
    dispatch({
      type: "auth/logout",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
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
