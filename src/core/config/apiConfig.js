/**
 * Centralized API Configuration
 * All API-related configurations should be defined here
 */

const API_BASE = 'http://localhost:1992';

const apiConfig = {
  baseURL: API_BASE,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default apiConfig;

