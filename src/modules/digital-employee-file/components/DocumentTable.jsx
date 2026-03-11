/**
 * DocumentTable - Table component for displaying contract documents
 * Features: Search, Sorting, Pagination, Filter, Actions
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ChevronUp,
  ChevronDown,
  FileText,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';

const DocumentTable = ({ 
  documents = [], 
  loading = false,
  pagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
  onPageChange,
  onSort,
  sortBy = 'uploadedAt',
  sortOrder = 'desc',
  onView,
  onEdit,
  onDelete,
  onDownload
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    employeeName: '',
    documentType: '',
    status: '',
    startDateFrom: '',
    startDateTo: '',
    endDateFrom: '',
    endDateTo: ''
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      employeeName: '',
      documentType: '',
      status: '',
      startDateFrom: '',
      startDateTo: '',
      endDateFrom: '',
      endDateTo: ''
    });
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(val => val !== '');
  }, [filters]);

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    let result = [...documents];
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(doc => 
        doc.employeeName?.toLowerCase().includes(search) ||
        doc.employeeNik?.toLowerCase().includes(search) ||
        doc.documentTitle?.toLowerCase().includes(search) ||
        doc.documentType?.toLowerCase().includes(search) ||
        doc.employeePosition?.toLowerCase().includes(search)
      );
    }
    
    // Apply filters
    if (filters.employeeName) {
      result = result.filter(doc => 
        doc.employeeName?.toLowerCase().includes(filters.employeeName.toLowerCase())
      );
    }
    
    if (filters.documentType) {
      result = result.filter(doc => doc.documentType === filters.documentType);
    }
    
    if (filters.status) {
      result = result.filter(doc => doc.status === filters.status);
    }
    
    // Date range filters
    if (filters.startDateFrom) {
      result = result.filter(doc => 
        doc.contractStartDate && new Date(doc.contractStartDate) >= new Date(filters.startDateFrom)
      );
    }
    
    if (filters.startDateTo) {
      result = result.filter(doc => 
        doc.contractStartDate && new Date(doc.contractStartDate) <= new Date(filters.startDateTo)
      );
    }
    
    if (filters.endDateFrom) {
      result = result.filter(doc => 
        doc.contractEndDate && new Date(doc.contractEndDate) >= new Date(filters.endDateFrom)
      );
    }
    
    if (filters.endDateTo) {
      result = result.filter(doc => 
        doc.contractEndDate && new Date(doc.contractEndDate) <= new Date(filters.endDateTo)
      );
    }
    
    return result;
  }, [documents, searchTerm, filters]);

  // Handle sort
  const handleSort = (column) => {
    if (onSort) {
      onSort(column, sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  // Sort icon component
  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  // Table header columns
  const columns = [
    { key: 'employeeName', label: 'Karyawan', sortable: true },
    { key: 'documentTitle', label: 'Judul Dokumen', sortable: true },
    { key: 'documentType', label: 'Jenis Dokumen', sortable: true },
    { key: 'contractStartDate', label: 'Mulai Kontrak', sortable: true },
    { key: 'contractEndDate', label: 'Berakhir', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Aksi', sortable: false }
  ];

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Filter dropdown animation
  const filterVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto' },
    exit: { opacity: 0, y: -10, height: 0 }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header with Search */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Filter Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-2 text-sm rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Employee Name Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nama Karyawan</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={filters.employeeName}
                    onChange={handleFilterChange}
                    placeholder="Cari nama karyawan..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Document Type Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Dokumen</label>
                  <select
                    name="documentType"
                    value={filters.documentType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Semua Jenis</option>
                    <option value="Kontrak Kerja">Kontrak Kerja</option>
                    <option value="Perpanjangan Kontrak">Perpanjangan Kontrak</option>
                    <option value="Kontrak Probation">Kontrak Probation</option>
                    <option value="Perubahan Kontrak">Perubahan Kontrak</option>
                    <option value="Kontrak Outsourcing">Kontrak Outsourcing</option>
                    <option value="Kontrak Part-Time">Kontrak Part-Time</option>
                    <option value="Kontrak Freelance">Kontrak Freelance</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status Dokumen</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Semua Status</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rentang Tanggal Mulai</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      name="startDateFrom"
                      value={filters.startDateFrom}
                      onChange={handleFilterChange}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Dari"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="date"
                      name="startDateTo"
                      value={filters.startDateTo}
                      onChange={handleFilterChange}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Sampai"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={resetFilters}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Terapkan Filter
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon column={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">Data tidak ditemukan</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {hasActiveFilters || searchTerm 
                          ? 'Coba ubah filter atau kata kunci pencarian' 
                          : 'Tambahkan dokumen kontrak baru'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <motion.tr
                    key={doc.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.employeeName}</p>
                        <p className="text-xs text-gray-500">{doc.employeeNik}</p>
                        <p className="text-xs text-gray-400">{doc.employeePosition}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 max-w-xs truncate" title={doc.documentTitle}>
                        {doc.documentTitle}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {doc.contractStartDate ? new Date(doc.contractStartDate).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {doc.contractEndDate ? new Date(doc.contractEndDate).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* View Button */}
                        <button
                          onClick={() => onView?.(doc)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Lihat"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => onEdit?.(doc)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        {/* Download Button */}
                        <button
                          onClick={() => onDownload?.(doc)}
                          className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete?.(doc)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredDocuments.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-gray-500">
            Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {filteredDocuments.length} data
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Numbers */}
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
                    onClick={() => onPageChange?.(pageNum)}
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
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTable;

