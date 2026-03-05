/**
 * HRIS Routes - Lazy loaded routes for Employee Database
 * Separate file to avoid fast refresh issues
 */

import { lazy } from 'react';

// Lazy load HRIS pages
const EmployeeDatabasePage = lazy(() => import('../modules/hris/views/EmployeeDatabasePage'));
const EmployeeDetailPage = lazy(() => import('../modules/hris/views/EmployeeDetailPage'));

export { EmployeeDatabasePage, EmployeeDetailPage };

