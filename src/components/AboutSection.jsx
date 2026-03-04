import React from 'react';
import { motion } from 'framer-motion';

const values = [
  { icon: '💡', title: 'Innovation', desc: 'Cutting-edge technology and AI-driven solutions' },
  { icon: '🎯', title: 'Excellence', desc: 'Committed to highest quality standards' },
  { icon: '🤝', title: 'Partnership', desc: 'Growing together with our clients' },
  { icon: '🔒', title: 'Reliability', desc: 'Trusted by hundreds of organizations' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 relative overflow-hidden">
      {/* Wave background */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,100 Q360,50 720,100 T1440,100 L1440,200 L0,200 Z" fill="rgba(255,255,255,0.1)" />
      </svg>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-white mb-4">Our Mission & Values</h2>
          <p className="text-blue-100 text-lg max-w-3xl mx-auto leading-relaxed">
            We're dedicated to helping companies and organizations manage their workforce more effectively through smart, reliable, and scalable HRMS solutions powered by AI and innovation.
          </p>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-4 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {values.map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-6 bg-white/10 backdrop-blur rounded-2xl border border-white/20 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
              <p className="text-blue-100 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}