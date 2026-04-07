/**
 * Employee Detail ViewModel - Business Logic for Employee Detail Page
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import employeeService from '../../../services/employeeService';

/**
 * Tabs configuration
 */
export const EMPLOYEE_TABS = [
  { id: 'personal', label: 'Personal Info', icon: 'User' },
  { id: 'employment', label: 'Employment', icon: 'Briefcase' },
  { id: 'organization', label: 'Organization', icon: 'Building' },
  { id: 'payroll', label: 'Payroll', icon: 'DollarSign' },
  { id: 'family', label: 'Family', icon: 'Users' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'documents', label: 'Documents', icon: 'FileText' },
  { id: 'career', label: 'Career History', icon: 'TrendingUp' },
  { id: 'assets', label: 'Asset', icon: 'Package' }
];

/**
 * Employee Detail ViewModel Hook
 * @returns {Object} State and handlers for employee detail page
 */
export function useEmployeeDetailViewModel() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Employee data
  const [employee, setEmployee] = useState(null);
  const [originalEmployee, setOriginalEmployee] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load employee data
  const loadEmployee = useCallback(async () => {
    if (!id) {
      setLoadingError('Employee ID is required');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setLoadingError(null);
    
    try {
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
      setOriginalEmployee(JSON.parse(JSON.stringify(data)));
    } catch (err) {
      setLoadingError(err.message || 'Failed to load employee');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial load
  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    if (editMode) {
      // Cancel editing - restore original data
      setEmployee(JSON.parse(JSON.stringify(originalEmployee)));
      setErrors({});
    }
    setEditMode((current) => !current);
  }, [editMode, originalEmployee]);

  // Handle field change
  const handleFieldChange = useCallback((field, value) => {
    setEmployee(current => ({
      ...current,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(previousErrors => {
        const newErrors = { ...previousErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle nested field change (for objects like spouse, emergencyContact)
  const handleNestedFieldChange = useCallback((parentKey, field, value) => {
    setEmployee(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [field]: value
      }
    }));
    
    // Clear error for this field
    const fullFieldKey = `${parentKey}.${field}`;
    if (errors[fullFieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fullFieldKey];
        return newErrors;
      });
    }
  }, [errors]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Common required fields validation based on active tab
    switch (activeTab) {
      case 'personal':
        if (!employee.fullName?.trim()) newErrors.fullName = 'Full name is required';
        if (!employee.nik?.trim()) newErrors.nik = 'NIK is required';
        if (!employee.email?.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) newErrors.email = 'Invalid email format';
        if (!employee.phone?.trim()) newErrors.phone = 'Phone is required';
        if (!employee.birthDate) newErrors.birthDate = 'Birth date is required';
        if (!employee.gender) newErrors.gender = 'Gender is required';
        if (!employee.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
        if (!employee.address?.trim()) newErrors.address = 'Address is required';
        break;
        
      case 'employment':
        if (!employee.joinDate) newErrors.joinDate = 'Join date is required';
        if (!employee.employmentType) newErrors.employmentType = 'Employment type is required';
        if (!employee.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
        break;
        
      case 'organization':
        if (!employee.company?.trim()) newErrors.company = 'Company is required';
        if (!employee.department) newErrors.department = 'Department is required';
        if (!employee.position?.trim()) newErrors.position = 'Position is required';
        if (!employee.jobLevel) newErrors.jobLevel = 'Job level is required';
        if (!employee.workLocation) newErrors.workLocation = 'Work location is required';
        break;
        
      case 'payroll':
        if (!employee.bankName?.trim()) newErrors.bankName = 'Bank name is required';
        if (!employee.bankAccount?.trim()) newErrors.bankAccount = 'Bank account is required';
        if (!employee.npwp?.trim()) newErrors.npwp = 'NPWP is required';
        break;
        
      case 'family':
        if (employee.emergencyContact) {
          if (!employee.emergencyContact.name?.trim()) newErrors['emergencyContact.name'] = 'Emergency contact name is required';
          if (!employee.emergencyContact.relation?.trim()) newErrors['emergencyContact.relation'] = 'Relationship is required';
          if (!employee.emergencyContact.phone?.trim()) newErrors['emergencyContact.phone'] = 'Emergency phone is required';
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [employee, activeTab]);

  // Save employee data
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setSaveSuccess(false);
    
    try {
      await employeeService.updateEmployee(id, employee);
      setOriginalEmployee(JSON.parse(JSON.stringify(employee)));
      setEditMode(false);
      setSaveSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  }, [employee, id, validateForm]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    setEmployee(JSON.parse(JSON.stringify(originalEmployee)));
    setEditMode(false);
    setErrors({});
  }, [originalEmployee]);

  // Tab navigation
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Go back to employee list
  const handleGoBack = useCallback(() => {
    navigate('/employees');
  }, [navigate]);

  return {
    // Data
    employee,
    loading,
    loadingError,
    
    // UI state
    activeTab,
    editMode,
    errors,
    saving,
    saveSuccess,
    tabs: EMPLOYEE_TABS,
    
    // Handlers
    loadEmployee,
    toggleEditMode,
    handleFieldChange,
    handleNestedFieldChange,
    handleSave,
    handleCancel,
    handleTabChange,
    handleGoBack,
    
    // Validation
    validateForm
  };
}

export default useEmployeeDetailViewModel;

