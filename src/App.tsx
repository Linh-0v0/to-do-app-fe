import React, { useEffect } from 'react';
import { useRoutes } from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';

const App: React.FC = () => {
  // useEffect(() => {
  //   console.log('App component mounted');
  //   const fetchFcmToken = async () => {
  //     try {
  //       const token = await getToken(messaging, { vapidKey: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwODA2N2Q4M2YwY2Y5YzcxNjQyNjUwYzUyMWQ0ZWZhNWI2YTNlMDkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdG8tZG8tYTNlOTAiLCJhdWQiOiJ0by1kby1hM2U5MCIsImF1dGhfdGltZSI6MTc0MTkzMDExNCwidXNlcl9pZCI6IndibnZ6c21JVXBUd1FMNXY1UG5tOHo1Rk9FeDEiLCJzdWIiOiJ3Ym52enNtSVVwVHdRTDV2NVBubTh6NUZPRXgxIiwiaWF0IjoxNzQxOTMwMTE0LCJleHAiOjE3NDE5MzM3MTQsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdHVzZXJAZXhhbXBsZS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.TVxiWul19_1AVLyjU5Ou4oBHSQR32BZ-ySXY1bS195tpTmC03O7apoMeo6bYYyHJJYKnBz_SOdKmkmHt7-PWUeYTv4BF6-c66bMU-VViTFEww2zj1Z7D8f64fAFE5xyhD4BTIw0Iphfamn2T1r4hZ3r9U8n_u3RFJnbK-zLqLCSrLqo_G0RQkiOxnlTG65RlKQSKzVRo7YTFcnBeGeKyhKaIgNSkW14-KdyfQvP2afyZwGVweRmbSh-XtjTufkU7UsdbfcV01xfVLKj9CnGo0g2g6ahtGQUc8IMrRb6gdgDgR9cwn_tSl44tn1Dh2JINfFjFAdYJ5u9vVuuJxEQIYQ' });
  //       console.log('FCM Token:', token);
  //     } catch (error) {
  //       console.error('Error fetching FCM token:', error);
  //     }
  //   };

  //   fetchFcmToken();
  // }, []);

  // routing logic
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/about', element: <AboutPage /> },
  ]);

  return routes;
};

export default App;
