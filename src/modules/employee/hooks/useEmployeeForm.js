/**
 * useEmployeeForm Hook - Custom hook for multi-tab employee form
 * Enterprise style with separated state structure
 */

import { useState, useCallback, useEffect } from 'react';
import employeeService from '../services/employeeService';
import { validateEmployeeForm, getFirstErrorTab } from '../utils/employeeValidation';

/**
 * Generate Employee ID
 */
const generateEmployeeId = () => {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `EMP-${random}`;
};

/**
 * Initial form state structure
 */
const getInitialFormState = () => ({
  personal: {
    fullName: '',
    nik: '',
    email: '',
    phone: '',
    gender: '',
    placeOfBirth: '',
    birthDate: '',
    maritalStatus: '',
    address: '',
    nationalIdNumber: '',
    npwp: ''
  },
  employment: {
    employeeId: generateEmployeeId(),
    employmentType: 'Permanent',
    joinDate: '',
    probationEndDate: '',
    employmentStatus: 'Active',
    workLocation: 'Jakarta HQ',
    workSchedule: 'Monday-Friday',
    contractStart: '',
    contractEnd: ''
  },
  organization: {
    department: '',
    position: '',
    jobLevel: '',
    manager: '',
    division: '',
    directSupervisor: ''
  },
  payroll: {
    basicSalary: '',
    allowance: '',
    bankName: '',
    bankAccountNumber: '',
    taxStatus: 'TK/0',
    bpjsNumber: ''
  },
  family: {
    emergencyContact: {
      name: '',
      relation: '',
      phone: '',
      address: ''
    },
    numberOfDependents: '0'
  },
  education: [],
  documents: {
    ktp: null,
    npwp: null,
    contract: null,
    cv: null
  },
  careerHistory: [],
  assets: []
});

/**
 * useEmployeeForm hook
 */
export const useEmployeeForm = (existingEmployees = []) => {
  // Form state - structured by section
  const [formData, setFormData] = useState(getInitialFormState);
  
  // Errors state
  const [errors, setErrors] = useState({});
  
  // Active tab
  const [activeTab, setActiveTab] = useState('personal');
  
  // Loading states
  const [saving, setSaving] = useState(false);
  const [nikChecking, setNikChecking] = useState(false);
  const [nikExists, setNikExists] = useState(false);
  
  // Success state
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check NIK when it changes
  useEffect(() => {
    const checkNIK = async () => {
      if (formData.personal.nik && formData.personal.nik.length >= 6) {
        setNikChecking(true);
        try {
          const exists = await employeeService.checkNIKExists(formData.personal.nik);
          setNikExists(exists);
        } catch (err) {
          console.error('Error checking NIK:', err);
        } finally {
          setNikChecking(false);
        }
      } else {
        setNikExists(false);
      }
    };
    
    const timer = setTimeout(checkNIK, 500);
    return () => clearTimeout(timer);
  }, [formData.personal.nik]);

  // Handle field change for any section
  const handleFieldChange = useCallback((section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error for this field
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle nested field change (e.g., emergencyContact.name)
  const handleNestedFieldChange = useCallback((section, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subField]: value
      }
    }));
    
    // Clear error for this field
    const errorKey = `${section}.${subField}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle array field change (for education, careerHistory, assets)
  const handleArrayFieldChange = useCallback((section, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = {
        ...newArray[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: newArray
      };
    });
  }, []);

  // Handle add item to array
  const handleAddArrayItem = useCallback((section, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultItem]
    }));
  }, []);

  // Handle remove item from array
  const handleRemoveArrayItem = useCallback((section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  }, []);

  // Handle document upload
  const handleDocumentUpload = useCallback((docType, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file
      }
    }));
  }, []);

  // Handle document remove
  const handleDocumentRemove = useCallback((docType) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: null
      }
    }));
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const { isValid, errors: validationErrors } = validateEmployeeForm(formData, existingEmployees);
    setErrors(validationErrors);
    
    // If not valid, switch to first error tab
    if (!isValid) {
      const firstErrorTab = getFirstErrorTab(validationErrors);
      setActiveTab(firstErrorTab);
    }
    
    return isValid;
  }, [formData, existingEmployees]);

  // Save employee
  const handleSave = useCallback(async (submitType = 'submit') => {
    // Validate first
    if (!validateForm()) {
      return { success: false, errors, message: 'Please fill in all required fields' };
    }
    
    // Check NIK
    if (nikExists) {
      return { success: false, errors: { 'personal.nik': 'NIK already exists' }, message: 'NIK already exists' };
    }
    
    setSaving(true);
    try {
      // Flatten the form data for API
      const employeeData = {
        ...formData.personal,
        ...formData.employment,
        ...formData.organization,
        ...formData.payroll,
        emergencyContact: formData.family.emergencyContact,
        education: formData.education,
        documents: formData.documents,
        careerHistory: formData.careerHistory,
        assets: formData.assets,
        basicSalary: parseInt(formData.payroll.basicSalary) || 0,
        allowance: parseInt(formData.payroll.allowance) || 0,
        numberOfDependents: parseInt(formData.family.numberOfDependents) || 0
      };
      
      const result = await employeeService.createEmployee(employeeData);
      setSaving(false);
      setSaveSuccess(true);
      
      return { success: true, data: result, submitType };
    } catch (err) {
      setSaving(false);
      return { success: false, errors: { submit: err.message }, message: err.message };
    }
  }, [formData, validateForm, nikExists, errors]);

  // Save draft (don't validate required fields)
  const handleSaveDraft = useCallback(async () => {
    setSaving(true);
    try {
      const employeeData = {
        ...formData.personal,
        ...formData.employment,
        ...formData.organization,
        ...formData.payroll,
        employmentStatus: 'Inactive',
        emergencyContact: formData.family.emergencyContact,
        education: formData.education,
        documents: formData.documents,
        careerHistory: formData.careerHistory,
        assets: formData.assets,
        basicSalary: parseInt(formData.payroll.basicSalary) || 0,
        allowance: parseInt(formData.payroll.allowance) || 0,
        numberOfDependents: parseInt(formData.family.numberOfDependents) || 0
      };
      
      const result = await employeeService.createEmployee(employeeData);
      setSaving(false);
      setSaveSuccess(true);
      
      return { success: true, data: result };
    } catch (err) {
      setSaving(false);
      return { success: false, errors: { submit: err.message }, message: err.message };
    }
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(getInitialFormState());
    setErrors({});
    setActiveTab('personal');
    setSaveSuccess(false);
  }, []);

  // Tab change handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  return {
    // Form data
    formData,
    
    // Errors
    errors,
    
    // Active tab
    activeTab,
    
    // Loading states
    saving,
    nikChecking,
    nikExists,
    saveSuccess,
    
    // Field handlers
    handleFieldChange,
    handleNestedFieldChange,
    handleArrayFieldChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleDocumentUpload,
    handleDocumentRemove,
    
    // Form handlers
    validateForm,
    handleSave,
    handleSaveDraft,
    resetForm,
    handleTabChange,
    
    // Setters
    setFormData,
    setErrors,
    setActiveTab
  };
};

export default useEmployeeForm;

