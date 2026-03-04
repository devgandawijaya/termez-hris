import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('User');

  React.useEffect(() => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.employee?.full_name || user.username || 'User');
      }
    } catch (e) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.debug(e);
    }
  }, []);

  const handleLogout = async () => {
    const token = sessionStorage.getItem('token');
    try {
      await authService.logout(token);
    } catch (e) {
      console.warn('logout failed', e);
    }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Prevent browser back navigation by replacing history
    window.history.replaceState(null, '', '/');
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold text-indigo-600">Termez</div>
            <nav className="hidden md:flex space-x-4 text-sm text-gray-600">
              <a className="px-3 py-2 rounded hover:bg-gray-100" href="/dashboard">Dashboard</a>
              <a className="px-3 py-2 rounded hover:bg-gray-100" href="/apps">Apps</a>
              <a className="px-3 py-2 rounded hover:bg-gray-100" href="/pages">Pages</a>
              <a className="px-3 py-2 rounded hover:bg-gray-100" href="/components">Components</a>
              <a className="px-3 py-2 rounded hover:bg-gray-100" href="/utilities">Utilities</a>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l-4 4m0 0l4-4m-4 4V4" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6L17 13V9a5 5 0 10-10 0v4l-1.6 1.6a2 2 0 01-.595 1.395L3 17h5" />
              </svg>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              >
                <img src="https://api.dicebear.com/6.x/initials/svg?seed=JD" alt="avatar" className="h-8 w-8 rounded-full" />
                <div className="hidden sm:block text-sm">{userName}</div>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
