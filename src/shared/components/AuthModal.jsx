import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthModalViewModel from '../hooks/useAuthModalViewModel';
import useOnClickOutside from '../hooks/useOnClickOutside';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const ref = useRef();

  const {
    tab,
    loading,
    notification,
    login,
    loginErrors,
    reg,
    regErrors,
    setLogin,
    setReg,
    handleTabChange,
    handleLogin,
    handleRegister,
  } = useAuthModalViewModel({ onClose });

  // Set initial tab from props
  useEffect(() => {
    if (initialTab) {
      handleTabChange(initialTab);
    }
  }, [initialTab, handleTabChange]);

  // Handle click outside to close
  useOnClickOutside(ref, () => {
    if (isOpen && onClose) {
      onClose();
    }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-40 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{tab === 'login' ? 'Login' : 'Register'}</div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-lg ${
                  notification.type === 'error'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-green-100 text-green-700 border border-green-300'
                }`}
              >
                {notification.message}
              </motion.div>
            )}

            <div className="mt-4">
              <div className="flex gap-2 border-b pb-2">
                <button
                  onClick={() => handleTabChange('login')}
                  className={`px-3 py-1 ${tab === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleTabChange('register')}
                  className={`px-3 py-1 ${tab === 'register' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
                >
                  Register
                </button>
              </div>

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-sm text-gray-600">Username</span>
                    <input
                      value={login.username}
                      onChange={(e) => setLogin('username')(e.target.value)}
                      disabled={loading}
                      className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50"
                    />
                    {loginErrors.username && <div className="text-sm text-red-600">{loginErrors.username}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Password</span>
                    <input
                      type="password"
                      value={login.password}
                      onChange={(e) => setLogin('password')(e.target.value)}
                      disabled={loading}
                      className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50"
                    />
                    {loginErrors.password && <div className="text-sm text-red-600">{loginErrors.password}</div>}
                  </label>

                  <button type="submit" disabled={loading} className="w-full mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl disabled:opacity-50">
                    {loading ? 'Loading...' : 'Login'}
                  </button>

                  <div className="text-sm text-center mt-2">
                    Belum punya akun? <button type="button" onClick={() => handleTabChange('register')} className="text-indigo-600 underline">Register</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-sm text-gray-600">NIK</span>
                    <input
                      value={reg.nik}
                      onChange={(e) => setReg('nik')(e.target.value)}
                      disabled={loading}
                      className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50"
                    />
                    {regErrors.nik && <div className="text-sm text-red-600">{regErrors.nik}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Full Name</span>
                    <input
                      value={reg.full_name}
                      onChange={(e) => setReg('full_name')(e.target.value)}
                      disabled={loading}
                      className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50"
                    />
                    {regErrors.full_name && <div className="text-sm text-red-600">{regErrors.full_name}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Username</span>
                    <input
                      value={reg.username}
                      onChange={(e) => setReg('username')(e.target.value)}
                      disabled={loading}
                      className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50"
                    />
                    {regErrors.username && <div className="text-sm text-red-600">{regErrors.username}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Password</span>
                    <input
                      type="password"
                      value={reg.password}
                      onChange={(e) => setReg('password')(e.target.value)}
                      disabled={loading}
                      className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50"
                    />
                    {regErrors.password && <div className="text-sm text-red-600">{regErrors.password}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Confirm Password</span>
                    <input
                      type="password"
                      value={reg.confirm}
                      onChange={(e) => setReg('confirm')(e.target.value)}
                      disabled={loading}
                      className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50"
                    />
                    {regErrors.confirm && <div className="text-sm text-red-600">{regErrors.confirm}</div>}
                  </label>

                  <button type="submit" disabled={loading} className="w-full mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl disabled:opacity-50">
                    {loading ? 'Loading...' : 'Register'}
                  </button>

                  <div className="text-sm text-center mt-2">
                    Sudah punya akun? <button type="button" onClick={() => handleTabChange('login')} className="text-indigo-600 underline">Login</button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

