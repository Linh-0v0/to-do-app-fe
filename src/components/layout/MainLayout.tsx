import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { FCMService } from "@/lib/services/fcmService";

export const MainLayout: React.FC = () => {
  useEffect(() => {
    // Set up FCM message listener
    if (FCMService.isSupported()) {
      FCMService.setupMessageListener((payload) => {
        // Show a notification for foreground messages
        if (Notification.permission === "granted") {
          const { title, body } = payload.notification || {};

          if (!title) return;

          // Create a notification
          new Notification(title, {
            body,
            icon: "/logo192.png",
          });
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto py-6 px-4">
        <Outlet />
      </main>

      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Toodooloo App. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
