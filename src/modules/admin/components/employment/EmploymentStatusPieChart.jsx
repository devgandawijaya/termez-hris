import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#FBBF24', '#6B7280', '#EF4444', '#9CA3AF', '#6366F1'];

export default function EmploymentStatusPieChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      className="bg-white rounded shadow p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold mb-2">Status Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
