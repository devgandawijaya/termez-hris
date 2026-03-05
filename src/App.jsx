import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';
import Login from './views/Login';
import AdminPanel from './views/AdminPanel';
import AdminDashboard from './views/AdminDashboard';
import AppsPage from './views/AppsPage';
import ComponentsPage from './views/ComponentsPage';
import UtilitiesPage from './views/UtilitiesPage';
import GenericPage from './views/GenericPage';
import AdminFeaturePage from './views/AdminFeaturePage';
import AdminLayout from './components/AdminLayout';
import './App.css';

// wrapper that checks for an existing token in sessionStorage and validates expiration
function RequireAuth({ children }) {
  let token = null;
  try {
    token = sessionStorage.getItem('token');
  } catch (e) {
    // ignore errors reading sessionStorage (e.g., disabled storage)
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.debug(e);
  }
  
  // Check if token exists and is not expired
  if (!token || authService.isTokenExpired(token)) {
    // Clear session on expiration
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } catch {}
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout>
                <AdminPanel />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/apps"
          element={
            <RequireAuth>
              <AdminLayout>
                <AppsPage />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/components"
          element={
            <RequireAuth>
              <AdminLayout>
                <ComponentsPage />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/utilities"
          element={
            <RequireAuth>
              <AdminLayout>
                <UtilitiesPage />
              </AdminLayout>
            </RequireAuth>
          }
        />
        {/* Nested routes for mega menu items */}
        <Route
          path="/features/:category/:item"
          element={
            <RequireAuth>
              <AdminLayout>
                <AdminFeaturePage />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/ai-intelligence/:category/:item"
          element={
            <RequireAuth>
              <AdminLayout>
                <AdminFeaturePage />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/data-analytics/:category/:item"
          element={
            <RequireAuth>
              <AdminLayout>
                <AdminFeaturePage />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/education/:category/:item"
          element={
            <RequireAuth>
              <AdminLayout>
                <AdminFeaturePage />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/helpdesk/:category/:item"
          element={
            <RequireAuth>
              <AdminLayout>
                <AdminFeaturePage />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route path="/page/:slug" element={<GenericPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
