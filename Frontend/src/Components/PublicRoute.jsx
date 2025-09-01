import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute() {
  const { currentUser, loading } = useAuth();


  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="w-90 h-90 flex gap-3 items-center justify-center bg-background rounded-2xl transition-colors duration-3000 shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-primary"></div>
        <span className="text-black">Loading</span>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (currentUser) {
    return <Navigate to="/user" replace />;
  }
  return <Outlet />;
}