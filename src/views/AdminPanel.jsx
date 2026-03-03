import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function AdminPanel() {
  const loc = useLocation();
  const navigate = useNavigate();
  // try to get user from navigation state or sessionStorage
  let user = loc.state?.user;
  if (!user) {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        user = JSON.parse(stored);
      } catch {}
    }
  }

  // guard via effect to avoid navigation during render
  React.useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div>
            <span className="text-sm text-gray-600 mr-3">{user.username}</span>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={async () => {
                // perform logout call and clear session
                const token = sessionStorage.getItem('token');
                try {
                  await authService.logout(token);
                } catch (e) {
                  console.warn('logout request failed', e);
                }
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                navigate('/', { replace: true });
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <section>
          <h2 className="font-semibold">Welcome, {user.employee?.full_name || user.username}</h2>
          <p className="text-sm text-gray-600">Employee ID: {user.employee_id}</p>
        </section>
      </div>
    </div>
  );
}
