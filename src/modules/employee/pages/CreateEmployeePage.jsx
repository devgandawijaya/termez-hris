/**
 * CreateEmployeePage - Add New Employee with Multi-Tab Form
 * Enterprise style with 9 tabs matching EmployeeDetailPage layout
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Upload,
  X,
  FileText
} from 'lucide-react';

import TabNavigation from '../../hris/components/TabNavigation';
import { TabPanel } from '../../hris/components/TabNavigation';
import DynamicRepeater from '../components/DynamicRepeater';
import useEmployeeForm from '../hooks/useEmployeeForm';
import employeeService from '../services/employeeService';
import { 
  Gender, 
  MaritalStatus, 
  EmploymentType, 
  EmploymentStatus, 
  WorkLocation,
  Department,
  JobLevel
} from '../../../models/employeeModel';

// Tab configuration
const tabs = [
  { id: 'personal', label: 'Personal Info', icon: 'User' },
  { id: 'employment', label: 'Employment', icon: 'Briefcase' },
  { id: 'organization', label: 'Organization', icon: 'Building2' },
  { id: 'payroll', label: 'Payroll', icon: 'DollarSign' },
  { id: 'family', label: 'Family', icon: 'Users' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'documents', label: 'Documents', icon: 'FileText' },
  { id: 'careerHistory', label: 'Career History', icon: 'TrendingUp' },
  { id: 'assets', label: 'Asset', icon: 'Package' }
];

// Education fields for repeater
const educationFields = [
  { key: 'degree', label: 'Education Level', type: 'select', options: ['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3'] },
  { key: 'institution', label: 'Institution Name', type: 'text', placeholder: 'Enter institution name' },
  { key: 'major', label: 'Major', type: 'text', placeholder: 'Enter major' },
  { key: 'graduationYear', label: 'Graduation Year', type: 'number', placeholder: '2020' },
  { key: 'gpa', label: 'GPA', type: 'text', placeholder: '3.5' }
];

// Career history fields
const careerHistoryFields = [
  { key: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Company name' },
  { key: 'position', label: 'Position', type: 'text', placeholder: 'Position held' },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Job description', className: 'md:col-span-3' }
];

// Asset fields
const assetFields = [
  { key: 'assetName', label: 'Asset Name', type: 'text', placeholder: 'e.g., Laptop' },
  { key: 'serialNumber', label: 'Serial Number', type: 'text', placeholder: 'Serial number' },
  { key: 'assignDate', label: 'Assign Date', type: 'date' },
  { key: 'condition', label: 'Condition', type: 'select', options: ['New', 'Good', 'Fair', 'Poor'] }
];

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const [existingEmployees, setExistingEmployees] = useState([]);
  const [success, setSuccess] = useState(null);
  
  const {
    formData,
    errors,
    activeTab,
    saving,
    nikChecking,
    nikExists,
    saveSuccess,
    handleFieldChange,
    handleNestedFieldChange,
    handleArrayFieldChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleDocumentUpload,
    handleDocumentRemove,
    handleSave,
    handleSaveDraft,
    handleTabChange,
    resetForm,
    setFormData
  } = useEmployeeForm(existingEmployees);

  // Load existing employees for validation
  useEffect(() => {
    const loadExisting = async () => {
      try {
        const employees = await employeeService.getAllEmployees();
        setExistingEmployees(employees);
      } catch (err) {
        console.error('Failed to load existing employees:', err);
      }
    };
    loadExisting();
  }, []);

  // Handle successful save
  const handleFormSuccess = (result) => {
    if (result.success) {
      setSuccess({
        type: 'success',
        message: result.submitType === 'draft' 
          ? 'Employee saved as draft!' 
          : `Employee "${formData.personal.fullName}" created successfully!`
      });
      setTimeout(() => {
        navigate(`/employees/${result.data.id}`);
      }, 1500);
    }
  };

  // Handle submit
  const onSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSave('submit');
    if (result.success) {
      handleFormSuccess(result);
    }
  };

  // Handle save draft
  const onSaveDraft = async () => {
    const result = await handleSaveDraft();
    if (result.success) {
      handleFormSuccess({ ...result, submitType: 'draft' });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/employees');
  };

  // Common input classes
  const inputClasses = `
    w-full px-3 py-2 text-sm border rounded-lg shadow-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    bg-white
  `;

  const labelClasses = "block text-xs font-medium text-gray-700 mb-1";

  // Error display component
  const ErrorMessage = ({ error }) => error ? (
    <p className="mt-1 text-xs text-red-600 flex items-center">
      <AlertCircle className="w-3 h-3 mr-1" />
      {error}
    </p>
  ) : null;

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Add New Employee</h1>
              <p className="text-sm text-gray-500">Dashboard / Employee Database / Add Employee</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved successfully!
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={saving}
              className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </button>
            <button
              type="submit"
              form="employee-form"
              disabled={saving}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Employee
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center p-4 mb-6 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
              <p className="text-sm text-emerald-700">{success.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="bg-white rounded-t-xl shadow-sm border border-b-0 border-gray-100"
        />

        {/* Form */}
        <form id="employee-form" onSubmit={onSubmit} className="bg-white rounded-b-xl shadow-sm border border-gray-100 p-6">
          {/* Submit Error */}
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center p-4 mb-6 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </motion.div>
          )}

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* 1. Personal Info Tab */}
            {activeTab === 'personal' && (
              <TabPanel activeTab={activeTab} tabId="personal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className={labelClasses}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personal.fullName}
                      onChange={(e) => handleFieldChange('personal', 'fullName', e.target.value)}
                      className={`${inputClasses} ${errors['personal.fullName'] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Enter full name"
                    />
                    <ErrorMessage error={errors['personal.fullName']} />
                  </div>

                  {/* NIK */}
                  <div>
                    <label className={labelClasses}>
                      NIK <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.personal.nik}
                        onChange={(e) => handleFieldChange('personal', 'nik', e.target.value)}
                        className={`${inputClasses} ${errors['personal.nik'] ? 'border-red-300 bg-red-50' : 'border-gray-300'} pr-10`}
                        placeholder="Enter NIK"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {nikChecking ? (
                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        ) : nikExists ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : formData.personal.nik && (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                    </div>
                    <ErrorMessage error={errors['personal.nik']} />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClasses}>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.personal.email}
                      onChange={(e) => handleFieldChange('personal', 'email', e.target.value)}
                      className={`${inputClasses} ${errors['personal.email'] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="email@company.com"
                    />
                    <ErrorMessage error={errors['personal.email']} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClasses}>
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.personal.phone}
                      onChange={(e) => handleFieldChange('personal', 'phone', e.target.value)}
                      className={`${inputClasses} ${errors['personal.phone'] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="0812 3456 7890"
                    />
                    <ErrorMessage error={errors['personal.phone']} />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className={labelClasses}>Gender</label>
                    <select
                      value={formData.personal.gender}
                      onChange={(e) => handleFieldChange('personal', 'gender', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    >
                      <option value="">Select Gender</option>
                      {Object.values(Gender).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Place of Birth */}
                  <div>
                    <label className={labelClasses}>Place of Birth</label>
                    <input
                      type="text"
                      value={formData.personal.placeOfBirth}
                      onChange={(e) => handleFieldChange('personal', 'placeOfBirth', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="City"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className={labelClasses}>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.personal.birthDate}
                      onChange={(e) => handleFieldChange('personal', 'birthDate', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    />
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className={labelClasses}>Marital Status</label>
                    <select
                      value={formData.personal.maritalStatus}
                      onChange={(e) => handleFieldChange('personal', 'maritalStatus', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    >
                      <option value="">Select Status</option>
                      {Object.values(MaritalStatus).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Address</label>
                    <textarea
                      value={formData.personal.address}
                      onChange={(e) => handleFieldChange('personal', 'address', e.target.value)}
                      className={`${inputClasses} border-gray-300 resize-none`}
                      rows={2}
                      placeholder="Full address"
                    />
                  </div>

                  {/* National ID Number */}
                  <div>
                    <label className={labelClasses}>National ID Number</label>
                    <input
                      type="text"
                      value={formData.personal.nationalIdNumber}
                      onChange={(e) => handleFieldChange('personal', 'nationalIdNumber', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="KTP Number"
                    />
                  </div>

                  {/* NPWP */}
                  <div>
                    <label className={labelClasses}>NPWP</label>
                    <input
                      type="text"
                      value={formData.personal.npwp}
                      onChange={(e) => handleFieldChange('personal', 'npwp', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="Tax ID Number"
                    />
                  </div>
                </div>
              </TabPanel>
            )}

            {/* 2. Employment Tab */}
            {activeTab === 'employment' && (
              <TabPanel activeTab={activeTab} tabId="employment">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Employee ID */}
                  <div>
                    <label className={labelClasses}>Employee ID</label>
                    <input
                      type="text"
                      value={formData.employment.employeeId}
                      onChange={(e) => handleFieldChange('employment', 'employeeId', e.target.value)}
                      className={`${inputClasses} border-gray-300 bg-gray-50`}
                      readOnly
                    />
                  </div>

                  {/* Employment Type */}
                  <div>
                    <label className={labelClasses}>
                      Employment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.employment.employmentType}
                      onChange={(e) => handleFieldChange('employment', 'employmentType', e.target.value)}
                      className={`${inputClasses} ${errors['employment.employmentType'] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    >
                      {Object.values(EmploymentType).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ErrorMessage error={errors['employment.employmentType']} />
                  </div>

                  {/* Join Date */}
                  <div>
                    <label className={labelClasses}>
                      Join Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.employment.joinDate}
                      onChange={(e) => handleFieldChange('employment', 'joinDate', e.target.value)}
                      className={`${inputClasses} ${errors['employment.joinDate'] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                    <ErrorMessage error={errors['employment.joinDate']} />
                  </div>

                  {/* Probation End Date */}
                  <div>
                    <label className={labelClasses}>Probation End Date</label>
                    <input
                      type="date"
                      value={formData.employment.probationEndDate}
                      onChange={(e) => handleFieldChange('employment', 'probationEndDate', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    />
                  </div>

                  {/* Employment Status */}
                  <div>
                    <label className={labelClasses}>Employment Status</label>
                    <select
                      value={formData.employment.employmentStatus}
                      onChange={(e) => handleFieldChange('employment', 'employmentStatus', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    >
                      {Object.values(EmploymentStatus).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Work Location */}
                  <div>
                    <label className={labelClasses}>Work Location</label>
                    <select
                      value={formData.employment.workLocation}
                      onChange={(e) => handleFieldChange('employment', 'workLocation', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    >
                      {Object.values(WorkLocation).map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Work Schedule */}
                  <div>
                    <label className={labelClasses}>Work Schedule</label>
                    <input
                      type="text"
                      value={formData.employment.workSchedule}
                      onChange={(e) => handleFieldChange('employment', 'workSchedule', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="Monday-Friday"
                    />
                  </div>

                  {/* Contract Start */}
                  <div>
                    <label className={labelClasses}>Contract Start</label>
                    <input
                      type="date"
                      value={formData.employment.contractStart}
                      onChange={(e) => handleFieldChange('employment', 'contractStart', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    />
                  </div>

                  {/* Contract End */}
                  <div>
                    <label className={labelClasses}>Contract End</label>
                    <input
                      type="date"
                      value={formData.employment.contractEnd}
                      onChange={(e) => handleFieldChange('employment', 'contractEnd', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    />
                  </div>
                </div>
              </TabPanel>
            )}

            {/* 3. Organization Tab */}
            {activeTab === 'organization' && (
              <TabPanel activeTab={activeTab} tabId="organization">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Department */}
                  <div>
                    <label className={labelClasses}>
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.organization.department}
                      onChange={(e) => handleFieldChange('organization', 'department', e.target.value)}
                      className={`${inputClasses} ${errors['organization.department'] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select Department</option>
                      {Object.values(Department).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ErrorMessage error={errors['organization.department']} />
                  </div>

                  {/* Position */}
                  <div>
                    <label className={labelClasses}>
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organization.position}
                      onChange={(e) => handleFieldChange('organization', 'position', e.target.value)}
                      className={`${inputClasses} ${errors['organization.position'] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Enter position"
                    />
                    <ErrorMessage error={errors['organization.position']} />
                  </div>

                  {/* Job Level */}
                  <div>
                    <label className={labelClasses}>Job Level</label>
                    <select
                      value={formData.organization.jobLevel}
                      onChange={(e) => handleFieldChange('organization', 'jobLevel', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    >
                      <option value="">Select Job Level</option>
                      {Object.values(JobLevel).map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>

                  {/* Manager */}
                  <div>
                    <label className={labelClasses}>Manager</label>
                    <input
                      type="text"
                      value={formData.organization.manager}
                      onChange={(e) => handleFieldChange('organization', 'manager', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="Manager name"
                    />
                  </div>

                  {/* Division */}
                  <div>
                    <label className={labelClasses}>Division</label>
                    <input
                      type="text"
                      value={formData.organization.division}
                      onChange={(e) => handleFieldChange('organization', 'division', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="Division name"
                    />
                  </div>

                  {/* Direct Supervisor */}
                  <div>
                    <label className={labelClasses}>Direct Supervisor</label>
                    <input
                      type="text"
                      value={formData.organization.directSupervisor}
                      onChange={(e) => handleFieldChange('organization', 'directSupervisor', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="Supervisor name"
                    />
                  </div>
                </div>
              </TabPanel>
            )}

            {/* 4. Payroll Tab */}
            {activeTab === 'payroll' && (
              <TabPanel activeTab={activeTab} tabId="payroll">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Basic Salary */}
                  <div>
                    <label className={labelClasses}>
                      Basic Salary <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                      <input
                        type="number"
                        value={formData.payroll.basicSalary}
                        onChange={(e) => handleFieldChange('payroll', 'basicSalary', e.target.value)}
                        className={`${inputClasses} pl-10 ${errors['payroll.basicSalary'] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        placeholder="0"
                      />
                    </div>
                    <ErrorMessage error={errors['payroll.basicSalary']} />
                  </div>

                  {/* Allowance */}
                  <div>
                    <label className={labelClasses}>Allowance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                      <input
                        type="number"
                        value={formData.payroll.allowance}
                        onChange={(e) => handleFieldChange('payroll', 'allowance', e.target.value)}
                        className={`${inputClasses} pl-10 border-gray-300`}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className={labelClasses}>Bank Name</label>
                    <input
                      type="text"
                      value={formData.payroll.bankName}
                      onChange={(e) => handleFieldChange('payroll', 'bankName', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="Bank name"
                    />
                  </div>

                  {/* Bank Account Number */}
                  <div>
                    <label className={labelClasses}>Bank Account Number</label>
                    <input
                      type="text"
                      value={formData.payroll.bankAccountNumber}
                      onChange={(e) => handleFieldChange('payroll', 'bankAccountNumber', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="Account number"
                    />
                  </div>

                  {/* Tax Status */}
                  <div>
                    <label className={labelClasses}>Tax Status</label>
                    <select
                      value={formData.payroll.taxStatus}
                      onChange={(e) => handleFieldChange('payroll', 'taxStatus', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                    >
                      <option value="TK/0">TK/0</option>
                      <option value="TK/1">TK/1</option>
                      <option value="TK/2">TK/2</option>
                      <option value="TK/3">TK/3</option>
                      <option value="K/0">K/0</option>
                      <option value="K/1">K/1</option>
                      <option value="K/2">K/2</option>
                      <option value="K/3">K/3</option>
                    </select>
                  </div>

                  {/* BPJS Number */}
                  <div>
                    <label className={labelClasses}>BPJS Number</label>
                    <input
                      type="text"
                      value={formData.payroll.bpjsNumber}
                      onChange={(e) => handleFieldChange('payroll', 'bpjsNumber', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="BPJS number"
                    />
                  </div>
                </div>
              </TabPanel>
            )}

            {/* 5. Family Tab */}
            {activeTab === 'family' && (
              <TabPanel activeTab={activeTab} tabId="family">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Emergency Contact Name */}
                  <div>
                    <label className={labelClasses}>Emergency Contact Name</label>
                    <input
                      type="text"
                      value={formData.family.emergencyContact.name}
                      onChange={(e) => handleFieldChange('family', 'emergencyContact', { ...formData.family.emergencyContact, name: e.target.value })}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="Contact name"
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className={labelClasses}>Relationship</label>
                    <input
                      type="text"
                      value={formData.family.emergencyContact.relation}
                      onChange={(e) => handleFieldChange('family', 'emergencyContact', { ...formData.family.emergencyContact, relation: e.target.value })}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className={labelClasses}>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.family.emergencyContact.phone}
                      onChange={(e) => handleFieldChange('family', 'emergencyContact', { ...formData.family.emergencyContact, phone: e.target.value })}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="0812 3456 7890"
                    />
                  </div>

                  {/* Number of Dependents */}
                  <div>
                    <label className={labelClasses}>Number of Dependents</label>
                    <input
                      type="number"
                      value={formData.family.numberOfDependents}
                      onChange={(e) => handleFieldChange('family', 'numberOfDependents', e.target.value)}
                      className={`${inputClasses} border-gray-300`}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </TabPanel>
            )}

            {/* 6. Education Tab */}
            {activeTab === 'education' && (
              <TabPanel activeTab={activeTab} tabId="education">
                <DynamicRepeater
                  title="Education"
                  items={formData.education}
                  onChange={(items) => {
                    setFormData(prev => ({ ...prev, education: items }));
                  }}
                  fields={educationFields}
                  addButtonText="+ Add Education"
                  maxItems={5}
                />
              </TabPanel>
            )}

            {/* 7. Documents Tab */}
            {activeTab === 'documents' && (
              <TabPanel activeTab={activeTab} tabId="documents">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* KTP */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className={labelClasses}>Upload KTP</label>
                    <div className="mt-2">
                      {formData.documents.ktp ? (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm text-gray-700 truncate">{formData.documents.ktp.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDocumentRemove('ktp')}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-white transition-colors">
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="mt-1 text-xs text-gray-500">Click to upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload('ktp', e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* NPWP Document */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className={labelClasses}>Upload NPWP</label>
                    <div className="mt-2">
                      {formData.documents.npwp ? (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm text-gray-700 truncate">{formData.documents.npwp.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDocumentRemove('npwp')}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-white transition-colors">
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="mt-1 text-xs text-gray-500">Click to upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocumentUpload('npwp', e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Contract */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className={labelClasses}>Upload Contract</label>
                    <div className="mt-2">
                      {formData.documents.contract ? (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm text-gray-700 truncate">{formData.documents.contract.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDocumentRemove('contract')}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-white transition-colors">
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="mt-1 text-xs text-gray-500">Click to upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleDocumentUpload('contract', e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* CV */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className={labelClasses}>Upload CV</label>
                    <div className="mt-2">
                      {formData.documents.cv ? (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm text-gray-700 truncate">{formData.documents.cv.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDocumentRemove('cv')}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-white transition-colors">
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="mt-1 text-xs text-gray-500">Click to upload</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleDocumentUpload('cv', e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </TabPanel>
            )}

            {/* 8. Career History Tab */}
            {activeTab === 'careerHistory' && (
              <TabPanel activeTab={activeTab} tabId="careerHistory">
                <DynamicRepeater
                  title="Career History"
                  items={formData.careerHistory}
                  onChange={(items) => {
                    setFormData(prev => ({ ...prev, careerHistory: items }));
                  }}
                  fields={careerHistoryFields}
                  addButtonText="+ Add History"
                  maxItems={10}
                />
              </TabPanel>
            )}

            {/* 9. Assets Tab */}
            {activeTab === 'assets' && (
              <TabPanel activeTab={activeTab} tabId="assets">
                <DynamicRepeater
                  title="Assets"
                  items={formData.assets}
                  onChange={(items) => {
                    setFormData(prev => ({ ...prev, assets: items }));
                  }}
                  fields={assetFields}
                  addButtonText="+ Add Asset"
                  maxItems={10}
                />
              </TabPanel>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

