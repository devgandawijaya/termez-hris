/**
 * EmployeeForm Component - Create/Edit Employee Form
 * Enterprise grade with validation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Save,
  X
} from 'lucide-react';
import { useEmployeeForm } from '../hooks/useEmployee';
import { Department, JobLevel, EmploymentType, WorkLocation } from '../../../models/employeeModel';

const EmployeeForm = ({ existingEmployees = [], onSuccess, onCancel }) => {
  const {
    formData,
    errors,
    saving,
    nikChecking,
    nikExists,
    handleFieldChange,
    handleSave
  } = useEmployeeForm(existingEmployees);

  // Handle submit
  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSave();
    if (result.success && onSuccess) {
      onSuccess(result.data);
    }
  };

  // Input classes
  const inputClasses = `
    w-full px-3 py-2 text-sm border rounded-lg shadow-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    ${errors.fullName || errors.nik || errors.email || errors.phone 
      ? 'border-red-300 bg-red-50' 
      : 'border-gray-300 bg-white'}
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <User className="w-4 h-4 mr-2 text-indigo-600" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className={labelClasses}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              className={inputClasses}
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* NIK */}
          <div>
            <label className={labelClasses}>
              NIK <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.nik}
                onChange={(e) => handleFieldChange('nik', e.target.value)}
                className={inputClasses}
                placeholder="Enter NIK"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {nikChecking ? (
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                ) : nikExists ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : formData.nik && (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            </div>
            {errors.nik && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.nik}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelClasses}>
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className={`${inputClasses} pl-10`}
                placeholder="email@company.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={labelClasses}>
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className={`${inputClasses} pl-10`}
                placeholder="0812 3456 7890"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <Briefcase className="w-4 h-4 mr-2 text-indigo-600" />
          Employment Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <label className={labelClasses}>
              Department <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={formData.department}
                onChange={(e) => handleFieldChange('department', e.target.value)}
                className={`${inputClasses} pl-10`}
              >
                <option value="">Select Department</option>
                {Object.values(Department).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            {errors.department && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.department}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className={labelClasses}>
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleFieldChange('position', e.target.value)}
              className={inputClasses}
              placeholder="Enter position"
            />
            {errors.position && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.position}
              </p>
            )}
          </div>

          {/* Job Level */}
          <div>
            <label className={labelClasses}>Job Level</label>
            <select
              value={formData.jobLevel}
              onChange={(e) => handleFieldChange('jobLevel', e.target.value)}
              className={inputClasses}
            >
              <option value="">Select Job Level</option>
              {Object.values(JobLevel).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className={labelClasses}>Employment Type</label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleFieldChange('employmentType', e.target.value)}
              className={inputClasses}
            >
              {Object.values(EmploymentType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Join Date */}
          <div>
            <label className={labelClasses}>
              Join Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleFieldChange('joinDate', e.target.value)}
                className={`${inputClasses} pl-10`}
              />
            </div>
            {errors.joinDate && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.joinDate}
              </p>
            )}
          </div>

          {/* Work Location */}
          <div>
            <label className={labelClasses}>Work Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={formData.workLocation}
                onChange={(e) => handleFieldChange('workLocation', e.target.value)}
                className={`${inputClasses} pl-10`}
              >
                <option value="">Select Location</option>
                {Object.values(WorkLocation).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Salary & Manager */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-indigo-600" />
          Salary & Organization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Salary */}
          <div>
            <label className={labelClasses}>Basic Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => handleFieldChange('salary', e.target.value)}
                className={`${inputClasses} pl-10`}
                placeholder="0"
              />
            </div>
          </div>

          {/* Reporting Manager */}
          <div>
            <label className={labelClasses}>Reporting Manager</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.reportingManager}
                onChange={(e) => handleFieldChange('reportingManager', e.target.value)}
                className={`${inputClasses} pl-10`}
                placeholder="Manager name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-sm text-red-700">{errors.submit}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || nikExists}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Employee
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;

