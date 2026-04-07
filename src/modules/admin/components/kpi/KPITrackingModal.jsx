import React from 'react';

import KPIModal from './KPIModal';

export default function KPITrackingModal({ isOpen, onClose, form, errors, onChange, onSave }) {
  return (
    <KPIModal
      title="Input Realisasi KPI"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Batal</button>
          <button type="button" onClick={onSave} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Simpan Realisasi</button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4">
        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Realisasi</span>
          <input type="number" value={form.actual} onChange={(event) => onChange('actual', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.actual ? <span className="text-xs text-rose-600">{errors.actual}</span> : null}
        </label>

        <label className="text-sm text-gray-600">
          <span className="block mb-1 font-medium text-gray-700">Catatan Monitoring</span>
          <textarea value={form.notes} onChange={(event) => onChange('notes', event.target.value)} rows={4} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
          {errors.notes ? <span className="text-xs text-rose-600">{errors.notes}</span> : null}
        </label>
      </div>
    </KPIModal>
  );
}
