import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const links = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'FAQ', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Termez HRMS</h3>
            <p className="text-sm text-gray-400">Smart Human Resource Management System powered by AI and innovation.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-cyan-400 transition">Features</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition">About</a></li>
              <li><a href="#contacts" className="hover:text-cyan-400 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Terms</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">© {currentYear} Termez HRMS. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {links.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ color: '#06b6d4' }}
                  className="text-sm text-gray-400 transition hover:text-cyan-400"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

