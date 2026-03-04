import React from 'react';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { x: -50, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const imageVariant = {
  hidden: { scale: 0.9, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.8, delay: 0.3 } },
};

export default function Hero({ onOpenAuth }) {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden">
      {/* Wave Background */}
      <div className="absolute inset-0 -z-10">
        <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,300 Q360,200 720,300 T1440,300 L1440,0 L0,0 Z" fill="url(#grad1)" opacity="0.15" />
          <path d="M0,400 Q360,300 720,400 T1440,400 L1440,800 L0,800 Z" fill="url(#grad2)" opacity="0.1" />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#0ea5e9', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#06b6d4', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#0284c7', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#0ea5e9', stopOpacity: 1}} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="show" variants={container}>
            <motion.div variants={item} className="inline-block mb-4">
              <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold">🚀 Smart HR Solution</span>
            </motion.div>
            
            <motion.h1 variants={item} className="text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight text-gray-900">
              Termez <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">HRMS</span>
            </motion.h1>
            
            <motion.p variants={item} className="mt-4 text-lg text-gray-700 font-medium">Smart Human Resource Management System</motion.p>
            
            <motion.p variants={item} className="mt-6 text-gray-600 text-base leading-relaxed max-w-xl">
              Termez HRMS is a technology-driven and AI-powered Human Resource Management System designed to help companies manage their workforce intelligently, efficiently, and automatically through data-driven insights.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => onOpenAuth('register')} 
                className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition duration-300 text-base"
              >
                Get Started
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => onOpenAuth('login')} 
                className="px-8 py-3.5 rounded-lg bg-white text-blue-600 font-semibold border-2 border-blue-600 hover:bg-blue-50 transition duration-300 text-base"
              >
                Login
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div className="flex justify-center" initial="hidden" animate="show" variants={imageVariant}>
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-3xl blur-2xl opacity-40"></div>
              <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50 backdrop-blur-sm">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop" alt="HRMS AI illustration" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
