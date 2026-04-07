import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

export default function DepartmentStatusChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      className="bg-white rounded shadow p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-semibold mb-2">Department Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Active" stackId="a" fill="#10B981" />
          <Bar dataKey="Probation" stackId="a" fill="#F59E0B" />
          <Bar dataKey="Contract" stackId="a" fill="#3B82F6" />
          <Bar dataKey="On Leave" stackId="a" fill="#FBBF24" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
