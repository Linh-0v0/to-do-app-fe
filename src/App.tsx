import React, { useEffect } from 'react';
import { useRoutes } from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';

const App: React.FC = () => {
  // routing logic
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/about', element: <AboutPage /> },
  ]);

  return routes;
};

export default App;
