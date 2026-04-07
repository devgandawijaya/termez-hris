import React from 'react';

import KPIModal from './KPIModal';

export default function KPIAssignmentModal({
  isOpen,
  onClose,
  form,
  errors,
  employees,
  departments,
  masterRecords,
  onChange,
  onToggleEmployee,
  onSave,
}) {
  return (
    <KPIModal
      title="Assign KPI"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Batal</button>
          <button type="button" onClick={onSave} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Simpan Assignment</button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm text-gray-600 md:col-span-2">
          <span className="block mb-1 font-medium text-gray-700">Pilih KPI</span>
          <select value={form.kpiId} onChange={(event) => onChange('kpiId', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2">
            <option value="">Pilih KPI</option>
            {masterRecords.filter((item) => item.status === 'Active').map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          {errors.kpiId ? <span className="text-xs text-rose-600">{errors.kpiId}</span> : null}
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Mode Assignment</span>
          <select value={form.assignmentMode} onChange={(event) => onChange('assignmentMode', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2">
            <option value="employee">Karyawan</option>
            <option value="department">Departemen</option>
          </select>
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Reviewer / Atasan</span>
          <input value={form.reviewer} onChange={(event) => onChange('reviewer', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.reviewer ? <span className="text-xs text-rose-600">{errors.reviewer}</span> : null}
        </label>

        {form.assignmentMode === 'department' ? (
          <label className="text-sm text-gray-600 md:col-span-2">
            <span className="block mb-1 font-medium text-gray-700">Departemen</span>
            <select value={form.department} onChange={(event) => onChange('department', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2">
              <option value="">Pilih departemen</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
            {errors.department ? <span className="text-xs text-rose-600">{errors.department}</span> : null}
          </label>
        ) : (
          <div className="md:col-span-2">
            <div className="text-sm font-medium text-gray-700 mb-2">Karyawan</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-xl border border-gray-200 p-3">
              {employees.map((employee) => {
                const checked = form.employeeIds.includes(employee.id);
                return (
                  <label key={employee.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 text-sm text-gray-600">
                    <input type="checkbox" checked={checked} onChange={() => onToggleEmployee(employee.id)} className="mt-1" />
                    <span>
                      <span className="block font-medium text-gray-900">{employee.fullName}</span>
                      <span className="text-xs text-gray-500">{employee.department} • {employee.position}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.employeeIds ? <span className="text-xs text-rose-600">{errors.employeeIds}</span> : null}
          </div>
        )}

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Periode</span>
          <select value={form.periodType} onChange={(event) => onChange('periodType', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2">
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Label Periode</span>
          <input value={form.periodLabel} onChange={(event) => onChange('periodLabel', event.target.value)} placeholder="Contoh: 2026-04 atau 2026-Q2" className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.periodLabel ? <span className="text-xs text-rose-600">{errors.periodLabel}</span> : null}
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Bobot per Assignment (%)</span>
          <input type="number" value={form.weight} onChange={(event) => onChange('weight', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.weight ? <span className="text-xs text-rose-600">{errors.weight}</span> : null}
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Target Assignment</span>
          <input type="number" value={form.target} onChange={(event) => onChange('target', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.target ? <span className="text-xs text-rose-600">{errors.target}</span> : null}
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Satuan</span>
          <select value={form.unit} onChange={(event) => onChange('unit', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2">
            <option value="%">%</option>
            <option value="angka">angka</option>
            <option value="jam">jam</option>
            <option value="hari">hari</option>
          </select>
        </label>

        <label className="text-sm text-gray-600 md:col-span-2">
          <span className="block mb-1 font-medium text-gray-700">Catatan</span>
          <textarea value={form.notes} onChange={(event) => onChange('notes', event.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
        </label>
      </div>
    </KPIModal>
  );
}
