import React from 'react';

import KPISectionCard from './KPISectionCard';

export default function KPIAssignmentTab({ assignments, canAssign, onCreate }) {
  return (
    <KPISectionCard
      title="KPI Assignment"
      description="Assign KPI ke karyawan atau departemen, termasuk bulk assign dan pengaturan periode."
      action={canAssign ? (
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Assign KPI
        </button>
      ) : null}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-5">
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <div className="text-sm text-slate-500">Bulk Assign Ready</div>
          <div className="text-2xl font-semibold text-slate-900 mt-1">{assignments.length}</div>
          <div className="text-sm text-slate-500 mt-1">Assignment aktif yang bisa dimonitor.</div>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="text-sm text-emerald-700">Employee Assignment</div>
          <div className="text-2xl font-semibold text-emerald-900 mt-1">{assignments.filter((item) => item.kpiType === 'Individual').length}</div>
          <div className="text-sm text-emerald-700 mt-1">Fokus personal objective.</div>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="text-sm text-amber-700">Team / Company KPI</div>
          <div className="text-2xl font-semibold text-amber-900 mt-1">{assignments.filter((item) => item.kpiType !== 'Individual').length}</div>
          <div className="text-sm text-amber-700 mt-1">Termasuk department dan company target.</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="py-3 pr-4">KPI</th>
              <th className="py-3 pr-4">Assignee</th>
              <th className="py-3 pr-4">Periode</th>
              <th className="py-3 pr-4">Bobot</th>
              <th className="py-3 pr-4">Target</th>
              <th className="py-3 pr-4">Reviewer</th>
              <th className="py-3 pr-4">Approval</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4 pr-4">
                  <div className="font-medium text-gray-900">{item.kpiName}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.kpiType} • {item.department}</div>
                </td>
                <td className="py-4 pr-4 text-gray-700">
                  <div>{item.employeeName}</div>
                  <div className="text-xs text-gray-500">{item.employeeCode}</div>
                </td>
                <td className="py-4 pr-4 text-gray-700">{item.periodType} • {item.periodLabel}</td>
                <td className="py-4 pr-4 text-gray-700">{item.weight}%</td>
                <td className="py-4 pr-4 text-gray-700">{item.target} {item.unit}</td>
                <td className="py-4 pr-4 text-gray-700">{item.reviewer}</td>
                <td className="py-4 pr-4 text-gray-700">{item.approvalStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </KPISectionCard>
  );
}
