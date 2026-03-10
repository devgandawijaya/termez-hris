import React from 'react';
import useLoginViewModel from '../viewmodels/useLoginViewModel';
import Navbar from '../../../shared/components/Navbar';
import Hero from '../../../shared/components/Hero';
import Features from '../../../shared/components/Features';
import Footer from '../../../shared/components/Footer';
import AuthModal from '../../../shared/components/AuthModal';
import ProfileSection from '../../../shared/components/ProfileSection';
import AboutSection from '../../../shared/components/AboutSection';
import ContactSection from '../../../shared/components/ContactSection';

export default function Login() {
  const { modalOpen, modalTab, openAuth, closeAuth } = useLoginViewModel();

  return (
    <div className="min-h-screen">
      <Navbar onOpenAuth={openAuth} />

      <main className="pt-24">
        <Hero onOpenAuth={openAuth} />
        <Features />
        <ProfileSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <AuthModal isOpen={modalOpen} onClose={closeAuth} initialTab={modalTab} />
    </div>
  );
}

