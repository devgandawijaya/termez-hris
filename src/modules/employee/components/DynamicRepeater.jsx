/**
 * DynamicRepeater Component - Reusable dynamic field repeater
 * Used for Career History and Assets sections
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function DynamicRepeater({
  title,
  items = [],
  onChange,
  fields = [],
  addButtonText = '+ Add',
  maxItems = 10,
  className = ''
}) {
  // Add new item
  const handleAdd = () => {
    if (items.length >= maxItems) return;
    
    const newItem = fields.reduce((acc, field) => {
      acc[field.key] = field.defaultValue || '';
      return acc;
    }, {});
    
    onChange([...items, newItem]);
  };

  // Remove item
  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  // Update item field
  const handleFieldChange = (index, fieldKey, value) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, [fieldKey]: value };
      }
      return item;
    });
    onChange(newItems);
  };

  // Common input classes
  const inputClasses = `
    w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    bg-white
  `;

  const labelClasses = "block text-xs font-medium text-gray-700 mb-1";

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={handleAdd}
          disabled={items.length >= maxItems}
          className={`
            inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg
            transition-colors
            ${items.length >= maxItems
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }
          `}
        >
          <Plus className="w-3 h-3 mr-1" />
          {addButtonText}
        </button>
      </div>

      {/* Items */}
      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No {title.toLowerCase()} added yet</p>
            <button
              type="button"
              onClick={handleAdd}
              className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Click to add your first {title.toLowerCase().slice(0, -1)}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* Item Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                    <span className="text-xs font-medium text-gray-600">
                      #{index + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Item Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fields.map((field) => (
                    <div key={field.key} className={field.className || ''}>
                      <label className={labelClasses}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select
                          value={item[field.key] || ''}
                          onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                          className={inputClasses}
                        >
                          <option value="">{field.placeholder || 'Select...'}</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={item[field.key] || ''}
                          onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                          className={`${inputClasses} resize-none`}
                          rows={2}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={item[field.key] || ''}
                          onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                          className={inputClasses}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Counter */}
      {items.length > 0 && (
        <p className="text-xs text-gray-500 mt-2 text-right">
          {items.length} of {maxItems} maximum
        </p>
      )}
    </div>
  );
}

