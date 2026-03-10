import axios from 'axios';
import apiConfig from '../core/config/apiConfig';

// Create axios instance with centralized config
const client = axios.create(apiConfig);

// Include token from sessionStorage in every request if present
client.interceptors.request.use((cfg) => {
  try {
    const tok = sessionStorage.getItem('token');
    if (tok) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${tok}`;
    }
  } catch {
    // Ignore errors reading sessionStorage
  }
  return cfg;
});

/**
 * Auth Service - API calls for authentication
 */

/**
 * Login user with username and password
 * @param {Object} credentials - { username, password }
 * @returns {Promise} API response
 */
export async function login({ username, password }) {
  try {
    const resp = await client.post('/employee_logins/login', { username, password });
    return resp.data;
  } catch (err) {
    if (err.response && err.response.data) return err.response.data;
    throw err;
  }
}

/**
 * Register new user
 * @param {Object} userData - { nik, full_name, username, password }
 * @returns {Promise} API response
 */
export async function register({ nik, full_name, username, password }) {
  try {
    const resp = await client.post('/employee_logins/register', { nik, full_name, username, password });
    return resp.data;
  } catch (err) {
    if (err.response && err.response.data) return err.response.data;
    throw err;
  }
}

/**
 * Logout user
 * @param {string} token - User token
 * @returns {Promise} API response
 */
export async function logout(token) {
  try {
    const resp = await client.post('/employee_logins/logout', { token });
    return resp.data;
  } catch (err) {
    if (err.response && err.response.data) return err.response.data;
    throw err;
  }
}

/**
 * Decode JWT token to check expiration (client-side validation)
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const decoded = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp <= now;
  } catch {
    return true;
  }
}

/**
 * Get stored token and user data from sessionStorage
 * @returns {Object} { token, user, isExpired }
 */
export function getAuthData() {
  try {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
      isExpired: isTokenExpired(token),
    };
  } catch {
    return { token: null, user: null, isExpired: true };
  }
}

export default {
  login,
  register,
  logout,
  isTokenExpired,
  getAuthData,
};

