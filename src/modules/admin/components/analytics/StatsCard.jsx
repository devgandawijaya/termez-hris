import React from 'react';
import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/chartUtils';

export default function StatsCard({ title, value, icon }) {
  return (
    <motion.div
      className="bg-white p-4 rounded shadow flex items-center space-x-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {icon && <div className="text-3xl">{icon}</div>}
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <motion.div
          className="text-2xl font-bold"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {formatNumber(value)}
        </motion.div>
      </div>
    </motion.div>
  );
}
