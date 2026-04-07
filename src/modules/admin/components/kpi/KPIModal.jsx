import React from 'react';

export default function KPIModal({ title, isOpen, onClose, children, footer }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/40 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Tutup</button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">{footer}</div>
      </div>
    </div>
  );
}
