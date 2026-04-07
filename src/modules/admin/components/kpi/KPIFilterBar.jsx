import React from 'react';

export default function KPIFilterBar({ filters, filterOptions, onChange, onReset }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <label className="text-sm text-gray-600">
        <span className="block mb-1 font-medium text-gray-700">Periode</span>
        <select
          value={filters.periodType}
          onChange={(event) => onChange('periodType', event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        >
          <option value="">Semua periode</option>
          {filterOptions.periodTypes.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label className="text-sm text-gray-600">
        <span className="block mb-1 font-medium text-gray-700">Departemen</span>
        <select
          value={filters.department}
          onChange={(event) => onChange('department', event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        >
          <option value="">Semua departemen</option>
          {filterOptions.departments.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label className="text-sm text-gray-600">
        <span className="block mb-1 font-medium text-gray-700">Karyawan</span>
        <select
          value={filters.employeeId}
          onChange={(event) => onChange('employeeId', event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
        >
          <option value="">Semua karyawan</option>
          {filterOptions.employees.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </label>

      <div className="flex items-end">
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
}
