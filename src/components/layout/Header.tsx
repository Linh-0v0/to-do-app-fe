import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "../ui/button";
import { getInitials } from "@/lib/utils";
import { Menu, LogOut, Bell, Settings, User as UserIcon, AlertCircle } from "lucide-react";
import { FCMService } from "@/lib/services/fcmService";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, logout, isAuthenticated, updateFCMToken } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationState, setNotificationState] = useState({
    isLoading: false,
    error: null as string | null,
    isSupported: false,
  });

  useEffect(() => {
    // Check if notifications are supported when component mounts
    const { supported } = FCMService.getNotificationStatus();
    setNotificationState(prev => ({
      ...prev,
      isSupported: supported,
    }));
  }, []);

  // Check notification status based on user fcmToken and notification permission
  const isNotificationsEnabled = !!user?.fcmToken;

  const handleRequestNotifications = async () => {
    setNotificationState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      if (!FCMService.isSupported()) {
        throw new Error("Notifications are not supported in this browser");
      }

      const token = await FCMService.requestPermissionAndGetToken();
      
      // Update the FCM token in the user profile
      if (token) {
        await updateFCMToken(token);
      }
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      setNotificationState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to enable notifications",
      }));
    } finally {
      setNotificationState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "bg-background border-b py-3 px-4 sticky top-0 z-10",
        className
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="text-primary">Toodooloo</span>
        </Link>

        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {!isNotificationsEnabled && notificationState.isSupported && (
                <div className="hidden md:block">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestNotifications}
                    disabled={notificationState.isLoading}
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    {notificationState.isLoading 
                      ? "Enabling..." 
                      : "Enable Notifications"}
                  </Button>
                  {notificationState.error && (
                    <div className="absolute mt-1 p-1 text-xs bg-red-50 text-red-600 rounded border border-red-200">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      {notificationState.error}
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="rounded-full h-9 w-9 text-foreground"
                >
                  {user?.firstname ? (
                    <span className="text-sm font-medium">
                      {getInitials(`${user.firstname} ${user.lastname || ""}`)}
                    </span>
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border divide-y divide-border">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium">
                        {user?.firstname} {user?.lastname}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        Your Profile
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent cursor-pointer text-destructive"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Sign In</Link>
              </Button>

              <Button asChild>
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
