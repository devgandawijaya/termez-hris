/**
 * Login ViewModel - Business logic for Login page
 * Handles authentication check and modal state
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';

/**
 * Login ViewModel Hook
 * @returns {Object} Login page state and handlers
 */
export function useLoginViewModel() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('login');

  // Check if user is already logged in with valid token
  useEffect(() => {
    try {
      const token = sessionStorage.getItem('token');
      if (token && !authService.isTokenExpired(token)) {
        // Token is valid, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (e) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.debug(e);
      }
    }
  }, [navigate]);

  // Open auth modal with specified tab
  const openAuth = useCallback((tab = 'login') => {
    setModalTab(tab);
    setModalOpen(true);
  }, []);

  // Close auth modal
  const closeAuth = useCallback(() => {
    setModalOpen(false);
  }, []);

  return {
    // State
    modalOpen,
    modalTab,

    // Handlers
    openAuth,
    closeAuth,
  };
}

export default useLoginViewModel;

