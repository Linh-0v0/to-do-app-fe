import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FCMService } from "@/lib/services/fcmService";
import { Bell, Save, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, updateFCMToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<{
    isLoading: boolean;
    error: string | null;
    permission: string | null;
    supported: boolean;
  }>({
    isLoading: false,
    error: null,
    permission: null,
    supported: false,
  });
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    username: user?.username || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    // Check notification permission status on component mount
    const { supported, permission } = FCMService.getNotificationStatus();
    setNotificationStatus(prev => ({
      ...prev,
      supported,
      permission,
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real application, this would call an API endpoint
      // await api.patch('/users/me', formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // In a real application, this would call an API endpoint
      // await api.post('/users/change-password', passwordData);
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      setPasswordError("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    setNotificationStatus(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));
    
    try {
      if (!FCMService.isSupported()) {
        throw new Error("Notifications are not supported in this browser");
      }

      const token = await FCMService.requestPermissionAndGetToken();
      await updateFCMToken(token);
      
      // Update status after success
      setNotificationStatus(prev => ({
        ...prev,
        isLoading: false,
        permission: 'granted',
      }));
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      setNotificationStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to enable notifications",
        // Check if this was a permission denial
        permission: Notification.permission,
      }));
    }
  };

  // Determine the notification button state and message
  const renderNotificationButton = () => {
    if (user?.fcmToken) {
      return (
        <p className="text-sm text-green-600">
          ✓ Push notifications are enabled
        </p>
      );
    }

    if (!notificationStatus.supported) {
      return (
        <p className="text-sm text-orange-600">
          <AlertCircle className="h-4 w-4 inline mr-1" />
          Push notifications are not supported in this browser
        </p>
      );
    }

    if (notificationStatus.permission === 'denied') {
      return (
        <div>
          <p className="text-sm text-red-600 mb-2">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            Permission denied. Please enable notifications in your browser settings.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('about:preferences#privacy', '_blank')}
          >
            Open Browser Settings
          </Button>
        </div>
      );
    }

    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEnableNotifications}
          disabled={notificationStatus.isLoading}
        >
          <Bell className="h-4 w-4 mr-2" />
          {notificationStatus.isLoading 
            ? "Enabling..." 
            : "Enable Push Notifications"}
        </Button>
        {notificationStatus.error && (
          <p className="text-sm text-red-600 mt-2">
            {notificationStatus.error}
          </p>
        )}
      </>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Update your personal information and notification preferences
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-medium mb-4">Personal Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstname" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastname" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              value={user?.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed
            </p>
          </div>

          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>

          {isSaved && (
            <p className="text-sm text-green-600">
              Profile updated successfully!
            </p>
          )}
        </form>
      </div>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-primary mr-2" />
            <h2 className="text-lg font-medium">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {passwordError && (
              <p className="text-sm text-red-600">{passwordError}</p>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Change Password"}
            </Button>

            {passwordSaved && (
              <p className="text-sm text-green-600">
                Password updated successfully!
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-medium mb-4">Notifications</h2>

        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-1 flex-1">
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications for task reminders, even when you're not
                using the app
              </p>

              <div className="mt-2">
                {renderNotificationButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
