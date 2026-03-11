/**
 * File Validation Utilities
 * Secure file validation for document uploads
 */

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate file extension
 */
export const validateFileExtension = (fileName) => {
  if (!fileName) {
    return { valid: false, error: 'Nama file tidak boleh kosong' };
  }
  
  const extension = fileName.split('.').pop().toLowerCase();
  
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { 
      valid: false, 
      error: `Tipe file tidak diizinkan. File yang diizinkan: ${ALLOWED_EXTENSIONS.join(', ').toUpperCase()}` 
    };
  }
  
  return { valid: true };
};

/**
 * Validate file MIME type
 */
export const validateFileMimeType = (file) => {
  if (!file || !file.type) {
    return { valid: false, error: 'Tidak dapat membaca tipe file' };
  }
  
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Tipe file tidak valid. Silakan upload file PDF, DOC, DOCX, XLS, XLSX, JPG, atau PNG' 
    };
  }
  
  return { valid: true };
};

/**
 * Validate file size
 */
export const validateFileSize = (file) => {
  if (!file || !file.size) {
    return { valid: false, error: 'Tidak dapat membaca ukuran file' };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'File tidak boleh kosong' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return { 
      valid: false, 
      error: `Ukuran file terlalu besar. Maksimal ukuran file adalah ${maxSizeMB}MB` 
    };
  }
  
  return { valid: true };
};

/**
 * Validate filename for dangerous characters
 */
export const validateFileName = (fileName) => {
  if (!fileName) {
    return { valid: false, error: 'Nama file tidak boleh kosong' };
  }
  
  // Check for dangerous characters
  const dangerousChars = /[<>:"|?*\\\/]/;
  if (dangerousChars.test(fileName)) {
    return { 
      valid: false, 
      error: 'Nama file mengandung karakter berbahaya. Silakan rename file Anda' 
    };
  }
  
  // Check for path traversal attempts
  if (fileName.includes('..') || fileName.includes('~')) {
    return { 
      valid: false, 
      error: 'Nama file tidak valid' 
    };
  }
  
  // Check filename length
  if (fileName.length > 255) {
    return { 
      valid: false, 
      error: 'Nama file terlalu panjang. Maksimal 255 karakter' 
    };
  }
  
  return { valid: true };
};

/**
 * Complete file validation
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'File tidak ditemukan' };
  }
  
  // Validate filename first
  const fileNameValidation = validateFileName(file.name);
  if (!fileNameValidation.valid) {
    return fileNameValidation;
  }
  
  // Validate extension
  const extensionValidation = validateFileExtension(file.name);
  if (!extensionValidation.valid) {
    return extensionValidation;
  }
  
  // Validate MIME type
  const mimeValidation = validateFileMimeType(file);
  if (!mimeValidation.valid) {
    return mimeValidation;
  }
  
  // Validate size
  const sizeValidation = validateFileSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }
  
  return { valid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get file icon based on extension
 */
export const getFileIcon = (fileName) => {
  if (!fileName) return 'file';
  
  const extension = fileName.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'word';
    case 'xls':
    case 'xlsx':
      return 'excel';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    default:
      return 'file';
  }
};

/**
 * Check if file is an image
 */
export const isImageFile = (fileName) => {
  if (!fileName) return false;
  const extension = fileName.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
};

export default {
  validateFile,
  validateFileExtension,
  validateFileMimeType,
  validateFileSize,
  validateFileName,
  formatFileSize,
  getFileIcon,
  isImageFile,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE
};

