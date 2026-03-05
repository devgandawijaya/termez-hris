/**
 * Admin Panel ViewModel - Business logic for admin panel page
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../../services/authService';

/**
 * Admin Panel ViewModel Hook
 * @returns {Object} Admin panel state and handlers
 */
export function useAdminPanelViewModel() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial user from location state or sessionStorage
  const getInitialUser = useCallback(() => {
    let userData = location.state?.user;

    if (!userData) {
      const stored = sessionStorage.getItem('user');
      if (stored) {
        try {
          userData = JSON.parse(stored);
        } catch {
          userData = null;
        }
      }
    }

    return userData;
  }, [location.state]);

  const user = getInitialUser();

  // Handle logout
  const handleLogout = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    try {
      await authService.logout(token);
    } catch (e) {
      console.warn('logout request failed', e);
    }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/', { replace: true });
  }, [navigate]);

  // Redirect to login if no user
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Memoize user display name
  const displayName = useMemo(() => {
    return user?.employee?.full_name || user?.username || 'User';
  }, [user]);

  return {
    user,
    displayName,
    handleLogout,
  };
}

export default useAdminPanelViewModel;

