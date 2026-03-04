import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

export default function Login() {
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
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.debug(e);
    }
  }, [navigate]);

  function openAuth(tab = 'login') {
    setModalTab(tab);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen">
      <Navbar onOpenAuth={openAuth} />

      <main className="pt-24">
        <Hero onOpenAuth={openAuth} />
        <Features />
      </main>

      <Footer />

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialTab={modalTab} />
    </div>
  );
}
