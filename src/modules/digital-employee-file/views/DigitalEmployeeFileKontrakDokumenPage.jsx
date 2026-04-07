/**
 * DigitalEmployeeFileKontrakDokumenPage - Main page for Contract Document Management
 * Features: CRUD operations, Search, Sort, Pagination, File Upload
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  X, 
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Eye,
  Edit2,
  Trash2,
  Download,
  Upload,
  ChevronLeft
} from 'lucide-react';

import DocumentTable from '../components/DocumentTable';
import DocumentForm from '../components/DocumentForm';
import digitalEmployeeFileService from '../services/digitalEmployeeFileService';

const DigitalEmployeeFileKontrakDokumenPage = () => {
  // State management
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // UI State
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  
  // Pagination & Sort
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Notifications
  const [notification, setNotification] = useState(null);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [docsData, employeesData, typesData] = await Promise.all([
        digitalEmployeeFileService.getDocuments({ page: 1, limit: 10 }),
        digitalEmployeeFileService.getEmployeesForSelect(),
        Promise.resolve(digitalEmployeeFileService.getDocumentTypeOptions())
      ]);
      
      setDocuments(docsData.data);
      setPagination(docsData.pagination);
      setEmployees(employeesData);
      setDocumentTypes(typesData);
    } catch (error) {
      showNotification('error', 'Gagal memuat data');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load documents
  const loadDocuments = useCallback(async () => {
    try {
      const result = await digitalEmployeeFileService.getDocuments({
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder
      });
      setDocuments(result.data);
      setPagination(prev => ({ ...prev, ...result.pagination }));
    } catch {
      showNotification('error', 'Gagal memuat dokumen');
    }
  }, [pagination.page, pagination.limit, sortBy, sortOrder]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load documents when pagination/sort changes
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle sort
  const handleSort = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingDocument(null);
    setShowModal(true);
  };

  // Handle edit
  const handleEdit = (doc) => {
    setEditingDocument(doc);
    setShowModal(true);
  };

  // Handle view
  const handleView = (doc) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  // Handle delete
  const handleDelete = (doc) => {
    setSelectedDocument(doc);
    setShowDeleteModal(true);
  };

  // Handle download
  const handleDownload = (doc) => {
    // Simulate download
    showNotification('success', `Mengunduh ${doc.fileName}...`);
  };

  // Handle form submit
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingDocument) {
        // Update
        await digitalEmployeeFileService.updateDocument(editingDocument.id, formData);
        showNotification('success', 'Dokumen berhasil diperbarui');
      } else {
        // Create
        await digitalEmployeeFileService.createDocument(formData);
        showNotification('success', 'Dokumen berhasil ditambahkan');
      }
      
      setShowModal(false);
      loadDocuments();
    } catch (error) {
      showNotification('error', 'Gagal menyimpan dokumen');
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      await digitalEmployeeFileService.deleteDocument(selectedDocument.id);
      showNotification('success', 'Dokumen berhasil dihapus');
      setShowDeleteModal(false);
      setSelectedDocument(null);
      loadDocuments();
    } catch (error) {
      showNotification('error', 'Gagal menghapus dokumen');
      console.error('Delete error:', error);
    }
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Animation */}
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <div className="mb-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-2">
              <span>Features</span> {'>'} 
              <span className="ml-2">Core HR (Data & Administrasi)</span> {'>'} 
              <span className="ml-2 font-medium text-gray-900">Digital Employee File Kontrak Dokumen</span>
            </nav>
            
            {/* Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Digital Employee File - Kontrak Dokumen
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Kelola dokumen kontrak karyawan secara digital
                </p>
              </div>
              
              {/* Add Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddNew}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Dokumen
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Dokumen', value: pagination.total, icon: FileText, color: 'indigo' },
              { label: 'Aktif', value: documents.filter(d => d.status === 'Active').length, icon: CheckCircle, color: 'emerald' },
              { label: 'Expired', value: documents.filter(d => d.status === 'Expired').length, icon: AlertCircle, color: 'amber' },
              { label: 'Bulan Ini', value: documents.length, icon: Upload, color: 'blue' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Document Table */}
          <DocumentTable
            documents={documents}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        </motion.div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {editingDocument ? 'Edit Dokumen Kontrak' : 'Tambah Dokumen Kontrak'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {editingDocument ? 'Perbarui informasi dokumen kontrak' : 'Upload dokumen kontrak karyawan baru'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                  <DocumentForm
                    employees={employees}
                    documentTypes={documentTypes}
                    initialData={editingDocument}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowModal(false)}
                    loading={submitting}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Modal */}
        <AnimatePresence>
          {showViewModal && selectedDocument && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowViewModal(false)}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Detail Dokumen</h2>
                      <p className="text-sm text-gray-500">{selectedDocument.documentType}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Karyawan</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDocument.employeeName}</p>
                      <p className="text-xs text-gray-500">{selectedDocument.employeeNik}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Posisi</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDocument.employeePosition}</p>
                      <p className="text-xs text-gray-500">{selectedDocument.employeeDepartment}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500 uppercase">Judul Dokumen</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDocument.documentTitle}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Mulai Kontrak</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedDocument.contractStartDate ? new Date(selectedDocument.contractStartDate).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Berakhir</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedDocument.contractEndDate ? new Date(selectedDocument.contractEndDate).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500 uppercase">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedDocument.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {selectedDocument.status}
                    </span>
                  </div>
                  
                  {selectedDocument.description && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-500 uppercase">Keterangan</p>
                      <p className="text-sm text-gray-700">{selectedDocument.description}</p>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500 uppercase">File</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDocument.fileName}</p>
                    <p className="text-xs text-gray-500">Diupload pada {selectedDocument.uploadedAt} oleh {selectedDocument.uploadedBy}</p>
                  </div>
                </div>
                
                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleDownload(selectedDocument);
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && selectedDocument && (
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Content */}
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Hapus Dokumen?</h2>
                  <p className="text-gray-500 mb-2">
                    Anda yakin ingin menghapus dokumen ini?
                  </p>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg p-3">
                    {selectedDocument.documentTitle}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
                
                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className={`fixed bottom-6 left-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
                notification.type === 'error' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {notification.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DigitalEmployeeFileKontrakDokumenPage;

