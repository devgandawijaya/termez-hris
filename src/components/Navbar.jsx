import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar({ onOpenAuth }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 md:px-12 py-4 fixed top-0 z-40 backdrop-blur-md bg-white/70 border-b border-white/10 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-widest uppercase"
          whileHover={{ scale: 1.05 }}
        >
          termez
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          <motion.a href="#home" whileHover={{ color: '#0ea5e9' }} className="text-gray-700 font-medium transition hover:text-cyan-600">Home</motion.a>
          <motion.a href="#profile" whileHover={{ color: '#0ea5e9' }} className="text-gray-700 font-medium transition hover:text-cyan-600">Profile</motion.a>
          <motion.a href="#about" whileHover={{ color: '#0ea5e9' }} className="text-gray-700 font-medium transition hover:text-cyan-600">About Us</motion.a>
          <motion.a href="#contacts" whileHover={{ color: '#0ea5e9' }} className="text-gray-700 font-medium transition hover:text-cyan-600">Contacts</motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenAuth('register')}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl transition duration-300"
          >
            Sign Up
          </motion.button>
        </div>

        <div className="md:hidden">
          <motion.button
            onClick={() => setOpen((s) => !s)}
            aria-label="menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/80 backdrop-blur text-gray-800 shadow-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="md:hidden mt-4 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 mx-4 border border-white/20"
        >
          <div className="flex flex-col space-y-4">
            <a href="#home" onClick={() => setOpen(false)} className="block text-gray-700 font-medium hover:text-cyan-600 transition">Home</a>
            <a href="#profile" onClick={() => setOpen(false)} className="block text-gray-700 font-medium hover:text-cyan-600 transition">Profile</a>
            <a href="#about" onClick={() => setOpen(false)} className="block text-gray-700 font-medium hover:text-cyan-600 transition">About Us</a>
            <a href="#contacts" onClick={() => setOpen(false)} className="block text-gray-700 font-medium hover:text-cyan-600 transition">Contacts</a>
            <button onClick={() => { setOpen(false); onOpenAuth('register'); }} className="mt-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg">Sign Up</button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
