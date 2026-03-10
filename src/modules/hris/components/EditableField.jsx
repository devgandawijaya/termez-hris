/**
 * Editable Field Component - Form field with edit mode toggle
 */

import React from 'react';
import { Edit2, Check, X } from 'lucide-react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

/**
 * Editable Field Component
 */
export default function EditableField({
  label,
  value,
  onChange,
  type = 'text',
  options,
  editable = true,
  editMode,
  error,
  required,
  placeholder,
  disabled,
  className = '',
  ...props
}) {
  if (!editMode || !editable) {
    // View mode
    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="px-3 py-2 bg-gray-50 rounded-lg min-h-[42px] flex items-center">
          <span className="text-sm text-gray-900">
            {value || '-'}
          </span>
        </div>
      </div>
    );
  }

  // Edit mode
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  if (type === 'select') {
    return (
      <FormSelect
        label={label}
        value={value}
        onChange={handleChange}
        options={options}
        required={required}
        error={error}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        {...props}
      />
    );
  }

  return (
    <FormInput
      label={label}
      type={type}
      value={value || ''}
      onChange={handleChange}
      required={required}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...props}
    />
  );
}

