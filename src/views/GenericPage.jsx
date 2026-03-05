import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function GenericPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/page\//, '');
  const title = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  return (
    <div className="min-h-screen">
      <Navbar onOpenAuth={() => {}} />
      <main className="pt-24 pb-12 px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600">Content for <strong>{title}</strong> will be added here.</p>
      </main>
      <Footer />
    </div>
  );
}
