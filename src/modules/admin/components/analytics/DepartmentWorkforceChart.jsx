import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

export default function DepartmentWorkforceChart({ data }) {
  if (!data || data.length === 0) return null;
  return (
    <motion.div
      className="bg-white rounded shadow p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalEmployees" stackId="a" fill="#8884d8" />
          <Bar dataKey="totalPositions" stackId="a" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
