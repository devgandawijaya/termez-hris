import React from 'react';
import { motion } from 'framer-motion';

export default function CareerPathFlow({ path }) {
  if (!path || path.length === 0) return null;
  return (
    <motion.div
      className="p-4 bg-white rounded shadow flex flex-col items-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {path.map((pos, idx) => (
        <div key={idx} className="flex items-center">
          <span className="px-3 py-1 bg-blue-100 rounded">{pos}</span>
          {idx < path.length - 1 && (
            <svg
              className="w-6 h-6 mx-2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v14m7-7H5"
              />
            </svg>
          )}
        </div>
      ))}
    </motion.div>
  );
}
