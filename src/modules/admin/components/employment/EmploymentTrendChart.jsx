import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

export default function EmploymentTrendChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      className="bg-white rounded shadow p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold mb-2">Status Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {Object.keys(data[0] || {})
            .filter((k) => k !== 'month')
            .map((key, idx) => (
              <Line key={key} type="monotone" dataKey={key} stroke={['#10B981', '#F59E0B', '#3B82F6', '#FBBF24'][idx % 4]} />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
