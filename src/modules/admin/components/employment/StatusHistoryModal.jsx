import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function StatusHistoryModal({ isOpen, onClose, history = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <motion.div
        className="bg-white rounded-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Status History</h2>
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="flex items-start">
              <div className="w-2 h-2 mt-2 bg-indigo-600 rounded-full" />
              <div className="ml-4">
                <div className="text-sm font-medium">{item.status}</div>
                <div className="text-xs text-gray-500">{item.date}</div>
                {item.notes && <div className="text-xs text-gray-700">{item.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
