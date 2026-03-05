/**
 * Form Select Component - Reusable select dropdown with validation
 */

import React from 'react';
import { AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

/**
 * Form Select Component
 */
export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error,
  success,
  helpText,
  className = '',
  ...props
}) {
  const baseSelectClasses = `
    w-full px-4 py-2.5 rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:bg-gray-50 disabled:cursor-not-allowed
    bg-white
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : success 
        ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200'
        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
    }
  `;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select wrapper */}
      <div className="relative">
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={baseSelectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const optValue = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
        
        {/* Custom arrow icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}

