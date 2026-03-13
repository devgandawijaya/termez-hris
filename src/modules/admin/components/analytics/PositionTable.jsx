import React from 'react';
import { motion } from 'framer-motion';

export default function PositionTable({ data }) {
  if (!data || data.length === 0) return <div>No positions available.</div>;
  return (
    <motion.div className="bg-white rounded shadow p-4 overflow-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <table className="w-full table-auto text-left">
        <thead>
          <tr>
            <th className="border p-2">Position</th>
            <th className="border p-2">Grade</th>
            <th className="border p-2">Filled</th>
            <th className="border p-2">Open</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-100">
              <td className="border p-2">{row.position}</td>
              <td className="border p-2">{row.grade}</td>
              <td className="border p-2">{row.filled}</td>
              <td className="border p-2">{row.open}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
