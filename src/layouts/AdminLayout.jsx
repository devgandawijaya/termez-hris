/**
 * Admin Layout Component
 * Layout wrapper for all admin pages
 */

import React from 'react';
import AdminNavbar from '../modules/admin/components/AdminNavbar';
import Footer from '../shared/components/Footer';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

