import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import AdminPanel from './views/AdminPanel';
import './App.css';

// wrapper that checks for an existing token in sessionStorage
function RequireAuth({ children }) {
  let token = null;
  try {
    token = sessionStorage.getItem('token');
  } catch {}
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminPanel />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
