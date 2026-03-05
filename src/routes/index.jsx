/**
 * Routes Configuration
 * All application routes - DO NOT change URLs or behavior
 */

import { Navigate } from 'react-router-dom';
import authService from '../services/authService';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../modules/main/views/Login';
import AdminPanel from '../modules/admin/views/AdminPanel';
import AdminDashboard from '../modules/admin/views/AdminDashboard';
import AppsPage from '../modules/admin/views/AppsPage';
import ComponentsPage from '../modules/admin/views/ComponentsPage';
import UtilitiesPage from '../modules/admin/views/UtilitiesPage';
import GenericPage from '../modules/main/views/GenericPage';
import AdminFeaturePage from '../modules/admin/views/AdminFeaturePage';

/**
 * Protected Route Wrapper
 * Checks for valid token in sessionStorage
 */
function RequireAuth({ children }) {
  let token = null;
  try {
    token = sessionStorage.getItem('token');
  } catch (e) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.debug(e);
    }
  }

  // Check if token exists and is not expired
  if (!token || authService.isTokenExpired(token)) {
    // Clear session on expiration
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } catch {
      // Ignore errors
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Route definitions
 * All URLs must remain unchanged
 */
export const routes = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout>
          <AdminPanel />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/apps',
    element: (
      <RequireAuth>
        <AdminLayout>
          <AppsPage />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/components',
    element: (
      <RequireAuth>
        <AdminLayout>
          <ComponentsPage />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/utilities',
    element: (
      <RequireAuth>
        <AdminLayout>
          <UtilitiesPage />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  // Nested routes for mega menu items
  {
    path: '/features/:category/:item',
    element: (
      <RequireAuth>
        <AdminLayout>
          <AdminFeaturePage />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/ai-intelligence/:category/:item',
    element: (
      <RequireAuth>
        <AdminLayout>
          <AdminFeaturePage />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/data-analytics/:category/:item',
    element: (
      <RequireAuth>
        <AdminLayout>
          <AdminFeaturePage />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/education/:category/:item',
    element: (
      <RequireAuth>
        <AdminLayout>
          <AdminFeaturePage />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/helpdesk/:category/:item',
    element: (
      <RequireAuth>
        <AdminLayout>
          <AdminFeaturePage />
        </AdminLayout>
      </RequireAuth>
    ),
  },
  {
    path: '/page/:slug',
    element: <GenericPage />,
  },
];

export default routes;

