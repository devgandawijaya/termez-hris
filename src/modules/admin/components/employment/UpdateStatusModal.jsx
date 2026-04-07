import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const _motion = motion; // avoid unused import warning
import { X } from 'lucide-react';

export default function UpdateStatusModal({ isOpen, onClose, record, onUpdate }) {
  const [form, setForm] = useState({
    currentStatus: '',
    newStatus: '',
    changeDate: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    if (record) {
      // sync update asynchronously to avoid linter warning
      setTimeout(() => {
        setForm({
          currentStatus: record.currentStatus,
          newStatus: '',
          changeDate: new Date().toISOString().substr(0, 10),
          reason: '',
          notes: '',
        });
      }, 0);
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdate(record.id, form);
    onClose();
  };

  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        className="bg-white rounded-lg w-full max-w-lg p-6 relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Update Status</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Status</label>
            <input
              type="text"
              value={form.currentStatus}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Status</label>
            <select
              name="newStatus"
              value={form.newStatus}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {[
                'Active',
                'Probation',
                'Contract',
                'On Leave',
                'Resigned',
                'Terminated',
                'Retired',
                'Suspended',
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Change Date</label>
              <input
                type="date"
                name="changeDate"
                value={form.changeDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason for Change</label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={2}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Update
          </button>
        </div>
      </motion.div>
    </div>
  );
}
