import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function validate(values) {
  const errors = {};
  if (!values.username || values.username.trim().length < 3) errors.username = 'Username minimal 3 karakter';
  if (!values.password || values.password.length < 6) errors.password = 'Password minimal 6 karakter';
  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: '', password: '' });

  // if we already have a session, go straight to admin
  React.useEffect(() => {
    try {
      const t = sessionStorage.getItem('token');
      const u = sessionStorage.getItem('user');
      if (t && u) {
        navigate('/admin', { replace: true, state: { user: JSON.parse(u) } });
      }
    } catch {}
  }, [navigate]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length) return;
    setLoading(true);
    try {
      const res = await authService.login(values);
      if (res && res.data && res.data.username) {
        // success: save token & user to session storage
        try {
          sessionStorage.setItem('token', res.data.token || '');
          sessionStorage.setItem('user', JSON.stringify(res.data));
        } catch (e) {
          console.warn('failed to persist session', e);
        }
        navigate('/admin', { replace: true, state: { user: res.data } });
      } else {
        setPopup(res && res.message ? res.message : 'Login gagal');
      }
    } catch {
      setPopup('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <label className="block mb-2">
          <span className="text-sm">Username</span>
          <input
            name="username"
            value={values.username}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            disabled={loading}
          />
          {errors.username && <div className="text-sm text-red-600 mt-1">{errors.username}</div>}
        </label>

        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            disabled={loading}
          />
          {errors.password && <div className="text-sm text-red-600 mt-1">{errors.password}</div>}
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Sign in'}
        </button>

        {popup && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
            <div className="flex justify-between items-center">
              <div>{popup}</div>
              <button type="button" onClick={() => setPopup(null)} className="ml-4 text-sm underline">Close</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
