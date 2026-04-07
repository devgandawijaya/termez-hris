/**
 * Employee Database ViewModel - Business Logic for Employee List Page
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import employeeService from '../../../services/employeeService';

/**
 * Employee Database ViewModel Hook
 * @returns {Object} State and handlers for employee database page
 */
export function useEmployeeDatabaseViewModel() {
  // Data state
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    statuses: [],
    locations: [],
    employmentTypes: []
  });
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  
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

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await employeeService.getFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    loadFilterOptions();
  }, []);

  // Load employees with filters, sorting, pagination
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
    loadEmployees();
    loadStats();
  }, [loadEmployees, loadStats]);

  // Reload when filters change (debounced search)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, filters, sortConfig, pagination.page, loadEmployees]);

  // Handlers
  const handleSearch = useCallback((value) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
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

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return searchQuery || filters.department || filters.status || filters.location || filters.employmentType;
  }, [searchQuery, filters]);

  const totalActiveEmployees = stats?.total?.active || 0;
  const totalInactiveEmployees = stats?.total?.inactive || 0;

  return {
    // Data
    employees,
    stats,
    filterOptions,
    
    // Loading states
    loading,
    loadingStats,
    
    // Error
    error,
    
    // Filter & Search state
    searchQuery,
    filters,
    sortConfig,
    pagination,
    
    // Handlers
    handleSearch,
    handleFilterChange,
    handleSort,
    handlePageChange,
    handleRefresh,
    clearFilters,
    
    // Computed
    hasActiveFilters,
    totalActiveEmployees,
    totalInactiveEmployees
  };
}

export default useEmployeeDatabaseViewModel;

