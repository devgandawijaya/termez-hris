/**
 * Auth ViewModel - Business logic for authentication
 * Handles login, register, logout, and token validation
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * Auth ViewModel Hook
 * @param {Function} onSuccess - Callback on successful auth
 * @param {Function} onError - Callback on auth error
 * @returns {Object} Auth state and handlers
 */
export function useAuthViewModel({ onSuccess, onError } = {}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Login handler
  const handleLogin = useCallback(async ({ username, password }) => {
    setLoading(true);
    setNotification(null);

    try {
      const res = await authService.login({ username, password });

      if (res && res.data && res.data.token) {
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('user', JSON.stringify(res.data));

        setNotification({ type: 'success', message: 'Login berhasil!' });

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/dashboard', { replace: true });
          }
        }, 500);
      } else {
        const message = res?.message || 'Login gagal';
        setNotification({ type: 'error', message });
        if (onError) onError(message);
      }
    } catch (err) {
      const message = 'Terjadi kesalahan: ' + (err.message || 'Coba lagi');
      setNotification({ type: 'error', message });
      if (onError) onError(message);
    } finally {
      setLoading(false);
    }
  }, [navigate, onSuccess, onError]);

  // Register handler
  const handleRegister = useCallback(async ({ nik, full_name, username, password }) => {
    setLoading(true);
    setNotification(null);

    try {
      const res = await authService.register({ nik, full_name, username, password });

      if (res && res.data && res.data.id) {
        setNotification({ type: 'success', message: 'Registrasi berhasil! Silakan login.' });

        setTimeout(() => {
          setNotification(null);
          setLoginCredentials({ username, password: '' });
          setRegisterCredentials({ nik: '', full_name: '', username: '', password: '', confirm: '' });
        }, 1000);

        return true;
      } else {
        const message = res?.message || 'Registrasi gagal';
        setNotification({ type: 'error', message });
        if (onError) onError(message);
      }
    } catch (err) {
      const message = 'Terjadi kesalahan: ' + (err.message || 'Coba lagi');
      setNotification({ type: 'error', message });
      if (onError) onError(message);
    } finally {
      setLoading(false);
    }
    return false;
  }, [onError]);

  // Check if user is already logged in
  const checkAuthStatus = useCallback(() => {
    try {
      const token = sessionStorage.getItem('token');
      if (token && !authService.isTokenExpired(token)) {
        return true;
      }
    } catch (e) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.debug(e);
      }
    }
    return false;
  }, []);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      await authService.logout(token);
    } catch (e) {
      console.warn('logout request failed', e);
    }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, onSuccess]);

  // Form states
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [registerCredentials, setRegisterCredentials] = useState({
    nik: '',
    full_name: '',
    username: '',
    password: '',
    confirm: ''
  });

  // Validation
  const validateLogin = useCallback(() => {
    const errors = {};
    if (!loginCredentials.username) errors.username = 'Username diperlukan';
    if (!loginCredentials.password) errors.password = 'Password diperlukan';
    return { isValid: Object.keys(errors).length === 0, errors };
  }, [loginCredentials]);

  const validateRegister = useCallback(() => {
    const errors = {};
    if (!registerCredentials.nik) errors.nik = 'NIK diperlukan';
    if (!registerCredentials.full_name) errors.full_name = 'Nama diperlukan';
    if (!registerCredentials.username) errors.username = 'Username diperlukan';
    if (!registerCredentials.password) errors.password = 'Password diperlukan';
    if (registerCredentials.password !== registerCredentials.confirm) {
      errors.confirm = 'Password tidak cocok';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }, [registerCredentials]);

  // Submit handlers
  const submitLogin = useCallback((e) => {
    e.preventDefault();
    const { isValid } = validateLogin();
    if (isValid) {
      handleLogin(loginCredentials);
    }
  }, [loginCredentials, validateLogin, handleLogin]);

  const submitRegister = useCallback((e) => {
    e.preventDefault();
    const { isValid } = validateRegister();
    if (isValid) {
      handleRegister({
        nik: registerCredentials.nik,
        full_name: registerCredentials.full_name,
        username: registerCredentials.username,
        password: registerCredentials.password,
      });
    }
  }, [registerCredentials, validateRegister, handleRegister]);

  // Clear notification
  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    // State
    loading,
    notification,
    loginCredentials,
    registerCredentials,

    // Setters
    setLoginCredentials,
    setRegisterCredentials,

    // Validation
    validateLogin,
    validateRegister,

    // Submit handlers
    submitLogin,
    submitRegister,

    // Auth actions
    checkAuthStatus,
    handleLogout,
    clearNotification,
  };
}

export default useAuthViewModel;

