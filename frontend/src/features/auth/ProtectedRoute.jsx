import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Spinner from "../../ui/Spinner";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
