import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { icon: '📊', title: 'Core HR', description: 'Complete data management and HR administration system' },
  { icon: '⏱️', title: 'Attendance & Time', description: 'Automated tracking and time management tools' },
  { icon: '💰', title: 'Payroll System', description: 'Integrated payroll and compensation management' },
  { icon: '🎯', title: 'Performance Mgmt', description: 'Track and evaluate employee performance metrics' },
  { icon: '👥', title: 'Recruitment', description: 'Smart talent acquisition and management' },
  { icon: '📚', title: 'Learning & Dev', description: 'Comprehensive LMS for employee development' },
  { icon: '💬', title: 'Engagement', description: 'Foster employee engagement and culture' },
  { icon: '⚖️', title: 'Compliance', description: 'Regulatory compliance and governance tools' },
  { icon: '🤖', title: 'AI Features', description: 'Advanced AI-powered insights and automation' },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// top companies for the cooperation carousel (with icons)
const companies = [
  { name: 'Apple', icon: '🍎' },
  { name: 'Google', icon: '🔍' },
  { name: 'Microsoft', icon: '🪟' },
  { name: 'Amazon', icon: '📦' },
  { name: 'Meta', icon: '📘' },
  { name: 'Tesla', icon: '🚗' },
  { name: 'Samsung', icon: '📱' },
  { name: 'IBM', icon: '💾' },
  { name: 'Intel', icon: '🧠' },
  { name: 'Oracle', icon: '🛡️' },
];

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

export default function Features() {
  return (
    <>
      {/* cooperation customers carousel */}
      <section className="py-12 bg-gray-100">
        <h3 className="text-center text-lg font-semibold mb-6">Our Trusted Partners</h3>
        <div className="overflow-x-auto">
          <div className="flex space-x-10 py-4">
            {companies.map((c, index) => (
              <div key={index} className="flex items-center justify-center w-48 h-20 bg-white rounded-lg shadow p-2 space-x-2">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-sm font-medium text-gray-700">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white via-cyan-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to manage your HR operations efficiently and effectively</p>
        </motion.div>

        <motion.div 
          className="grid gap-6 md:grid-cols-3" 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true }} 
          variants={containerVariants}
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.title} 
              variants={cardVariants}
              className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200 cursor-pointer"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              <div className="mt-4 h-1 w-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full group-hover:w-full transition-all duration-300"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
    </>
  );
}

