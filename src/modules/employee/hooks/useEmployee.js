/**
 * useEmployee Hook - Business logic for employee management
 * Clean separation of concerns - logic tidak di component
 */

import { useState, useEffect, useCallback } from 'react';
import employeeService from '../services/employeeService';
import excelService from '../services/excelService';
import { validateEmployee, validateBatchImport } from '../utils/validation';

/**
 * Main useEmployee hook for employee CRUD operations
 */
export const useEmployee = () => {
  // Data state
  const [employees, setEmployees] = useState([]);
  const [currentEmployee] = useState(null);
  const [stats, setStats] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    statuses: [],
    locations: [],
    employmentTypes: []
  });
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [saving] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    location: '',
    employmentType: ''
  });
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'fullName',
    sortOrder: 'asc'
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0
  });

  // Load filter options
  const loadFilterOptions = useCallback(async () => {
    try {
      const options = await employeeService.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  }, []);

  // Load employees
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        search: searchQuery,
        department: filters.department,
        status: filters.status,
        location: filters.location,
        employmentType: filters.employmentType,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await employeeService.getEmployees(params);
      setEmployees(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
    } catch (err) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sortConfig, pagination.page, pagination.limit]);

  // Load stats
  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const statsData = await employeeService.getEmployeeStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadFilterOptions();
    loadEmployees();
    loadStats();
  }, [loadEmployees, loadFilterOptions, loadStats]);

  // Reload when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, filters, sortConfig, pagination.page, loadEmployees]);

  // Handlers
  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSort = useCallback((column) => {
    setSortConfig(prev => ({
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleRefresh = useCallback(() => {
    loadEmployees();
    loadStats();
  }, [loadEmployees, loadStats]);

  const clearFilters = useCallback(() => {
    setFilters({
      department: '',
      status: '',
      location: '',
      employmentType: ''
    });
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const hasActiveFilters = searchQuery || filters.department || filters.status || filters.location || filters.employmentType;

  return {
    // Data
    employees,
    currentEmployee,
    stats,
    filterOptions,
    
    // Loading states
    loading,
    loadingStats,
    saving,
    
    // Error
    error,
    
    // Filter & Search state
    searchQuery,
    filters,
    sortConfig,
    pagination,
    
    // Handlers
    loadEmployees,
    loadStats,
    handleSearch,
    handleFilterChange,
    handleSort,
    handlePageChange,
    handleRefresh,
    clearFilters,
    
    // Computed
    hasActiveFilters
  };
};

/**
 * useEmployeeForm hook - untuk create/edit employee
 */
export const useEmployeeForm = (existingEmployees = []) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nik: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    jobLevel: '',
    employmentType: 'Permanent',
    joinDate: '',
    workLocation: '',
    salary: '',
    reportingManager: ''
  });
  
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [nikChecking, setNikChecking] = useState(false);
  const [nikExists, setNikExists] = useState(false);

  // Check NIK exists
  const checkNIK = useCallback(async (nik) => {
    setNikChecking(true);
    try {
      const exists = await employeeService.checkNIKExists(nik);
      setNikExists(exists);
      if (exists) {
        setErrors(prev => ({ ...prev, nik: 'NIK already exists in database' }));
      }
    } catch (err) {
      console.error('Error checking NIK:', err);
    } finally {
      setNikChecking(false);
    }
  }, []);

  // Handle field change
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Check NIK duplicate when nik field changes
    if (field === 'nik' && value) {
      checkNIK(value);
    }
  }, [checkNIK, errors]);

  // Validate form
  const validateForm = useCallback(() => {
    const { errors: validationErrors, isValid } = validateEmployee(
      formData, 
      existingEmployees
    );
    setErrors(validationErrors);
    return isValid;
  }, [formData, existingEmployees]);

  // Save employee
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return { success: false, errors };
    }
    
    if (nikExists) {
      return { success: false, errors: { ...errors, nik: 'NIK already exists' } };
    }
    
    setSaving(true);
    try {
      const result = await employeeService.createEmployee(formData);
      setSaving(false);
      return { success: true, data: result };
    } catch (err) {
      setSaving(false);
      return { success: false, errors: { submit: err.message } };
    }
  }, [formData, validateForm, nikExists, errors]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      fullName: '',
      nik: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      jobLevel: '',
      employmentType: 'Permanent',
      joinDate: '',
      workLocation: '',
      salary: '',
      reportingManager: ''
    });
    setErrors({});
    setNikExists(false);
  }, []);

  return {
    formData,
    errors,
    saving,
    nikChecking,
    nikExists,
    handleFieldChange,
    validateForm,
    handleSave,
    resetForm,
    setFormData
  };
};

/**
 * useExcelImport hook - untuk handle import Excel
 */
export const useExcelImport = (existingEmployees = []) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream'
    ];
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(selectedFile.type) && !['xlsx', 'xls'].includes(extension)) {
      setError('Invalid file type. Please upload .xlsx or .xls file');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setLoading(true);
    setValidationResult(null);
    setImportResult(null);
    
    try {
      const data = await excelService.parseExcel(selectedFile);
      setParsedData(data);
      
      // Validate the data
      const result = validateBatchImport(data, existingEmployees);
      setValidationResult(result);
    } catch (err) {
      setError(err.message || 'Failed to parse Excel file');
    } finally {
      setLoading(false);
    }
  }, [existingEmployees]);

  // Submit all valid data
  const handleSubmitAll = useCallback(async () => {
    if (!validationResult || validationResult.valid.length === 0) {
      return;
    }
    
    setImporting(true);
    setError(null);
    
    try {
      const result = await employeeService.bulkInsertEmployees(validationResult.valid);
      setImportResult(result);
      
      // Clear file after successful import
      if (result.errors.length === 0) {
        setFile(null);
        setParsedData([]);
        setValidationResult(null);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to import employees');
    } finally {
      setImporting(false);
    }
  }, [validationResult]);

  // Cancel import
  const handleCancel = useCallback(() => {
    setFile(null);
    setParsedData([]);
    setValidationResult(null);
    setImportResult(null);
    setError(null);
  }, []);

  // Download template
  const handleDownloadTemplate = useCallback(() => {
    excelService.generateTemplate();
  }, []);

  return {
    file,
    parsedData,
    validationResult,
    importing,
    importResult,
    loading,
    error,
    handleFileSelect,
    handleSubmitAll,
    handleCancel,
    handleDownloadTemplate
  };
};

export default {
  useEmployee,
  useEmployeeForm,
  useExcelImport
};

