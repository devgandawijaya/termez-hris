import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';
import Login from './views/Login';
import AdminPanel from './views/AdminPanel';
import AdminDashboard from './views/AdminDashboard';
import AppsPage from './views/AppsPage';
import PagesPage from './views/PagesPage';
import ComponentsPage from './views/ComponentsPage';
import UtilitiesPage from './views/UtilitiesPage';
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
              <AdminPanel />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/apps"
          element={
            <RequireAuth>
              <AppsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/pages"
          element={
            <RequireAuth>
              <PagesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/components"
          element={
            <RequireAuth>
              <ComponentsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/utilities"
          element={
            <RequireAuth>
              <UtilitiesPage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
