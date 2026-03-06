/**
 * Employee Validation Helper - Comprehensive validation for all employee fields
 * Validates all 9 tabs of the employee form
 */

/**
 * Email format validation
 */
export const validateEmail = (email) => {
  if (!email) return { valid: true };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email format' };
  }
  return { valid: true };
};

/**
 * Phone format validation (Indonesian format)
 */
export const validatePhone = (phone) => {
  if (!phone) return { valid: true };
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return { valid: false, message: 'Invalid phone format (use: 081234567890)' };
  }
  return { valid: true };
};

/**
 * NIK validation (Indonesian ID)
 */
export const validateNIK = (nik) => {
  if (!nik) return { valid: true };
  if (nik.length < 6) {
    return { valid: false, message: 'NIK must be at least 6 characters' };
  }
  return { valid: true };
};

/**
 * Required field validation
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
};

/**
 * Validate Personal Info section
 */
export const validatePersonalInfo = (data, existingEmployees = []) => {
  const errors = {};
  
  // Required fields
  const fullNameResult = validateRequired(data.fullName, 'Full Name');
  if (!fullNameResult.valid) errors.fullName = fullNameResult.message;
  
  const nikResult = validateRequired(data.nik, 'NIK');
  if (!nikResult.valid) errors.nik = nikResult.message;
  else {
    const nikFormatResult = validateNIK(data.nik);
    if (!nikFormatResult.valid) errors.nik = nikFormatResult.message;
    else if (existingEmployees.some(emp => emp.nik === data.nik)) {
      errors.nik = 'NIK already exists in database';
    }
  }
  
  const emailResult = validateRequired(data.email, 'Email');
  if (!emailResult.valid) errors.email = emailResult.message;
  else {
    const emailFormatResult = validateEmail(data.email);
    if (!emailFormatResult.valid) errors.email = emailFormatResult.message;
  }
  
  const phoneResult = validateRequired(data.phone, 'Phone');
  if (!phoneResult.valid) errors.phone = phoneResult.message;
  else {
    const phoneFormatResult = validatePhone(data.phone);
    if (!phoneFormatResult.valid) errors.phone = phoneFormatResult.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Employment section
 */
export const validateEmployment = (data) => {
  const errors = {};
  
  const joinDateResult = validateRequired(data.joinDate, 'Join Date');
  if (!joinDateResult.valid) errors.joinDate = joinDateResult.message;
  
  const employmentTypeResult = validateRequired(data.employmentType, 'Employment Type');
  if (!employmentTypeResult.valid) errors.employmentType = employmentTypeResult.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Organization section
 */
export const validateOrganization = (data) => {
  const errors = {};
  
  const departmentResult = validateRequired(data.department, 'Department');
  if (!departmentResult.valid) errors.department = departmentResult.message;
  
  const positionResult = validateRequired(data.position, 'Position');
  if (!positionResult.valid) errors.position = positionResult.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Payroll section
 */
export const validatePayroll = (data) => {
  const errors = {};
  
  // Basic Salary is required
  const salaryResult = validateRequired(data.basicSalary?.toString(), 'Basic Salary');
  if (!salaryResult.valid) errors.basicSalary = salaryResult.message;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Family section
 */
export const validateFamily = (data) => {
  const errors = {};
  
  // Emergency contact is optional but if provided, validate nested structure
  if (data.emergencyContact) {
    const nameResult = validateRequired(data.emergencyContact.name, 'Emergency Contact Name');
    if (!nameResult.valid) errors['family.emergencyContact.name'] = nameResult.message;
    
    const relationResult = validateRequired(data.emergencyContact.relation, 'Relationship');
    if (!relationResult.valid) errors['family.emergencyContact.relation'] = relationResult.message;
    
    const phoneResult = validateRequired(data.emergencyContact.phone, 'Emergency Phone');
    if (!phoneResult.valid) errors['family.emergencyContact.phone'] = phoneResult.message;
    else {
      const phoneFormatResult = validatePhone(data.emergencyContact.phone);
      if (!phoneFormatResult.valid) errors['family.emergencyContact.phone'] = phoneFormatResult.message;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Education section
 */
export const validateEducation = (data) => {
  const errors = {};
  
  // Education is optional but if provided, validate
  if (data.education && data.education.length > 0) {
    data.education.forEach((edu, index) => {
      if (edu.institution) {
        const institutionResult = validateRequired(edu.institution, `Education #${index + 1} Institution`);
        if (!institutionResult.valid) {
          errors[`education[${index}].institution`] = institutionResult.message;
        }
      }
    });
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Documents section
 */
export const validateDocuments = (_data) => {
  const errors = {};
  
  // Documents are optional
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Career History section
 */
export const validateCareerHistory = (_data) => {
  const errors = {};
  
  // Career history is optional
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Assets section
 */
export const validateAssets = (_data) => {
  const errors = {};
  
  // Assets are optional
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate entire employee form
 */
export const validateEmployeeForm = (formData, existingEmployees = []) => {
  const allErrors = {};
  
  // Validate each section
  const personalResult = validatePersonalInfo(formData.personal, existingEmployees);
  Object.assign(allErrors, personalResult.errors);
  
  const employmentResult = validateEmployment(formData.employment);
  Object.assign(allErrors, employmentResult.errors);
  
  const organizationResult = validateOrganization(formData.organization);
  Object.assign(allErrors, organizationResult.errors);
  
  const payrollResult = validatePayroll(formData.payroll);
  Object.assign(allErrors, payrollResult.errors);
  
  const familyResult = validateFamily(formData.family);
  Object.assign(allErrors, familyResult.errors);
  
  const educationResult = validateEducation(formData.education);
  Object.assign(allErrors, educationResult.errors);
  
  const documentsResult = validateDocuments(formData.documents);
  Object.assign(allErrors, documentsResult.errors);
  
  const careerResult = validateCareerHistory(formData.careerHistory);
  Object.assign(allErrors, careerResult.errors);
  
  const assetsResult = validateAssets(formData.assets);
  Object.assign(allErrors, assetsResult.errors);
  
  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors
  };
};

/**
 * Get required fields for each tab
 */
export const getRequiredFields = () => ({
  personal: ['fullName', 'nik', 'email', 'phone'],
  employment: ['joinDate', 'employmentType'],
  organization: ['department', 'position'],
  payroll: ['basicSalary'],
  family: [],
  education: [],
  documents: [],
  careerHistory: [],
  assets: []
});

/**
 * Get first error tab
 */
export const getFirstErrorTab = (errors) => {
  const tabOrder = ['personal', 'employment', 'organization', 'payroll', 'family', 'education', 'documents', 'careerHistory', 'assets'];
  
  for (const tab of tabOrder) {
    const tabErrors = Object.keys(errors).filter(key => 
      key.startsWith(tab) || 
      (tab === 'employment' && key.includes('employment')) ||
      (tab === 'organization' && (key.includes('department') || key.includes('position'))) ||
      (tab === 'payroll' && key.includes('salary')) ||
      (tab === 'family' && key.includes('emergency')) ||
      (tab === 'careerHistory' && key.includes('career')) ||
      (tab === 'assets' && key.includes('asset'))
    );
    if (tabErrors.length > 0) {
      return tab;
    }
  }
  
  return 'personal';
};

export default {
  validateEmail,
  validatePhone,
  validateNIK,
  validateRequired,
  validatePersonalInfo,
  validateEmployment,
  validateOrganization,
  validatePayroll,
  validateFamily,
  validateEducation,
  validateDocuments,
  validateCareerHistory,
  validateAssets,
  validateEmployeeForm,
  getRequiredFields,
  getFirstErrorTab
};

