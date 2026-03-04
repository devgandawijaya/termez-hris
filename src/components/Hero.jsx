import React from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { x: -40, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

export default function Hero({ onOpenAuth }) {
  return (
    <section id="home" className="py-16 flex items-center">
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 flex flex-col md:flex-row items-center gap-8">
        <motion.div className="md:w-1/2 z-10" initial="hidden" animate="show" variants={container}>
          <motion.h1 variants={item} className="text-3xl md:text-4xl font-extrabold leading-snug">Termez HRMS</motion.h1>
          <motion.h3 variants={item} className="mt-2 text-lg text-gray-700">Smart Termez Human Resource Management</motion.h3>
          <motion.p variants={item} className="mt-4 text-gray-600 text-sm md:text-base max-w-lg">Termez HRMS is a technology- and Artificial Intelligence (AI)-driven Human Resource Management System that enables companies to manage their workforce intelligently, efficiently, and automatically through data-driven insights to support strategic decision-making.</motion.p>

          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onOpenAuth('register')} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl transition duration-300 text-sm">Sign Up</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onOpenAuth('login')} className="px-5 py-2 rounded-xl bg-white text-gray-800 shadow border border-gray-200 transition duration-300 text-sm">Login</motion.button>
          </motion.div>
        </motion.div>

        <div className="md:w-1/2 w-full flex justify-center md:justify-end">
          <div className="w-56 h-56 md:w-80 md:h-80 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-200 to-indigo-100 relative overflow-hidden">
            <img src="https://source.unsplash.com/collection/9651609/500x500" alt="HRMS AI illustration" className="w-full h-full object-cover rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
