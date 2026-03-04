import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const navigate = useNavigate();
  const ref = useRef();
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => setTab(initialTab), [initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useOnClickOutside(ref, () => {
    if (isOpen) onClose();
  });

  // Login state
  const [login, setLogin] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  // Register state
  const [reg, setReg] = useState({ nik: '', full_name: '', username: '', password: '', confirm: '' });
  const [regErrors, setRegErrors] = useState({});

  function validateLogin() {
    const e = {};
    if (!login.username) e.username = 'Username diperlukan';
    if (!login.password) e.password = 'Password diperlukan';
    setLoginErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateRegister() {
    const e = {};
    if (!reg.nik) e.nik = 'NIK diperlukan';
    if (!reg.full_name) e.full_name = 'Nama diperlukan';
    if (!reg.username) e.username = 'Username diperlukan';
    if (!reg.password) e.password = 'Password diperlukan';
    if (reg.password !== reg.confirm) e.confirm = 'Password tidak cocok';
    setRegErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleLogin = async (ev) => {
    ev.preventDefault();
    if (!validateLogin()) return;
    
    setLoading(true);
    try {
      const res = await authService.login({ username: login.username, password: login.password });
      
      if (res && res.data && res.data.token) {
        // Save token and user to sessionStorage
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data));
        
        setNotification({ type: 'success', message: 'Login berhasil!' });
        setTimeout(() => {
          onClose();
          navigate('/dashboard', { replace: true });
        }, 500);
      } else {
        setNotification({ type: 'error', message: res?.message || 'Login gagal' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Terjadi kesalahan: ' + (err.message || 'Coba lagi') });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (ev) => {
    ev.preventDefault();
    if (!validateRegister()) return;
    
    setLoading(true);
    try {
      const res = await authService.register({
        nik: reg.nik,
        full_name: reg.full_name,
        username: reg.username,
        password: reg.password,
      });
      
      if (res && res.data && res.data.id) {
        // Registration successful, show success and switch to login
        setNotification({ type: 'success', message: 'Registrasi berhasil! Silakan login.' });
        
        setTimeout(() => {
          setNotification(null);
          setReg({ nik: '', full_name: '', username: '', password: '', confirm: '' });
          setTab('login');
          setLogin({ username: reg.username, password: '' });
        }, 1000);
      } else {
        setNotification({ type: 'error', message: res?.message || 'Registrasi gagal' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Terjadi kesalahan: ' + (err.message || 'Coba lagi') });
    } finally {
      setLoading(false);
    }
  };

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
                <button onClick={() => { setTab('login'); setNotification(null); }} className={`px-3 py-1 ${tab === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}>Login</button>
                <button onClick={() => { setTab('register'); setNotification(null); }} className={`px-3 py-1 ${tab === 'register' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}>Register</button>
              </div>

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-sm text-gray-600">Username</span>
                    <input value={login.username} onChange={(e) => setLogin((s) => ({ ...s, username: e.target.value }))} disabled={loading} className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50" />
                    {loginErrors.username && <div className="text-sm text-red-600">{loginErrors.username}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Password</span>
                    <input type="password" value={login.password} onChange={(e) => setLogin((s) => ({ ...s, password: e.target.value }))} disabled={loading} className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50" />
                    {loginErrors.password && <div className="text-sm text-red-600">{loginErrors.password}</div>}
                  </label>

                  <button type="submit" disabled={loading} className="w-full mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl disabled:opacity-50">
                    {loading ? 'Loading...' : 'Login'}
                  </button>

                  <div className="text-sm text-center mt-2">
                    Belum punya akun? <button type="button" onClick={() => { setTab('register'); setNotification(null); }} className="text-indigo-600 underline">Register</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-sm text-gray-600">NIK</span>
                    <input value={reg.nik} onChange={(e) => setReg((s) => ({ ...s, nik: e.target.value }))} disabled={loading} className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50" />
                    {regErrors.nik && <div className="text-sm text-red-600">{regErrors.nik}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Full Name</span>
                    <input value={reg.full_name} onChange={(e) => setReg((s) => ({ ...s, full_name: e.target.value }))} disabled={loading} className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50" />
                    {regErrors.full_name && <div className="text-sm text-red-600">{regErrors.full_name}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Username</span>
                    <input value={reg.username} onChange={(e) => setReg((s) => ({ ...s, username: e.target.value }))} disabled={loading} className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50" />
                    {regErrors.username && <div className="text-sm text-red-600">{regErrors.username}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Password</span>
                    <input type="password" value={reg.password} onChange={(e) => setReg((s) => ({ ...s, password: e.target.value }))} disabled={loading} className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50" />
                    {regErrors.password && <div className="text-sm text-red-600">{regErrors.password}</div>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Confirm Password</span>
                    <input type="password" value={reg.confirm} onChange={(e) => setReg((s) => ({ ...s, confirm: e.target.value }))} disabled={loading} className="mt-1 block w-full border rounded px-3 py-2 disabled:opacity-50" />
                    {regErrors.confirm && <div className="text-sm text-red-600">{regErrors.confirm}</div>}
                  </label>

                  <button type="submit" disabled={loading} className="w-full mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl disabled:opacity-50">
                    {loading ? 'Loading...' : 'Register'}
                  </button>

                  <div className="text-sm text-center mt-2">
                    Sudah punya akun? <button type="button" onClick={() => { setTab('login'); setNotification(null); }} className="text-indigo-600 underline">Login</button>
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
