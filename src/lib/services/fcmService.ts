import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../../firebase";
import { useAuthStore } from "../store/authStore";

export const FCMService = {
  async requestPermissionAndGetToken(): Promise<string> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission not granted");
      }

      const registration = await navigator.serviceWorker.ready;

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        throw new Error("Failed to get FCM token");
      }

      if (useAuthStore.getState().isAuthenticated) {
        await useAuthStore.getState().updateFCMToken(token);
      }

      return token;
    } catch (error) {
      console.error("Error requesting permission or getting token:", error);
      throw error;
    }
  },

  setupMessageListener(callback: (payload: any) => void): void {
    try {
      onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);
        callback(payload);
      });
    } catch (error) {
      console.error("Error setting up message listener:", error);
    }
  },

  isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator;
  },
};
