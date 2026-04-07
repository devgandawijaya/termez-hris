import React from 'react';

import KPIModal from './KPIModal';

export default function KPIMasterFormModal({ isOpen, onClose, form, departments, errors, onChange, onSave }) {
  return (
    <KPIModal
      title={form.id ? 'Edit KPI Master' : 'Tambah KPI Master'}
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Batal</button>
          <button type="button" onClick={onSave} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Simpan</button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm text-gray-600 md:col-span-2">
          <span className="block mb-1 font-medium text-gray-700">Nama KPI</span>
          <input value={form.name} onChange={(event) => onChange('name', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.name ? <span className="text-xs text-rose-600">{errors.name}</span> : null}
        </label>

        <label className="text-sm text-gray-600 md:col-span-2">
          <span className="block mb-1 font-medium text-gray-700">Deskripsi</span>
          <textarea value={form.description} onChange={(event) => onChange('description', event.target.value)} rows={4} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.description ? <span className="text-xs text-rose-600">{errors.description}</span> : null}
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Bobot (%)</span>
          <input type="number" value={form.weight} onChange={(event) => onChange('weight', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.weight ? <span className="text-xs text-rose-600">{errors.weight}</span> : null}
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Target</span>
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

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Tipe KPI</span>
          <select value={form.type} onChange={(event) => onChange('type', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2">
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
            <option value="Company">Company</option>
          </select>
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Departemen Owner</span>
          <select value={form.ownerDepartment} onChange={(event) => onChange('ownerDepartment', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2">
            <option value="">Pilih departemen</option>
            {departments.map((department) => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
          {errors.ownerDepartment ? <span className="text-xs text-rose-600">{errors.ownerDepartment}</span> : null}
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Status KPI</span>
          <select value={form.status} onChange={(event) => onChange('status', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
      </div>
    </KPIModal>
  );
}
