importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCMT8LQOHAe5JFgT-Fvf5lWhskxmsVUjUE",
    authDomain: "to-do-a3e90.firebaseapp.com",
    projectId: "to-do-a3e90",
    storageBucket: "to-do-a3e90.firebasestorage.app",
    messagingSenderId: "445787119210",
    appId: "1:445787119210:web:f4a5343964aaabcf1c3413",
    measurementId: "G-D6PSWXNZN4"
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📢 Background Message received:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
