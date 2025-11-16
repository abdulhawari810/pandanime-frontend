import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { user, loading, isAdmin, isUser } = useAuth();

  if (loading)
    return <div className="text-center text-slate-200">Loading...</div>;

  if (!user) return <Navigate to="/Auth/Login" replace />;

  if (role === "admin" && !isAdmin) return <Navigate to="/" replace />;

  if (role === "user" && !isUser) return <Navigate to="/" replace />;

  return children;
}
