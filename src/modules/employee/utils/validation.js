/**
 * Employee Validation Utilities
 * Clean validation functions for employee data
 */

/**
 * Validate required fields
 * @param {Object} data - Employee data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Object with field errors
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    const value = data[field];
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[field] = `${field} is required`;
    }
  });
  
  return errors;
};

/**
 * Check if NIK already exists in database
 * @param {string} nik - NIK to check
 * @param {Array} existingEmployees - Array of existing employees
 * @param {string} excludeId - Employee ID to exclude (for updates)
 * @returns {boolean} - True if duplicate
 */
export const validateDuplicateNIK = (nik, existingEmployees, excludeId = null) => {
  if (!nik) return false;
  
  return existingEmployees.some(emp => 
    emp.nik === nik && emp.id !== excludeId
  );
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmailFormat = (email) => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (Indonesian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validatePhoneFormat = (phone) => {
  if (!phone) return true;
  // Indonesian phone format: +62 or 08xx
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate complete employee record
 * @param {Object} employee - Employee data
 * @param {Array} existingEmployees - Existing employees for duplicate check
 * @param {string} excludeId - ID to exclude from duplicate check
 * @returns {Object} - Object with errors and isValid
 */
export const validateEmployee = (employee, existingEmployees = [], excludeId = null) => {
  const errors = {};
  
  // Required fields
  const requiredFields = ['fullName', 'nik', 'email', 'department', 'position', 'joinDate'];
  const requiredErrors = validateRequired(employee, requiredFields);
  Object.assign(errors, requiredErrors);
  
  // Email format
  if (employee.email && !validateEmailFormat(employee.email)) {
    errors.email = 'Invalid email format';
  }
  
  // Phone format
  if (employee.phone && !validatePhoneFormat(employee.phone)) {
    errors.phone = 'Invalid phone format';
  }
  
  // NIK duplicate
  if (employee.nik && validateDuplicateNIK(employee.nik, existingEmployees, excludeId)) {
    errors.nik = 'NIK already exists in database';
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validate batch import employees
 * @param {Array} employees - Array of employees to validate
 * @param {Array} existingEmployees - Existing employees in database
 * @returns {Object} - Object with validated employees and errors
 */
export const validateBatchImport = (employees, existingEmployees = []) => {
  const validated = [];
  const errors = [];
  const seenNIKs = new Set();
  
  employees.forEach((employee, index) => {
    const rowErrors = [];
    const rowWarnings = [];
    
    // Check required fields
    if (!employee.fullName?.trim()) {
      rowErrors.push('Full Name is required');
    }
    if (!employee.nik?.trim()) {
      rowErrors.push('NIK is required');
    }
    if (!employee.email?.trim()) {
      rowErrors.push('Email is required');
    } else if (!validateEmailFormat(employee.email)) {
      rowErrors.push('Invalid email format');
    }
    if (!employee.department?.trim()) {
      rowErrors.push('Department is required');
    }
    if (!employee.position?.trim()) {
      rowErrors.push('Position is required');
    }
    
    // Check duplicate NIK within file
    if (employee.nik) {
      if (seenNIKs.has(employee.nik)) {
        rowErrors.push('Duplicate NIK in file');
      } else {
        seenNIKs.add(employee.nik);
      }
    }
    
    // Check duplicate with existing database
    if (employee.nik && validateDuplicateNIK(employee.nik, existingEmployees)) {
      rowWarnings.push('Duplicate NIK (exists in database)');
    }
    
    // Add to validated or errors
    if (rowErrors.length > 0) {
      errors.push({
        row: index + 2, // Excel row (1-indexed, +1 for header)
        data: employee,
        errors: rowErrors,
        warnings: rowWarnings
      });
    } else {
      validated.push({
        ...employee,
        hasWarnings: rowWarnings.length > 0,
        warnings: rowWarnings
      });
    }
  });
  
  return {
    valid: validated,
    errors,
    summary: {
      total: employees.length,
      valid: validated.length,
      invalid: errors.length
    }
  };
};

export default {
  validateRequired,
  validateDuplicateNIK,
  validateEmailFormat,
  validatePhoneFormat,
  validateEmployee,
  validateBatchImport
};

