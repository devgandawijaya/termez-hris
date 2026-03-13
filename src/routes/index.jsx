/**
 * Routes Configuration
 * All application routes - DO NOT change URLs or behavior
 */

import { Suspense, lazy } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../modules/main/views/Login';
import AdminPanel from '../modules/admin/views/AdminPanel';
import AdminDashboard from '../modules/admin/views/AdminDashboard';
import AppsPage from '../modules/admin/views/AppsPage';
import ComponentsPage from '../modules/admin/views/ComponentsPage';
import UtilitiesPage from '../modules/admin/views/UtilitiesPage';
import GenericPage from '../modules/main/views/GenericPage';
import AdminFeaturePage from '../modules/admin/views/AdminFeaturePage';
import { EmployeeDatabasePage, EmployeeDetailPage, CreateEmployeePage } from './hrisRoutes';
import LoadingFallback from './loadingFallback';
import RequireAuth from './requireAuth';

// Lazy load digital employee file page
const DigitalEmployeeFileKontrakDokumenPage = lazy(() => 
  import('../modules/digital-employee-file/views/DigitalEmployeeFileKontrakDokumenPage')
);

// Lazy load organization structure page
const OrganizationStructurePage = lazy(() => 
  import('../modules/core-hr-data-administrasi/views/OrganizationStructurePage')
);

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
  // HRIS Routes
  {
    path: '/employees',
    element: (
      <RequireAuth>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <EmployeeDatabasePage />
          </Suspense>
        </AdminLayout>
      </RequireAuth>
    ),
  },
  // Nested route for HR menu item - Employee Database
  {
    path: '/employees/:id',
    element: (
      <RequireAuth>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <EmployeeDetailPage />
          </Suspense>
        </AdminLayout>
      </RequireAuth>
    ),
  },
  // Create Employee Route
  {
    path: '/employees/create',
    element: (
      <RequireAuth>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <CreateEmployeePage />
          </Suspense>
        </AdminLayout>
      </RequireAuth>
    ),
  },
// Nested route for HR menu item - Employee Database
  {
    path: '/features/core-hr-data-administrasi/employee-database-master-data-karyawan',
    element: (
      <RequireAuth>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <EmployeeDatabasePage />
          </Suspense>
        </AdminLayout>
      </RequireAuth>
    ),
  },
  // Nested route for Digital Employee File - Kontrak Dokumen
  {
    path: '/features/core-hr-data-administrasi/digital-employee-file-kontrak-dokumen',
    element: (
      <RequireAuth>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <DigitalEmployeeFileKontrakDokumenPage />
          </Suspense>
        </AdminLayout>
      </RequireAuth>
    ),
  },
  // Nested route for Organization Structure
  {
    path: '/features/core-hr-data-administrasi/organization-structure',
    element: (
      <RequireAuth>
        <AdminLayout>
          <Suspense fallback={<LoadingFallback />}>
            <OrganizationStructurePage />
          </Suspense>
        </AdminLayout>
      </RequireAuth>
    ),
  },
];

export default routes;

