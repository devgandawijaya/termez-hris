/**
 * Employee Detail Page - Enterprise HRIS Employee Detail View
 * With 9 tabs: Personal Info, Employment, Organization, Payroll, Family, Education, Documents, Career History, Asset
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Check, 
  Upload,
  Download,
  Trash2,
  Plus,
  User,
  Briefcase,
  Building2,
  DollarSign,
  Users,
  GraduationCap,
  FileText,
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

import TabNavigation from '../components/TabNavigation';
import TabPanel from '../components/TabNavigation';
import EditableField from '../components/EditableField';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import useEmployeeDetailViewModel from '../viewmodels/useEmployeeDetailViewModel';
import { 
  Gender, 
  MaritalStatus, 
  EmploymentType, 
  EmploymentStatus, 
  WorkLocation,
  Department,
  JobLevel
} from '../../../models/employeeModel';

export default function EmployeeDetailPage() {
  const {
    employee,
    loading,
    loadingError,
    activeTab,
    editMode,
    errors,
    saving,
    saveSuccess,
    tabs,
    toggleEditMode,
    handleFieldChange,
    handleNestedFieldChange,
    handleSave,
    handleCancel,
    handleTabChange,
    handleGoBack
  } = useEmployeeDetailViewModel();

  // Loading state
  if (loading) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingError) {
    return (
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Employee</h2>
            <p className="text-gray-500 mb-4">{loadingError}</p>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Back to Employee List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{employee.fullName}</h1>
              <p className="text-sm text-gray-500">{employee.employeeId} • {employee.position}</p>
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
                  Changes saved successfully
                </motion.div>
              )}
            </AnimatePresence>
            
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={toggleEditMode}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Employee
              </button>
            )}
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={employee.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.fullName}`}
              alt={employee.fullName}
              className="w-24 h-24 rounded-xl shadow-sm"
            />
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Department</p>
                <p className="text-sm font-semibold text-gray-900">{employee.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Work Location</p>
                <p className="text-sm font-semibold text-gray-900">{employee.workLocation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Join Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  employee.employmentStatus === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'bg-gray-50 text-gray-700'
                }`}>
                  {employee.employmentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="bg-white rounded-t-xl shadow-sm border border-b-0 border-gray-100"
        />

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <TabPanel activeTab={activeTab} tabId="personal">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EditableField
                  label="Employee ID"
                  value={employee.employeeId}
                  editable={false}
                  editMode={editMode}
                />
                <EditableField
                  label="Full Name"
                  value={employee.fullName}
                  onChange={(val) => handleFieldChange('fullName', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.fullName}
                  required
                />
                <EditableField
                  label="NIK"
                  value={employee.nik}
                  onChange={(val) => handleFieldChange('nik', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.nik}
                  required
                />
                <EditableField
                  label="Birth Date"
                  type="date"
                  value={employee.birthDate}
                  onChange={(val) => handleFieldChange('birthDate', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.birthDate}
                  required
                />
                <EditableField
                  label="Gender"
                  type="select"
                  value={employee.gender}
                  options={Object.values(Gender)}
                  onChange={(val) => handleFieldChange('gender', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.gender}
                  required
                />
                <EditableField
                  label="Marital Status"
                  type="select"
                  value={employee.maritalStatus}
                  options={Object.values(MaritalStatus)}
                  onChange={(val) => handleFieldChange('maritalStatus', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.maritalStatus}
                  required
                />
                <EditableField
                  label="Phone"
                  type="tel"
                  value={employee.phone}
                  onChange={(val) => handleFieldChange('phone', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.phone}
                  required
                />
                <EditableField
                  label="Email"
                  type="email"
                  value={employee.email}
                  onChange={(val) => handleFieldChange('email', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.email}
                  required
                />
                <div className="md:col-span-2 lg:col-span-3">
                  <EditableField
                    label="Address"
                    value={employee.address}
                    onChange={(val) => handleFieldChange('address', val)}
                    editable={true}
                    editMode={editMode}
                    error={errors.address}
                    required
                  />
                </div>
              </div>
            </TabPanel>
          )}

          {/* Employment Tab */}
          {activeTab === 'employment' && (
            <TabPanel activeTab={activeTab} tabId="employment">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EditableField
                  label="Join Date"
                  type="date"
                  value={employee.joinDate}
                  onChange={(val) => handleFieldChange('joinDate', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.joinDate}
                  required
                />
                <EditableField
                  label="Employment Type"
                  type="select"
                  value={employee.employmentType}
                  options={Object.values(EmploymentType)}
                  onChange={(val) => handleFieldChange('employmentType', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.employmentType}
                  required
                />
                <EditableField
                  label="Employment Status"
                  type="select"
                  value={employee.employmentStatus}
                  options={Object.values(EmploymentStatus)}
                  onChange={(val) => handleFieldChange('employmentStatus', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.employmentStatus}
                  required
                />
                <EditableField
                  label="Contract Start"
                  type="date"
                  value={employee.contractStart}
                  onChange={(val) => handleFieldChange('contractStart', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="Contract End"
                  type="date"
                  value={employee.contractEnd}
                  onChange={(val) => handleFieldChange('contractEnd', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="Probation Period (months)"
                  type="number"
                  value={employee.probationPeriod}
                  onChange={(val) => handleFieldChange('probationPeriod', val)}
                  editable={true}
                  editMode={editMode}
                />
              </div>
            </TabPanel>
          )}

          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <TabPanel activeTab={activeTab} tabId="organization">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EditableField
                  label="Company"
                  value={employee.company}
                  onChange={(val) => handleFieldChange('company', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.company}
                  required
                />
                <EditableField
                  label="Division"
                  value={employee.division}
                  onChange={(val) => handleFieldChange('division', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="Department"
                  type="select"
                  value={employee.department}
                  options={Object.values(Department)}
                  onChange={(val) => handleFieldChange('department', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.department}
                  required
                />
                <EditableField
                  label="Section"
                  value={employee.section}
                  onChange={(val) => handleFieldChange('section', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="Position"
                  value={employee.position}
                  onChange={(val) => handleFieldChange('position', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.position}
                  required
                />
                <EditableField
                  label="Job Level"
                  type="select"
                  value={employee.jobLevel}
                  options={Object.values(JobLevel)}
                  onChange={(val) => handleFieldChange('jobLevel', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.jobLevel}
                  required
                />
                <EditableField
                  label="Reporting Manager"
                  value={employee.reportingManager}
                  onChange={(val) => handleFieldChange('reportingManager', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="Work Location"
                  type="select"
                  value={employee.workLocation}
                  options={Object.values(WorkLocation)}
                  onChange={(val) => handleFieldChange('workLocation', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.workLocation}
                  required
                />
              </div>
            </TabPanel>
          )}

          {/* Payroll Tab */}
          {activeTab === 'payroll' && (
            <TabPanel activeTab={activeTab} tabId="payroll">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EditableField
                  label="Salary Type"
                  type="select"
                  value={employee.salaryType}
                  options={['Monthly', 'Daily', 'Hourly']}
                  onChange={(val) => handleFieldChange('salaryType', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="Basic Salary"
                  type="number"
                  value={employee.basicSalary}
                  onChange={(val) => handleFieldChange('basicSalary', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="Allowances"
                  type="number"
                  value={employee.allowances}
                  onChange={(val) => handleFieldChange('allowances', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="Bank Name"
                  value={employee.bankName}
                  onChange={(val) => handleFieldChange('bankName', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.bankName}
                />
                <EditableField
                  label="Bank Account"
                  value={employee.bankAccount}
                  onChange={(val) => handleFieldChange('bankAccount', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.bankAccount}
                />
                <EditableField
                  label="NPWP"
                  value={employee.npwp}
                  onChange={(val) => handleFieldChange('npwp', val)}
                  editable={true}
                  editMode={editMode}
                  error={errors.npwp}
                />
                <EditableField
                  label="BPJS Ketenagakerjaan"
                  value={employee.bpjsKetenagakerjaan}
                  onChange={(val) => handleFieldChange('bpjsKetenagakerjaan', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="BPJS Kesehatan"
                  value={employee.bpjsKesehatan}
                  onChange={(val) => handleFieldChange('bpjsKesehatan', val)}
                  editable={true}
                  editMode={editMode}
                />
                <EditableField
                  label="PTKP Status"
                  type="select"
                  value={employee.ptkp}
                  options={['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3']}
                  onChange={(val) => handleFieldChange('ptkp', val)}
                  editable={true}
                  editMode={editMode}
                />
              </div>
            </TabPanel>
          )}

          {/* Family Tab */}
          {activeTab === 'family' && (
            <TabPanel activeTab={activeTab} tabId="family">
              <div className="space-y-8">
                {/* Spouse */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Spouse Information</h3>
                  {employee.spouse ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <EditableField
                        label="Spouse Name"
                        value={employee.spouse.name}
                        onChange={(val) => handleNestedFieldChange('spouse', 'name', val)}
                        editable={true}
                        editMode={editMode}
                      />
                      <EditableField
                        label="NIK"
                        value={employee.spouse.nik}
                        onChange={(val) => handleNestedFieldChange('spouse', 'nik', val)}
                        editable={true}
                        editMode={editMode}
                      />
                      <EditableField
                        label="Birth Date"
                        type="date"
                        value={employee.spouse.birthDate}
                        onChange={(val) => handleNestedFieldChange('spouse', 'birthDate', val)}
                        editable={true}
                        editMode={editMode}
                      />
                      <EditableField
                        label="Occupation"
                        value={employee.spouse.occupation}
                        onChange={(val) => handleNestedFieldChange('spouse', 'occupation', val)}
                        editable={true}
                        editMode={editMode}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No spouse information</p>
                  )}
                </div>

                {/* Children */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Children</h3>
                  {employee.children && employee.children.length > 0 ? (
                    <div className="space-y-4">
                      {employee.children.map((child, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <EditableField
                              label="Child Name"
                              value={child.name}
                              editable={false}
                              editMode={editMode}
                            />
                            <EditableField
                              label="Gender"
                              value={child.gender}
                              editable={false}
                              editMode={editMode}
                            />
                            <EditableField
                              label="Birth Date"
                              type="date"
                              value={child.birthDate}
                              editable={false}
                              editMode={editMode}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No children information</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EditableField
                      label="Contact Name"
                      value={employee.emergencyContact?.name}
                      onChange={(val) => handleNestedFieldChange('emergencyContact', 'name', val)}
                      editable={true}
                      editMode={editMode}
                      error={errors['emergencyContact.name']}
                      required
                    />
                    <EditableField
                      label="Relationship"
                      value={employee.emergencyContact?.relation}
                      onChange={(val) => handleNestedFieldChange('emergencyContact', 'relation', val)}
                      editable={true}
                      editMode={editMode}
                      error={errors['emergencyContact.relation']}
                      required
                    />
                    <EditableField
                      label="Phone"
                      type="tel"
                      value={employee.emergencyContact?.phone}
                      onChange={(val) => handleNestedFieldChange('emergencyContact', 'phone', val)}
                      editable={true}
                      editMode={editMode}
                      error={errors['emergencyContact.phone']}
                      required
                    />
                    <div className="md:col-span-2 lg:col-span-4">
                      <EditableField
                        label="Address"
                        value={employee.emergencyContact?.address}
                        onChange={(val) => handleNestedFieldChange('emergencyContact', 'address', val)}
                        editable={true}
                        editMode={editMode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <TabPanel activeTab={activeTab} tabId="education">
              <div className="space-y-4">
                {employee.education && employee.education.length > 0 ? (
                  employee.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <EditableField
                          label="Degree"
                          type="select"
                          value={edu.degree}
                          options={['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3']}
                          editable={editMode}
                          editMode={editMode}
                        />
                        <EditableField
                          label="Institution"
                          value={edu.institution}
                          editable={editMode}
                          editMode={editMode}
                        />
                        <EditableField
                          label="Major"
                          value={edu.major}
                          editable={editMode}
                          editMode={editMode}
                        />
                        <EditableField
                          label="Graduation Year"
                          type="number"
                          value={edu.graduationYear}
                          editable={editMode}
                          editMode={editMode}
                        />
                        <EditableField
                          label="Certification"
                          value={edu.certification}
                          editable={editMode}
                          editMode={editMode}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No education information</p>
                )}
              </div>
            </TabPanel>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <TabPanel activeTab={activeTab} tabId="documents">
              <div className="space-y-4">
                {/* Upload Area */}
                {editMode && (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                )}

                {/* Document List */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h3>
                  {employee.documents && employee.documents.length > 0 ? (
                    employee.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600">
                            <Download className="w-4 h-4" />
                          </button>
                          {editMode && (
                            <button className="p-1.5 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-sm">No documents uploaded</p>
                  )}
                </div>
              </div>
            </TabPanel>
          )}

          {/* Career History Tab */}
          {activeTab === 'career' && (
            <TabPanel activeTab={activeTab} tabId="career">
              <div className="space-y-4">
                {employee.careerHistory && employee.careerHistory.length > 0 ? (
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {employee.careerHistory.map((career, idx) => (
                      <div key={idx} className="relative pl-10 pb-6">
                        <div className="absolute left-2.5 w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              career.type === 'Promotion' ? 'bg-emerald-50 text-emerald-700' :
                              career.type === 'Mutation' ? 'bg-blue-50 text-blue-700' :
                              career.type === 'Salary Adjustment' ? 'bg-amber-50 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {career.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {career.date ? new Date(career.date).toLocaleDateString('id-ID') : '-'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{career.description}</p>
                          {career.before && career.after && (
                            <p className="text-xs text-gray-500 mt-1">
                              {career.before} → {career.after}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No career history</p>
                )}
              </div>
            </TabPanel>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <TabPanel activeTab={activeTab} tabId="assets">
              <div className="space-y-4">
                {employee.assets && employee.assets.length > 0 ? (
                  employee.assets.map((asset, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                          <p className="text-xs text-gray-500">{asset.type} • {asset.serialNumber}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        asset.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                        asset.status === 'Returned' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {asset.status || 'Active'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No assets assigned</p>
                    {editMode && (
                      <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                        <Plus className="w-4 h-4 inline mr-2" />
                        Add Asset
                      </button>
                    )}
                  </div>
                )}
              </div>
            </TabPanel>
          )}
        </div>
      </div>
    </div>
  );
}

