import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Assuming user object has a role property 'ADMIN'
  // If not an admin, redirect to home or somewhere safe
  if (user?.role !== "ADMIN") {
    // For development, if we don't have a role, we might just block them,
    // but the user requested role === 'ADMIN' checking.
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children ? children : <Outlet />;
}
