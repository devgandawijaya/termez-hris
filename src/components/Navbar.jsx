import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar({ onOpenAuth }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 md:px-12 py-4 bg-transparent fixed top-0 z-30"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-lg font-semibold tracking-wide">NAME COMPANY</div>

        <div className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-gray-700 hover:text-gray-900">Home</a>
          <a href="#profile" className="text-gray-700 hover:text-gray-900">Profile</a>
          <a href="#about" className="text-gray-700 hover:text-gray-900">About Us</a>
          <a href="#contacts" className="text-gray-700 hover:text-gray-900">Contacts</a>
          <button
            onClick={() => onOpenAuth('register')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl transition duration-300"
          >
            Sign Up
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label="menu"
            className="p-2 rounded-md bg-white/60 backdrop-blur text-gray-800 shadow"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="md:hidden mt-4 bg-white/80 backdrop-blur-sm shadow-xl rounded-xl p-4 mx-4"
        >
          <div className="flex flex-col space-y-3">
            <a href="#home" onClick={() => setOpen(false)} className="block">Home</a>
            <a href="#profile" onClick={() => setOpen(false)} className="block">Profile</a>
            <a href="#about" onClick={() => setOpen(false)} className="block">About Us</a>
            <a href="#contacts" onClick={() => setOpen(false)} className="block">Contacts</a>
            <button onClick={() => { setOpen(false); onOpenAuth('register'); }} className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl">Sign Up</button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
