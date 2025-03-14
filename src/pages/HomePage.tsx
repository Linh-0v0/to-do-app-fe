import { useState } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "../../firebase";

const HomePage = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission not granted");
      }

      // Wait for the service worker to be ready
      const registration = await navigator.serviceWorker.ready;
      const token = await getToken(messaging, {
        vapidKey: "BKjIIC5Ago5vUXzlJ4Chp7L8aZTm8191kwlFkHx7tQ933cxqQAr4T1aKzeQJMzs5XNp5nktzH6cP4Va5hn2YFI4",
        serviceWorkerRegistration: registration, // 🛠 Attach service worker
      });

      console.log("✅ FCM Token:", token);
      setFcmToken(token);
    } catch (err) {
      console.error("❌ Error fetching FCM token:", err);
      setError((err as Error).message);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={requestPermission}>Enable Notifications</button>
      {fcmToken && <p>FCM Token: {fcmToken}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default HomePage;
