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
    <section id="home" className="min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
        <motion.div className="md:w-1/2 z-10" initial="hidden" animate="show" variants={container}>
          <motion.h1 variants={item} className="text-4xl md:text-6xl font-extrabold leading-tight">Landing Page</motion.h1>
          <motion.h3 variants={item} className="mt-3 text-xl text-gray-600">Creative Design</motion.h3>
          <motion.p variants={item} className="mt-6 text-gray-600 max-w-xl">Kami membangun antarmuka yang elegan dan responsif dengan pengalaman pengguna yang halus. Contoh landing modern ini menggunakan animasi lembut dan ruang putih untuk fokus pada konten.</motion.p>

          <motion.div variants={item} className="mt-8 flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onOpenAuth('register')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl transition duration-300">Sign Up</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onOpenAuth('login')} className="px-6 py-3 rounded-xl bg-white text-gray-800 shadow-xl border border-gray-200 transition duration-300">Login</motion.button>
          </motion.div>
        </motion.div>

        <div className="md:w-1/2 w-full flex justify-center md:justify-end">
          <div className="w-80 h-80 md:w-[420px] md:h-[420px] rounded-3xl shadow-2xl bg-gradient-to-br from-blue-200 to-indigo-100 relative overflow-hidden">
            <svg viewBox="0 0 600 600" className="absolute -left-20 -top-28 opacity-80" width="700" height="700" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(300,300)">
                <path d="M120,-152C156,-119,187,-81,202,-37C217,8,216,58,193,95C170,131,125,154,80,171C35,189,-10,201,-54,191C-98,181,-141,150,-172,110C-202,70,-221,21,-211,-24C-200,-69,-160,-107,-120,-142C-81,-178,-40,-209,1,-210C43,-211,86,-182,120,-152Z" fill="#93c5fd" />
                <path d="M204,-163C246,-126,273,-72,276,-19C279,34,258,84,225,119C191,153,144,173,96,185C48,198,0,203,-50,195C-100,186,-152,164,-192,129C-233,95,-262,48,-271,0C-281,-47,-270,-94,-241,-128C-212,-161,-165,-181,-118,-201C-72,-221,-36,-241,2,-240C41,-239,81,-218,124,-191C166,-163,209,-200,204,-163Z" fill="#c7ddff" opacity="0.9" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
