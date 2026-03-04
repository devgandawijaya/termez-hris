import React from 'react';
import AdminNavbar from '../components/AdminNavbar';

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Components</h1>
          <p className="text-sm text-gray-500">Reusable UI components library.</p>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Buttons', desc: 'Primary, secondary, and utility buttons' },
            { name: 'Cards', desc: 'Container components with various styles' },
            { name: 'Forms', desc: 'Input fields, selects, and form layouts' },
            { name: 'Navigation', desc: 'Navbar, sidebar, and breadcrumb components' },
            { name: 'Modals', desc: 'Dialog and modal window components' },
            { name: 'Tables', desc: 'Data table and grid components' },
          ].map((comp, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{comp.name}</h3>
                <p className="text-sm text-gray-600">{comp.desc}</p>
              </div>
              <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">View</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
