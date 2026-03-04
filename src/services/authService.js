import axios from 'axios';

const API_BASE = 'http://localhost:1992';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

// include token from sessionStorage in every request if present
client.interceptors.request.use((cfg) => {
  try {
    const tok = sessionStorage.getItem('token');
    if (tok) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${tok}`;
    }
  } catch {}
  return cfg;
});

export async function login({ username, password }) {
  try {
    const resp = await client.post('/employee_logins/login', { username, password });
    return resp.data;
  } catch (err) {
    if (err.response && err.response.data) return err.response.data;
    throw err;
  }
}

// send the token to server logout endpoint and return response
export async function register({ nik, full_name, username, password }) {
  try {
    const resp = await client.post('/employee_logins/register', { nik, full_name, username, password });
    return resp.data;
  } catch (err) {
    if (err.response && err.response.data) return err.response.data;
    throw err;
  }
}

// send the token to server logout endpoint and return response
export async function logout(token) {
  try {
    // use a fresh client since token may not be in headers
    const resp = await client.post('/employee_logins/logout', { token });
    return resp.data;
  } catch (err) {
    if (err.response && err.response.data) return err.response.data;
    throw err;
  }
}

// Decode JWT token to check expiration (client-side validation)
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

// Get stored token and user data
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

export default { login, register, logout, isTokenExpired, getAuthData };
