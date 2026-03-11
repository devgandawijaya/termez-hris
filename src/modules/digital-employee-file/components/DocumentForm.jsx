/**
 * DocumentForm - Form component for adding/editing contract documents
 * Features: Drag & Drop Upload, Preview, Progress, Real-time Validation
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Eye,
  Download,
  CloudUpload
} from 'lucide-react';
import { validateFile, formatFileSize, isImageFile } from '../utils/fileValidation';

const DocumentForm = ({ 
  employees = [], 
  documentTypes = [], 
  initialData = null, 
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    employeeId: initialData?.employeeId || '',
    documentTitle: initialData?.documentTitle || '',
    documentType: initialData?.documentType || '',
    contractStartDate: initialData?.contractStartDate || '',
    contractEndDate: initialData?.contractEndDate || '',
    file: initialData?.file || null,
    fileName: initialData?.fileName || '',
    description: initialData?.description || ''
  });

  // File upload state
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is touched and changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  // Validate single field
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'employeeId':
        if (!value) error = 'Pilih karyawan terlebih dahulu';
        break;
      case 'documentTitle':
        if (!value?.trim()) error = 'Judul dokumen wajib diisi';
        else if (value.length < 3) error = 'Judul minimal 3 karakter';
        break;
      case 'documentType':
        if (!value) error = 'Pilih jenis dokumen';
        break;
      case 'contractStartDate':
        if (!value) error = 'Tanggal mulai kontrak wajib diisi';
        break;
      case 'contractEndDate':
        if (!value) error = 'Tanggal berakhir kontrak wajib diisi';
        else if (formData.contractStartDate && new Date(value) <= new Date(formData.contractStartDate)) {
          error = 'Tanggal berakhir harus lebih dari tanggal mulai';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setFileError(validation.error);
      setFilePreview(null);
      return;
    }

    // Clear previous errors
    setFileError('');
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    // Create preview
    try {
      if (isImageFile(file.name)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview({
            type: 'image',
            url: e.target.result,
            name: file.name,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview({
          type: 'file',
          name: file.name,
          size: file.size,
          extension: file.name.split('.').pop().toUpperCase()
        });
      }
    } catch (err) {
      console.error('Preview error:', err);
    }

    // Complete upload simulation
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      
      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }));
    }, 1000);
  }, []);

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, file: null, fileName: '' }));
    setFilePreview(null);
    setFileError('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    const fields = ['employeeId', 'documentTitle', 'documentType', 'contractStartDate', 'contractEndDate'];
    
    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });

    // Check file
    if (!formData.file && !initialData?.fileName) {
      setFileError('File dokumen wajib diupload');
      isValid = false;
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'file' && key !== 'fileName') {
        allTouched[key] = true;
      }
    });
    setTouched(allTouched);

    if (validateForm()) {
      // Get employee info
      const selectedEmployee = employees.find(emp => emp.value === formData.employeeId);
      
      const submitData = {
        ...formData,
        employeeName: selectedEmployee?.label || '',
        employeeNik: selectedEmployee?.nik || '',
        employeePosition: selectedEmployee?.position || '',
        employeeDepartment: selectedEmployee?.department || ''
      };
      
      onSubmit?.(submitData);
    }
  };

  // Common input classes
  const inputClasses = (fieldName) => `
    w-full px-3 py-2 text-sm border rounded-lg shadow-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    transition-colors
    ${errors[fieldName] && touched[fieldName] 
      ? 'border-red-300 bg-red-50' 
      : 'border-gray-300 bg-white'}
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  // Animation variants
  const dropZoneVariants = {
    idle: {
      borderColor: '#d1d5db',
      backgroundColor: '#f9fafb'
    },
    dragOver: {
      borderColor: '#6366f1',
      backgroundColor: '#eef2ff'
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Employee Selection */}
      <div>
        <label className={labelClasses}>
          Karyawan <span className="text-red-500">*</span>
        </label>
        <select
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses('employeeId')}
        >
          <option value="">Pilih Karyawan</option>
          {employees.map(emp => (
            <option key={emp.value} value={emp.value}>
              {emp.label} - {emp.nik}
            </option>
          ))}
        </select>
        {errors.employeeId && touched.employeeId && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.employeeId}
          </p>
        )}
      </div>

      {/* Document Title */}
      <div>
        <label className={labelClasses}>
          Judul Dokumen <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="documentTitle"
          value={formData.documentTitle}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses('documentTitle')}
          placeholder="Contoh: Kontrak Kerja - John Doe"
        />
        {errors.documentTitle && touched.documentTitle && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.documentTitle}
          </p>
        )}
      </div>

      {/* Document Type */}
      <div>
        <label className={labelClasses}>
          Jenis Dokumen <span className="text-red-500">*</span>
        </label>
        <select
          name="documentType"
          value={formData.documentType}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses('documentType')}
        >
          <option value="">Pilih Jenis Dokumen</option>
          {documentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.documentType && touched.documentType && (
          <p className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.documentType}
          </p>
        )}
      </div>

      {/* Contract Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className={labelClasses}>
            Tanggal Mulai Kontrak <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="contractStartDate"
            value={formData.contractStartDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses('contractStartDate')}
          />
          {errors.contractStartDate && touched.contractStartDate && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.contractStartDate}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className={labelClasses}>
            Tanggal Berakhir Kontrak <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="contractEndDate"
            value={formData.contractEndDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses('contractEndDate')}
          />
          {errors.contractEndDate && touched.contractEndDate && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.contractEndDate}
            </p>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className={labelClasses}>
          Upload File <span className="text-red-500">*</span>
        </label>
        
        {/* Drop Zone */}
        <motion.div
          variants={dropZoneVariants}
          initial="idle"
          animate={filePreview ? "idle" : "idle"}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-6 cursor-pointer
            transition-colors hover:border-indigo-400 hover:bg-indigo-50/30
            ${fileError ? 'border-red-300 bg-red-50' : ''}
            ${filePreview ? 'border-emerald-300 bg-emerald-50' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
          
          <AnimatePresence mode="wait">
            {filePreview ? (
              // File Preview
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {filePreview.type === 'image' ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={filePreview.url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {filePreview.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(filePreview.size)}
                      {filePreview.extension && ` • ${filePreview.extension}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ) : (
              // Upload Placeholder
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center py-4"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <CloudUpload className="w-7 h-7 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Klik atau drag & drop file di sini
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 5MB)
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Progress */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-xl overflow-hidden"
              >
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* File Error */}
        {fileError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-red-600 flex items-center"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            {fileError}
          </motion.p>
        )}

        {/* File Success */}
        {filePreview && !fileError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-emerald-600 flex items-center"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            File berhasil diupload
          </motion.p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className={labelClasses}>
          Keterangan
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={inputClasses('description')}
          placeholder="Tambahkan keterangan opsional..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              {initialData ? 'Perbarui Dokumen' : 'Simpan Dokumen'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;

