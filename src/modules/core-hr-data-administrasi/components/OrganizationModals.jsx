/**
 * Organization CRUD Modal Components
 * Modals for creating, editing, and deleting organization units
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { OrganizationType } from '../services/organizationService';

/**
 * Modal Overlay Background
 */
function ModalOverlay({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
    />
  );
}

/**
 * OrganizationFormModal - Create/Edit Organization
 * 
 * Props:
 * - isOpen: Whether modal is visible
 * - onClose: Callback to close modal
 * - onSubmit: Callback with form data
 * - initialData: Initial form data (for edit)
 * - isLoading: Whether form is submitting
 * - title: Modal title
 * - parentOrganization: Parent organization info (for context)
 */
export function OrganizationFormModal({
  isOpen = false,
  onClose = () => {},
  onSubmit = () => {},
  initialData = null,
  isLoading = false,
  title = 'Create Organization Unit',
  parentOrganization = null,
  allOrganizations = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: OrganizationType.DEPARTMENT,
    parent_id: null,
    description: '',
    location: '',
    manager_id: '',
    employee_count: 0,
  });

  const [errors, setErrors] = useState({});

  // Initialize form with initial data
  useEffect(() => {
    const newFormData = { ...formData };
    let hasChanges = false;
    
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        if (formData[key] !== initialData[key]) {
          newFormData[key] = initialData[key];
          hasChanges = true;
        }
      });
    } else if (parentOrganization && formData.parent_id !== parentOrganization.id) {
      newFormData.parent_id = parentOrganization.id;
      hasChanges = true;
    } else if (!parentOrganization && !initialData) {
      if (formData.name !== '' || formData.parent_id !== null) {
        Object.assign(newFormData, {
          name: '',
          type: OrganizationType.DEPARTMENT,
          parent_id: null,
          description: '',
          location: '',
          manager_id: '',
          employee_count: 0,
        });
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      setFormData(newFormData);
    }
    setErrors({});
  }, [initialData, parentOrganization, isOpen]);

  /**
   * Handle form input change
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Organization type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await onSubmit(formData);

    if (result.success) {
      onClose();
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ModalOverlay onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Parent Organization Info */}
                {parentOrganization && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Parent Unit:</strong> {parentOrganization.name}
                    </p>
                  </div>
                )}

                {/* Error Messages */}
                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                )}

                {/* Form Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Name */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Engineering Department"
                      className={`
                        w-full px-4 py-2 rounded-lg border transition-colors
                        ${
                          errors.name
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                        }
                      `}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Organization Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className={`
                        w-full px-4 py-2 rounded-lg border transition-colors
                        ${
                          errors.type
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                        }
                      `}
                    >
                      {Object.entries(OrganizationType).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Organization description..."
                      rows="3"
                      className="
                        w-full px-4 py-2 rounded-lg border border-gray-300
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                        transition-colors
                      "
                    />
                  </div>

                  {/* Location */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="e.g., Jakarta"
                      className="
                        w-full px-4 py-2 rounded-lg border border-gray-300
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                        transition-colors
                      "
                    />
                  </div>

                  {/* Employee Count */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Employee Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.employee_count}
                      onChange={(e) =>
                        handleChange('employee_count', parseInt(e.target.value) || 0)
                      }
                      className="
                        w-full px-4 py-2 rounded-lg border border-gray-300
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                        transition-colors
                      "
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="
                      px-6 py-2 rounded-lg border border-gray-300
                      text-gray-700 font-medium hover:bg-gray-50
                      transition-colors disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="
                      px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium
                      hover:bg-indigo-700 transition-colors disabled:opacity-50
                      flex items-center gap-2
                    "
                  >
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    )}
                    {isLoading ? 'Saving...' : 'Save Organization'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * DeleteConfirmationModal - Confirm deletion
 * 
 * Props:
 * - isOpen: Whether modal is visible
 * - onClose: Callback to close modal
 * - onConfirm: Callback to confirm deletion
 * - organization: Organization to delete
 * - isLoading: Whether deleting
 */
export function DeleteConfirmationModal({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  organization = null,
  isLoading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ModalOverlay onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100"
                    >
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium mb-1">
                      Delete <strong>{organization?.name}</strong>?
                    </p>
                    <p className="text-sm text-gray-600">
                      This action cannot be undone. Make sure this organization unit has
                      no child units or employees.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="
                      px-6 py-2 rounded-lg border border-gray-300
                      text-gray-700 font-medium hover:bg-gray-50
                      transition-colors disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={onConfirm}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      px-6 py-2 rounded-lg bg-red-600 text-white font-medium
                      hover:bg-red-700 transition-colors disabled:opacity-50
                      flex items-center gap-2
                    "
                  >
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    )}
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * DetailViewModal - View organization details with hierarchy
 */
export function DetailViewModal({
  isOpen = false,
  onClose = () => {},
  organization = null,
  onEdit = () => {},
  allOrganizations = [],
}) {
  const typeConfig = {
    company: { icon: '🏢', color: 'blue', label: 'Company' },
    division: { icon: '📊', color: 'purple', label: 'Division' },
    department: { icon: '👥', color: 'indigo', label: 'Department' },
    team: { icon: '👨‍💼', color: 'emerald', label: 'Team' },
    position: { icon: '🎯', color: 'amber', label: 'Position' },
  };

  const config = typeConfig[organization?.type] || typeConfig.team;

  // Get parent organization
  const parentOrg = organization?.parent_id
    ? allOrganizations.find((o) => o.id === organization.parent_id)
    : null;

  // Get child organizations
  const childOrganizations = organization?.id
    ? allOrganizations.filter((o) => o.parent_id === organization.id)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ModalOverlay onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{config.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {organization?.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">{config.label}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📋 Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Type
                      </p>
                      <p className="text-gray-900 font-medium">
                        {organization?.type.charAt(0).toUpperCase() +
                          organization?.type.slice(1)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Location
                      </p>
                      <p className="text-gray-900 font-medium">
                        {organization?.location || '-'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Employee Count
                      </p>
                      <p className="text-gray-900 font-medium">
                        {organization?.employee_count || 0} employees
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                        Manager ID
                      </p>
                      <p className="text-gray-900 font-medium">
                        {organization?.manager_id || '-'}
                      </p>
                    </div>

                    {organization?.description && (
                      <div className="col-span-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                          Description
                        </p>
                        <p className="text-gray-900">{organization.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hierarchy Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🏗️ Hierarchy
                  </h3>
                  <div className="space-y-3">
                    {/* Parent Information */}
                    {parentOrg && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                          Parent Organization
                        </p>
                        <p className="text-gray-900 font-medium">
                          {parentOrg.icon || typeConfig[parentOrg.type]?.icon} {parentOrg.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Type: {parentOrg.type}
                        </p>
                      </div>
                    )}

                    {!parentOrg && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600">
                          ✓ This is a root organization unit
                        </p>
                      </div>
                    )}

                    {/* Children Information */}
                    {childOrganizations.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                          Sub Units ({childOrganizations.length})
                        </p>
                        <div className="space-y-2">
                          {childOrganizations.map((child) => (
                            <div
                              key={child.id}
                              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200"
                            >
                              <p className="text-gray-900 font-medium">
                                {typeConfig[child.type]?.icon} {child.name}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {child.type} • {child.employee_count || 0} employees
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {childOrganizations.length === 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-600 text-sm">
                          No sub units yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Details */}
                {organization?.created_at && (
                  <div className="border-t border-gray-200 pt-6 text-xs text-gray-500">
                    <p>
                      Created: {new Date(organization.created_at).toLocaleDateString()}
                    </p>
                    {organization?.updated_at && (
                      <p>
                        Last Updated:{' '}
                        {new Date(organization.updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex items-center justify-end gap-3 sticky bottom-0">
                <button
                  onClick={onClose}
                  className="
                    px-6 py-2 rounded-lg border border-gray-300
                    text-gray-700 font-medium hover:bg-gray-100
                    transition-colors
                  "
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onEdit();
                    onClose();
                  }}
                  className="
                    px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium
                    hover:bg-indigo-700 transition-colors
                  "
                >
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
