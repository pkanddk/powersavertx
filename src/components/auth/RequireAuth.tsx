import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("[RequireAuth] No user found, redirecting to login");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}