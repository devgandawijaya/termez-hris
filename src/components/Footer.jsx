import React from 'react';

export default function Footer() {
  return (
    <footer className="py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-gray-600">
        © {new Date().getFullYear()} TERMEZ — Built with care.
      </div>
    </footer>
  );
}
