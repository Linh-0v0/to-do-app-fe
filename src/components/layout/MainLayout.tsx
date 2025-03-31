import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { FCMService } from "@/lib/services/fcmService";
import { useEffect } from "react";

export const MainLayout: React.FC = () => {
  useEffect(() => {
    // Set up FCM message listener
    FCMService.setupMessageListener((payload) => {
      console.log("Received FCM message:", payload);

      // Display a notification for foreground messages
      if (Notification.permission === "granted" && payload.notification) {
        const { title, body } = payload.notification;

        // Create and show the notification
        const notification = new Notification(title || "Task Reminder", {
          body: body || "You have a task",
          icon: "/icons/logo.jpg",
          data: payload.data,
        });

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="grid grid-cols-1 min-h-[calc(100vh-64px)]">
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      {/* Footer */}
    </div>
  );
};
