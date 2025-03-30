import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../../firebase";
import { useAuthStore } from "../store/authStore";

export const FCMService = {
  async requestPermissionAndGetToken(): Promise<string> {
    if (!this.isSupported()) {
      throw new Error("Push notifications are not supported in this browser");
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission not granted");
      }

      const registration = await navigator.serviceWorker.ready;

      console.log("Requesting FCM token...");
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      console.log("FCM token received:", token ? "Token received" : "No token received");

      if (!token) {
        throw new Error("Failed to get FCM token");
      }

      // If user is authenticated, update the FCM token on the server
      if (useAuthStore.getState().isAuthenticated) {
        console.log("Updating FCM token on server...");
        await useAuthStore.getState().updateFCMToken(token);
        console.log("FCM token updated on server");
      }

      return token;
    } catch (error) {
      console.error("Error requesting permission or getting token:", error);
      throw error;
    }
  },

  setupMessageListener(callback: (payload: any) => void): void {
    if (!this.isSupported()) {
      console.warn("Push notifications are not supported in this browser");
      return;
    }

    try {
      console.log("Setting up message listener...");
      onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);
        callback(payload);
      });
    } catch (error) {
      console.error("Error setting up message listener:", error);
    }
  },

  checkPermission(): NotificationPermission | null {
    if (!("Notification" in window)) {
      return null;
    }
    return Notification.permission;
  },

  isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator;
  },

  getNotificationStatus(): { supported: boolean; permission: string | null } {
    const supported = this.isSupported();
    const permission = supported ? this.checkPermission() : null;

    return {
      supported,
      permission
    };
  }
};
