import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-gray-700 text-sm">
        © {new Date().getFullYear()} TERMEZ — Built with care.
      </div>
    </footer>
  );
}
