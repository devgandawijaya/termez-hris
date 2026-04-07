/**
 * ExcelUpload Component - Upload and Preview Excel files
 * Enterprise grade with validation and error highlighting
 */

import React, { useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  X, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Download,
  Trash2,
  Send
} from 'lucide-react';
import { useExcelImport } from '../hooks/useEmployee';

const ExcelUpload = ({ existingEmployees = [] }) => {
  const fileInputRef = useRef(null);
  
  const {
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
  } = useExcelImport(existingEmployees);

  // Handle file input change
  const onFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);

  // Handle drag and drop
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '-';
    return 'Rp ' + parseInt(value).toLocaleString('id-ID', { maximumFractionDigits: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Header with Download Template */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Import Employees from Excel</h3>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-sm text-red-700">{error}</p>
        </motion.div>
      )}

      {/* Import Result Alert */}
      {importResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center p-4 rounded-lg ${
            importResult.errors.length === 0 
              ? 'bg-emerald-50 border border-emerald-200' 
              : 'bg-amber-50 border border-amber-200'
          }`}
        >
          {importResult.errors.length === 0 ? (
            <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-3" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              Import Complete: {importResult.inserted.length} successful, {importResult.errors.length} failed
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="ml-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Clear
          </button>
        </motion.div>
      )}

      {/* Upload Area - Show when no file selected */}
      {!file && !loading && !validationResult && (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={onFileChange}
            className="hidden"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Supports .xlsx and .xls files
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="border border-gray-200 rounded-lg p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-600">Processing file...</p>
        </div>
      )}

      {/* Selected File Info */}
      {file && !loading && !validationResult && (
        <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center">
            <FileSpreadsheet className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Validation Summary */}
      {validationResult && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{validationResult.summary.total}</p>
              <p className="text-xs text-gray-500">Total Rows</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{validationResult.summary.valid}</p>
              <p className="text-xs text-gray-500">Valid</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{validationResult.summary.invalid}</p>
              <p className="text-xs text-gray-500">Invalid</p>
            </div>
          </div>

          {/* Preview Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {parsedData.map((row, index) => {
                      const errorRow = validationResult.errors.find(e => e.row === index + 2);
                      const validRow = validationResult.valid.find(v => v.fullName === row.fullName && v.nik === row.nik);
                      const isValid = !!validRow;
                      
                      return (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`
                            ${errorRow ? 'bg-red-50' : isValid ? 'bg-white' : 'bg-white'}
                            hover:bg-gray-50
                          `}
                        >
                          <td className="px-4 py-3">
                            {errorRow ? (
                              <div className="flex items-center text-red-600">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs">Error</span>
                              </div>
                            ) : validRow?.hasWarnings ? (
                              <div className="flex items-center text-amber-600">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                <span className="text-xs">Warning</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-emerald-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs">OK</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">{row.fullName || '-'}</td>
                          <td className="px-4 py-3 text-gray-600">
                            <span className={errorRow?.errors.includes('NIK is required') || errorRow?.errors.includes('Duplicate NIK in file') ? 'text-red-600 font-medium' : ''}>
                              {row.nik || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            <span className={errorRow?.errors.includes('Email is required') || errorRow?.errors.includes('Invalid email format') ? 'text-red-600' : ''}>
                              {row.email || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{row.department || '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{row.position || '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{row.employmentType || row.type || '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{row.joinDate || '-'}</td>
                          <td className="px-4 py-3 text-gray-600">{formatCurrency(row.salary)}</td>
                          <td className="px-4 py-3">
                            <span className={`
                              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                              ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
                            `}>
                              {row.status || 'Active'}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Error Details */}
          {validationResult.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-800 mb-2">Validation Errors</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {validationResult.errors.map((err, idx) => (
                  <div key={idx} className="text-sm text-red-700">
                    <span className="font-medium">Row {err.row}:</span> {err.errors.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSubmitAll}
              disabled={validationResult.valid.length === 0 || importing}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit All ({validationResult.valid.length})
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;

