import React from 'react';
import Navbar from '../components/Navbar';

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Apps</h1>
          <p className="text-sm text-gray-500">Manage your applications and integrations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg mb-3"></div>
              <h3 className="font-semibold">App {i + 1}</h3>
              <p className="text-sm text-gray-500 mt-1">Description of app {i + 1}</p>
              <button className="mt-4 px-3 py-1 text-sm bg-indigo-600 text-white rounded">Open</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
