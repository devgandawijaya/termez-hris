import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Users,
  Filter,
  Download,
} from 'lucide-react';

// color badge helper
function StatusBadge({ status }) {
  const statusConfig = {
    Active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    Probation: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    Contract: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    'On Leave': { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    Resigned: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' },
    Terminated: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    Retired: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    Suspended: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  };
  const config = statusConfig[status] || statusConfig.Active;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
      {status}
    </span>
  );
}

export default function EmploymentStatusTable({
  data = [],
  loading = false,
  sortConfig = {},
  filters = {},
  filterOptions = {},
  searchQuery = '',
  onSearch,
  onSort,
  onFilterChange,
  onRefresh,
  onViewProfile,
  onEditRecord,
  onUpdateStatus,
  onDelete,
}) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const columns = [
    { key: 'name', label: 'Employee Name', sortable: true, width: 'w-48' },
    { key: 'employeeId', label: 'Employee ID', sortable: true, width: 'w-28' },
    { key: 'department', label: 'Department', sortable: true, width: 'w-36' },
    { key: 'position', label: 'Position', sortable: true, width: 'w-40' },
    { key: 'employmentType', label: 'Employment Type', sortable: true, width: 'w-28' },
    { key: 'currentStatus', label: 'Current Status', sortable: true, width: 'w-28' },
    { key: 'startDate', label: 'Start Date', sortable: true, width: 'w-24' },
    { key: 'endDate', label: 'End Date', sortable: true, width: 'w-24' },
    { key: 'lastUpdate', label: 'Last Status Update', sortable: true, width: 'w-32' },
    { key: 'statusDuration', label: 'Status Duration', sortable: true, width: 'w-24' },
    { key: 'tenure', label: 'Tenure', sortable: true, width: 'w-24' },
    { key: 'actions', label: 'Action', sortable: false, width: 'w-32' },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.sortBy !== columnKey) {
      return <div className="w-4 h-4 flex items-center justify-center text-gray-300">↕</div>;
    }
    return sortConfig.sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-indigo-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-indigo-600" />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilterPanel || Object.values(filters).some((v) => v)
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {Object.values(filters).some((v) => v) && (
              <span className="ml-2 px-1.5 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                {Object.values(filters).filter((v) => v).length}
              </span>
            )}
          </button>
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
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
                  {filterOptions.departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => onFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  {filterOptions.statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.employmentType}
                  onChange={(e) => onFilterChange('employmentType', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Types</option>
                  {filterOptions.employmentTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {/* date range, etc... */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.width} px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-$
                    {col.sortable ? 'pointer' : 'default'}
                  `}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.employeeId}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.department}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.position}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.employmentType}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <StatusBadge status={row.currentStatus} />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(row.startDate)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(row.endDate)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(row.lastUpdate)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.statusDuration}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.tenure}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => onViewProfile(row)} className="text-blue-500 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onEditRecord(row)} className="text-indigo-500 hover:text-indigo-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => onUpdateStatus(row)} className="text-yellow-500 hover:text-yellow-700">
                        {/* maybe icon change */}
                        <Users className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(row)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* pagination could go here if necessary */}
    </div>
  );
}
