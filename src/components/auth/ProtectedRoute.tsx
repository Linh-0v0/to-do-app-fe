import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, refreshToken, refreshTokenValue } =
    useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Only try to refresh token if we have a refresh token value
    // and we're not authenticated
    if (!isAuthenticated && !isLoading && refreshTokenValue) {
      refreshToken().catch(() => {
        // Silent catch to prevent unhandled promise rejection
      });
    }
  }, [isAuthenticated, isLoading, refreshToken, refreshTokenValue]);

  // While authentication is being checked, show nothing or a loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};
