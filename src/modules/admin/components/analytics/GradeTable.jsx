import React from 'react';
import { motion } from 'framer-motion';

export default function GradeTable({ data }) {
  if (!data || data.length === 0) return <div>No grades available.</div>;
  return (
    <motion.div className="bg-white rounded shadow p-4 overflow-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th className="border p-2">Grade</th>
            <th className="border p-2">Level</th>
            <th className="border p-2">Min Salary</th>
            <th className="border p-2">Max Salary</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-100">
              <td className="border p-2">{row.grade}</td>
              <td className="border p-2">{row.level}</td>
              <td className="border p-2">{row.minSalary}</td>
              <td className="border p-2">{row.maxSalary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
