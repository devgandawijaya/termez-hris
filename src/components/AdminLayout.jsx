import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

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