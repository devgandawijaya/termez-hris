import React from 'react';

export default function DataTable({ rows = [] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 text-sm font-medium text-gray-600">Page</th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-600">Views</th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-600">Unique</th>
              <th className="text-right py-2 px-2 text-sm font-medium text-gray-600">Avg Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0">
                <td className="py-2 px-2 text-sm text-gray-700">{row.title}</td>
                <td className="py-2 px-2 text-sm text-gray-600 text-right">{row.views.toLocaleString()}</td>
                <td className="py-2 px-2 text-sm text-gray-600 text-right">{row.unique.toLocaleString()}</td>
                <td className="py-2 px-2 text-sm text-gray-600 text-right">{row.avg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

