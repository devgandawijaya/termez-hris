/**
 * Employee Database Page - Enterprise HRIS Employee List
 * With 4 Summary Cards and Enterprise Data Table
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import EmployeeTable from '../components/EmployeeTable';
import useEmployeeDatabaseViewModel from '../viewmodels/useEmployeeDatabaseViewModel';
import { createBadge } from '../components/SummaryCard';

export default function EmployeeDatabasePage() {
  const navigate = useNavigate();
  
  const {
    employees,
    stats,
    filterOptions,
    loading,
    loadingStats,
    error,
    searchQuery,
    filters,
    sortConfig,
    pagination,
    handleSearch,
    handleFilterChange,
    handleSort,
    handlePageChange,
    handleRefresh,
    clearFilters,
    hasActiveFilters,
    totalActiveEmployees,
    totalInactiveEmployees
  } = useEmployeeDatabaseViewModel();

  // Handle row click - navigate to detail page
  const handleRowClick = (employee) => {
    navigate(`/employee/${employee.id}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return 'Rp ' + amount.toLocaleString('id-ID', { maximumFractionDigits: 0 });
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Employee Database</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and view all employee information</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Refresh Data
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
              + Add Employee
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Total Employee */}
          <SummaryCard
            title="Total Employee"
            value={stats?.total?.employees || 0}
            subtitle="Active workforce"
            icon="users"
            color="indigo"
            index={0}
            badge={[
              createBadge('Active', totalActiveEmployees, 'green'),
              createBadge('Inactive', totalInactiveEmployees, 'gray')
            ]}
          />

          {/* Card 2: Employment Status */}
          <SummaryCard
            title="Employment Status"
            value={(stats?.employmentStatus?.permanent || 0) + (stats?.employmentStatus?.contract || 0)}
            subtitle="Active workforce"
            icon="briefcase"
            color="emerald"
            index={1}
            badge={[
              createBadge('Permanent', stats?.employmentStatus?.permanent || 0, 'green'),
              createBadge('Contract', stats?.employmentStatus?.contract || 0, 'blue'),
              createBadge('Probation', stats?.employmentStatus?.probation || 0, 'yellow')
            ]}
          />

          {/* Card 3: Department Distribution */}
          <SummaryCard
            title="Department Distribution"
            value={stats?.department?.total || 0}
            subtitle="Active departments"
            icon="building"
            color="amber"
            index={2}
            badge={[
              createBadge('Largest', stats?.department?.largest?.name?.split(' ')[0] || '-', 'green'),
              createBadge('Employees', stats?.department?.largest?.count || 0, 'gray')
            ]}
          />

          {/* Card 4: Payroll Overview */}
          <SummaryCard
            title="Payroll Overview"
            value={stats?.payroll?.headcount || 0}
            subtitle="Total gross salary"
            icon="dollar"
            color="purple"
            index={3}
            badge={[
              createBadge('Est. Total', formatCurrency(stats?.payroll?.grossSalary || 0), 'green')
            ]}
          />
        </div>

        {/* Employee Table */}
        {error ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
            <div className="text-red-500 mb-2">Error loading employees</div>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            loading={loading}
            pagination={pagination}
            sortConfig={sortConfig}
            filters={filters}
            filterOptions={filterOptions}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onSort={handleSort}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            onRowClick={handleRowClick}
            onRefresh={handleRefresh}
          />
        )}
      </div>
    </div>
  );
}

