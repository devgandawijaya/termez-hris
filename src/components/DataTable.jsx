import React from 'react';

export default function DataTable({ rows }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
      <div className="text-sm text-gray-600 mb-3">Page Views by Page Title</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-2">Page</th>
            <th className="py-2">Views</th>
            <th className="py-2">Unique</th>
            <th className="py-2">Avg. Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.title} className="border-b last:border-b-0">
              <td className="py-3">{r.title}</td>
              <td className="py-3">{r.views}</td>
              <td className="py-3">{r.unique}</td>
              <td className="py-3">{r.avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
