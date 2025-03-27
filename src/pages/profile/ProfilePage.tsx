import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FCMService } from "@/lib/services/fcmService";
import { Bell, Save } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, updateFCMToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    username: user?.username || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleEnableNotifications = async () => {
    try {
      if (!FCMService.isSupported()) {
        console.error("Notifications are not supported in this browser");
        return;
      }

      const token = await FCMService.requestPermissionAndGetToken();
      await updateFCMToken(token);
    } catch (error) {
      console.error("Failed to enable notifications:", error);
    }
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
                {user?.fcmToken ? (
                  <p className="text-sm text-green-600">
                    ✓ Push notifications are enabled
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEnableNotifications}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Enable Push Notifications
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
