import React from 'react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-r from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-extrabold mb-4">About Us</h2>
        <p className="text-gray-600 leading-relaxed">
          Founded in 2015 in Bandung, West Java, we are a technology-driven company specializing in the development of innovative Human Resource Management Systems (HRMS).

Our mission is to help companies and organizations manage their workforce more effectively through smart, reliable, and scalable solutions. We continuously evolve our products by integrating the latest technologies, including Artificial Intelligence (AI), while ensuring compliance with regulatory requirements across different regions and industries.

With a strong commitment to innovation and excellence, we empower businesses to streamline HR processes, enhance operational efficiency, and make data-driven strategic decisions.
        </p>
      </div>
    </section>
  );
}