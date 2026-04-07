import React from 'react';

import KPISectionCard from './KPISectionCard';

const badgeTone = {
  Active: 'bg-emerald-100 text-emerald-700',
  Inactive: 'bg-gray-100 text-gray-700',
};

export default function KPIMasterDataTab({ records, canManageMaster, onCreate, onEdit, onDelete }) {
  return (
    <KPISectionCard
      title="KPI Master Data"
      description="Kelola definisi KPI, status aktif, tipe KPI, dan validasi bobot/target."
      action={canManageMaster ? (
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Tambah KPI
        </button>
      ) : null}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="py-3 pr-4">Nama KPI</th>
              <th className="py-3 pr-4">Tipe</th>
              <th className="py-3 pr-4">Bobot</th>
              <th className="py-3 pr-4">Target</th>
              <th className="py-3 pr-4">Satuan</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Assignment</th>
              <th className="py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-gray-100 align-top">
                <td className="py-4 pr-4">
                  <div className="font-medium text-gray-900">{record.name}</div>
                  <div className="text-gray-500 mt-1 max-w-sm">{record.description}</div>
                  <div className="text-xs text-gray-400 mt-1">Owner: {record.ownerDepartment}</div>
                </td>
                <td className="py-4 pr-4 text-gray-700">{record.type}</td>
                <td className="py-4 pr-4 text-gray-700">{record.weight}%</td>
                <td className="py-4 pr-4 text-gray-700">{record.target}</td>
                <td className="py-4 pr-4 text-gray-700">{record.unit}</td>
                <td className="py-4 pr-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeTone[record.status] || badgeTone.Inactive}`}>
                    {record.status}
                  </span>
                </td>
                <td className="py-4 pr-4 text-gray-700">{record.assignmentCount}</td>
                <td className="py-4 text-right">
                  {canManageMaster ? (
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => onEdit(record)} className="rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50">
                        Edit
                      </button>
                      <button type="button" onClick={() => onDelete(record)} className="rounded-lg border border-rose-200 px-3 py-2 text-rose-600 hover:bg-rose-50">
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Read only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </KPISectionCard>
  );
}
