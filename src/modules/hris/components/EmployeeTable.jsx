/**
 * Employee Table Component - Enterprise Data Table
 * With search, pagination, sorting, and filtering
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  X,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

/**
 * Status badge component
 */
function StatusBadge({ status }) {
  const statusConfig = {
    Active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500'
    },
    Inactive: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      dot: 'bg-gray-400'
    },
    Probation: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500'
    },
    Contract: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500'
    },
    Resigned: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      dot: 'bg-rose-500'
    },
    Terminated: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-500'
    }
  };
  
  const config = statusConfig[status] || statusConfig.Inactive;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
      {status}
    </span>
  );
}

/**
 * Employee Table Component
 */
export default function EmployeeTable({
  employees = [],
  loading = false,
  pagination = { page: 1, limit: 30, total: 0, totalPages: 0 },
  sortConfig = { sortBy: 'fullName', sortOrder: 'asc' },
  filters = { department: '', status: '', location: '', employmentType: '' },
  filterOptions = { departments: [], statuses: [], locations: [], employmentTypes: [] },
  searchQuery = '',
  onSearch,
  onSort,
  onPageChange,
  onFilterChange,
  onRowClick,
  onRefresh,
  showFilters = true
}) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Table columns configuration
  const columns = [
    { key: 'employeeId', label: 'Employee ID', sortable: true, width: 'w-28' },
    { key: 'fullName', label: 'Full Name', sortable: true, width: 'w-44' },
    { key: 'nik', label: 'NIK', sortable: true, width: 'w-32' },
    { key: 'department', label: 'Department', sortable: true, width: 'w-36' },
    { key: 'position', label: 'Position', sortable: true, width: 'w-40' },
    { key: 'jobLevel', label: 'Job Level', sortable: true, width: 'w-28' },
    { key: 'employmentType', label: 'Type', sortable: true, width: 'w-24' },
    { key: 'joinDate', label: 'Join Date', sortable: true, width: 'w-28' },
    { key: 'workLocation', label: 'Location', sortable: true, width: 'w-32' },
    { key: 'reportingManager', label: 'Manager', sortable: true, width: 'w-36' },
    { key: 'email', label: 'Email', sortable: false, width: 'w-48' },
    { key: 'phone', label: 'Phone', sortable: false, width: 'w-32' },
    { key: 'employmentStatus', label: 'Status', sortable: true, width: 'w-24' },
    { key: 'actions', label: 'Action', sortable: false, width: 'w-20' }
  ];

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (sortConfig.sortBy !== columnKey) {
      return <div className="w-4 h-4 flex items-center justify-center text-gray-300">↕</div>;
    }
    return sortConfig.sortOrder === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-indigo-600" />
      : <ChevronDown className="w-4 h-4 text-indigo-600" />;
  };

  // Clear filter
  const clearFilter = (key) => {
    onFilterChange(key, '');
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFilterChange('department', '');
    onFilterChange('status', '');
    onFilterChange('location', '');
    onFilterChange('employmentType', '');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header with Search & Filters */}
      <div className="p-4 border-b border-gray-100">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, NIK, employee ID..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilterPanel || Object.values(filters).some(v => v)
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {Object.values(filters).some(v => v) && (
              <span className="ml-2 px-1.5 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
          
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
        
        {/* Filter Panel */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <select
                  value={filters.department}
                  onChange={(e) => onFilterChange('department', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Departments</option>
                  {filterOptions.departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                
                <select
                  value={filters.status}
                  onChange={(e) => onFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                
                <select
                  value={filters.location}
                  onChange={(e) => onFilterChange('location', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Locations</option>
                  {filterOptions.locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                
                <select
                  value={filters.employmentType}
                  onChange={(e) => onFilterChange('employmentType', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  {filterOptions.employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                {Object.values(filters).some(v => v) && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${col.width} ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No employees found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                  onClick={() => onRowClick(employee)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {employee.employeeId}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={employee.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.fullName}`}
                        alt={employee.fullName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="text-sm font-medium text-gray-900">{employee.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                    {employee.nik}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {employee.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {employee.position}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {employee.jobLevel}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {employee.employmentType}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(employee.joinDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {employee.workLocation}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {employee.reportingManager}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="truncate block max-w-[180px]" title={employee.email}>
                      {employee.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {employee.phone}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={employee.employmentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick(employee);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} employees
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

