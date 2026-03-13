import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

export default function GradePyramidChart({ data }) {
  if (!data || data.length === 0) return null;
  // assume data = [{level:'Entry Level',count:..}, ...]
  // sort descending so executive on top for pyramid look
  const sorted = [...data].sort((a,b) => b.count - a.count);
  return (
    <motion.div
      className="bg-white rounded shadow p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
          <XAxis type="number" />
          <YAxis dataKey="level" type="category" />
          <Tooltip />
          <Bar dataKey="count" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
