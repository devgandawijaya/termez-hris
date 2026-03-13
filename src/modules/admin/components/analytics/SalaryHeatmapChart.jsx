import React from 'react';
import { motion } from 'framer-motion';
import { getColorScale } from '../../utils/chartUtils';

export default function SalaryHeatmapChart({ data }) {
  if (!data || data.length === 0) return null;
  // derive unique grades and departments
  const grades = [...new Set(data.map((d) => d.grade))];
  const depts = [...new Set(data.map((d) => d.department))];
  const allSalaries = data.map(d => d.salary);
  const min = Math.min(...allSalaries);
  const max = Math.max(...allSalaries);

  const cell = (grade, dept) => {
    const entry = data.find((d) => d.grade === grade && d.department === dept);
    const salary = entry ? entry.salary : 0;
    const bg = entry ? getColorScale(salary, min, max) : '#f0f0f0';
    return (
      <td key={dept} className="border p-2" style={{ backgroundColor: bg }}>
        {entry ? `$${salary}` : '-'}
      </td>
    );
  };

  return (
    <motion.div
      className="overflow-auto bg-white rounded shadow p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <table className="w-full table-auto text-center">
        <thead>
          <tr>
            <th className="border p-2">Grade \ Dept</th>
            {depts.map((d) => (
              <th key={d} className="border p-2">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
            <tr key={g}>
              <td className="border p-2 font-semibold">{g}</td>
              {depts.map((d) => cell(g, d))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
