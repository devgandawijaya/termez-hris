/**
 * RequireAuth Component
 * Protected route wrapper that checks for valid token
 */

import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function RequireAuth({ children }) {
  let token = null;
  try {
    token = sessionStorage.getItem('token');
  } catch (e) {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      console.debug(e);
    }
  }

  // Check if token exists and is not expired
  if (!token || authService.isTokenExpired(token)) {
    // Clear session on expiration
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } catch {
      // Ignore errors
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

