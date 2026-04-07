import React from 'react';

import KPISectionCard from './KPISectionCard';

export default function KPIReportTab({ rows, onExportPdf, onExportExcel }) {
  return (
    <KPISectionCard
      title="KPI Report"
      description="Report per karyawan, departemen, dan periode dengan export PDF / Excel."
      action={
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onExportPdf} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export PDF
          </button>
          <button type="button" onClick={onExportExcel} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Export Excel
          </button>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="py-3 pr-4">Periode</th>
              <th className="py-3 pr-4">Karyawan</th>
              <th className="py-3 pr-4">Departemen</th>
              <th className="py-3 pr-4">KPI</th>
              <th className="py-3 pr-4">Target</th>
              <th className="py-3 pr-4">Actual</th>
              <th className="py-3 pr-4">Progress</th>
              <th className="py-3 pr-4">Score</th>
              <th className="py-3 pr-4">Approval</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.employee}-${row.kpi}-${index}`} className="border-b border-gray-100">
                <td className="py-4 pr-4 text-gray-700">{row.period}</td>
                <td className="py-4 pr-4 text-gray-700">{row.employee}</td>
                <td className="py-4 pr-4 text-gray-700">{row.department}</td>
                <td className="py-4 pr-4 text-gray-700">{row.kpi}</td>
                <td className="py-4 pr-4 text-gray-700">{row.target}</td>
                <td className="py-4 pr-4 text-gray-700">{row.actual}</td>
                <td className="py-4 pr-4 text-gray-700">{row.progress}%</td>
                <td className="py-4 pr-4 text-gray-700">{row.score}</td>
                <td className="py-4 pr-4 text-gray-700">{row.approvalStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </KPISectionCard>
  );
}
