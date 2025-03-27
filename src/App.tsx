import React from "react";
import { useRoutes, Navigate } from "react-router-dom";

// Layouts
import { MainLayout } from "./components/layout/MainLayout";

// Auth components
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Pages
import TaskListPage from "./pages/tasks/TaskListPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AboutPage from "./pages/AboutPage";

const App: React.FC = () => {
  const routes = useRoutes([
    // Public routes (no authentication required)
    {
      path: "/auth",
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "", element: <Navigate to="/auth/login" replace /> },
      ],
    },

    // Protected routes (authentication required)
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <MainLayout />,
          children: [
            { path: "/tasks", element: <TaskListPage /> },
            { path: "/profile", element: <ProfilePage /> },
            { path: "about", element: <AboutPage /> },
            { path: "", element: <Navigate to="/tasks" replace /> },
          ],
        },
      ],
    },

    // Root redirect
    {
      path: "/",
      element: <Navigate to="/tasks" replace />,
    },

    // 404 catch-all
    {
      path: "*",
      element: (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mb-4">Page not found</p>
          <a href="/" className="text-primary hover:underline">
            Go back home
          </a>
        </div>
      ),
    },
  ]);

  return routes;
};

export default App;
