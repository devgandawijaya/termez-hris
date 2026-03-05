/**
 * Auth Modal ViewModel - Business logic for authentication modal
 * Handles login/register forms, validation, and API calls
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Auth Modal ViewModel Hook
 * @param {Object} params
 * @param {Function} params.onClose - Callback when modal should close
 * @returns {Object} Auth modal state and handlers
 */
export function useAuthModalViewModel({ onClose } = {}) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Login form state
  const [login, setLogin] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  // Register form state
  const [reg, setReg] = useState({ nik: '', full_name: '', username: '', password: '', confirm: '' });
  const [regErrors, setRegErrors] = useState({});

  // Initialize tab from props (handled by parent)
  useEffect(() => {
    // Tab is set by parent component
  }, []);

  // Clear notification when tab changes
  const handleTabChange = useCallback((newTab) => {
    setTab(newTab);
    setNotification(null);
  }, []);

  // Login validation
  const validateLogin = useCallback(() => {
    const errors = {};
    if (!login.username) errors.username = 'Username diperlukan';
    if (!login.password) errors.password = 'Password diperlukan';
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  }, [login]);

  // Register validation
  const validateRegister = useCallback(() => {
    const errors = {};
    if (!reg.nik) errors.nik = 'NIK diperlukan';
    if (!reg.full_name) errors.full_name = 'Nama diperlukan';
    if (!reg.username) errors.username = 'Username diperlukan';
    if (!reg.password) errors.password = 'Password diperlukan';
    if (reg.password !== reg.confirm) errors.confirm = 'Password tidak cocok';
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  }, [reg]);

  // Handle login submit
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
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
          if (onClose) onClose();
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
  }, [login, validateLogin, navigate, onClose]);

  // Handle register submit
  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
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
  }, [reg, validateRegister]);

  // Handle close
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  return {
    // State
    tab,
    loading,
    notification,
    login,
    loginErrors,
    reg,
    regErrors,

    // Setters
    setLogin: (field) => (value) => setLogin((s) => ({ ...s, [field]: value })),
    setReg: (field) => (value) => setReg((s) => ({ ...s, [field]: value })),

    // Handlers
    handleTabChange,
    handleLogin,
    handleRegister,
    handleClose,
  };
}

export default useAuthModalViewModel;

