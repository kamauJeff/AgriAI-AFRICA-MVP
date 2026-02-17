import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Predict from './pages/ai/Predict';
import Layout from './components/layout/Layout';
import MarketPrices from './pages/market/MarketPrices';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'predict',
        element: (
          <ProtectedRoute>
            <Predict />
          </ProtectedRoute>
        ),
      },
      {
        path: 'market',
        element: (
          <ProtectedRoute>
            <MarketPrices />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);