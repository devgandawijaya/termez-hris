import React from 'react';
import { motion } from 'framer-motion';

const contacts = [
  {
    icon: '📍',
    title: 'Address',
    value: 'Cibodas, Ciparay, Kabupaten Bandung',
    desc: 'West Java, Indonesia',
  },
  {
    icon: '✉️',
    title: 'Email',
    value: 'info@termez.com',
    desc: 'Send us an email anytime',
  },
  {
    icon: '📱',
    title: 'Phone',
    value: '+62 2-727-212',
    desc: 'Call us during business hours',
  },
];

export default function ContactSection() {
  return (
    <section id="contacts" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {contacts.map((contact, idx) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-cyan-200 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{contact.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.title}</h3>
              <p className="text-gray-900 font-semibold mb-1">{contact.value}</p>
              <p className="text-gray-600 text-sm">{contact.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-200 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your HR?</h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">Join hundreds of organizations already using Termez HRMS to streamline their HR operations.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition duration-300"
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}