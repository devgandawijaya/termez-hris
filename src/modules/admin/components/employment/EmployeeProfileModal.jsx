import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function EmployeeProfileModal({ isOpen, onClose, employee }) {
  if (!isOpen || !employee) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <motion.div
        className="bg-white rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center">
          <img
            src={employee.photo || 'https://via.placeholder.com/100'}
            alt="photo"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-xl font-semibold">{employee.name}</h2>
          <p className="text-sm text-gray-500">{employee.department} - {employee.position}</p>
          <p className="text-sm text-gray-500">Joined: {employee.startDate}</p>
          <p className="text-sm text-gray-500">Status: {employee.currentStatus}</p>
        </div>
        <div className="mt-6">
          <h3 className="font-medium mb-2">Employment History</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {employee.history?.map((h, i) => (
              <li key={i} className="border-l-2 border-indigo-500 pl-3">
                <div>{h.status} ({h.date})</div>
                {h.notes && <div className="text-xs text-gray-500">{h.notes}</div>}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
