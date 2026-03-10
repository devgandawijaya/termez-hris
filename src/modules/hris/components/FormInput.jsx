/**
 * Form Input Component - Reusable form input with validation
 */

import React from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Form Input Component
 */
export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  readonly = false,
  error,
  success,
  helpText,
  prefix,
  suffix,
  className = '',
  accept,
  ...props
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const baseInputClasses = `
    w-full px-4 py-2.5 rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${readonly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
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
      
      {/* Input wrapper */}
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </div>
        )}
        
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readonly}
          accept={accept}
          className={`${baseInputClasses} ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''}`}
          {...props}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {/* Success indicator */}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
        
        {/* Suffix */}
        {suffix && !success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </div>
        )}
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

