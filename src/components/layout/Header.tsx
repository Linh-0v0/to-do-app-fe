import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "../ui/button";
import { getInitials } from "@/lib/utils";
import { Menu, LogOut, Bell, Settings, User as UserIcon } from "lucide-react";
import { FCMService } from "@/lib/services/fcmService";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const handleRequestNotifications = async () => {
    try {
      if (!FCMService.isSupported()) {
        console.error("Notifications are not supported in this browser");
        return;
      }

      await FCMService.requestPermissionAndGetToken();
      setIsNotificationsEnabled(true);
    } catch (error) {
      console.error("Failed to enable notifications:", error);
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
              {!isNotificationsEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex"
                  onClick={handleRequestNotifications}
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Enable Notifications
                </Button>
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

                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                        Settings
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
