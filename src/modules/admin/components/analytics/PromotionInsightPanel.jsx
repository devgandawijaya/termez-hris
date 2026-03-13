import React from 'react';
import { motion } from 'framer-motion';

export default function PromotionInsightPanel({ insights }) {
  if (!insights || insights.length === 0) {
    return <div className="p-4 bg-white rounded shadow">No promotion insights available.</div>;
  }

  return (
    <motion.div
      className="bg-white rounded shadow p-4 space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold">Promotion Recommendations</h3>
      <ul className="space-y-2">
        {insights.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.current} → {item.target} ({item.years} yrs)
              </div>
            </div>
            <button className="text-blue-600 text-sm">Review</button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
