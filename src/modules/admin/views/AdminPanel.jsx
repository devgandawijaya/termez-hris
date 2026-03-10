import React from 'react';
import useAdminPanelViewModel from '../viewmodels/useAdminPanelViewModel';

export default function AdminPanel() {
  const { user, displayName, handleLogout } = useAdminPanelViewModel();

  if (!user) {
    return null;
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <div>
              <span className="text-sm text-gray-600 mr-3">{user.username}</span>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          <section>
            <h2 className="font-semibold">Welcome, {user.employee?.full_name || user.username}</h2>
            <p className="text-sm text-gray-600">Employee ID: {user.employee_id}</p>
            {displayName && <p className="text-sm text-gray-500 mt-2">Display Name: {displayName}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}

