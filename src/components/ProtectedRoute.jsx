import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();

  // ❗ user nahi hai → login pe bhejo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ user hai → app open
  return <Outlet />;
}