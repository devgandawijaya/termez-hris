/**
 * Employee Model - Type Definitions for HRIS
 * All data structures for employee management
 */

// Employment Status enum
export const EmploymentStatus = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  PROBATION: 'Probation',
  CONTRACT: 'Contract',
  RESIGNED: 'Resigned',
  TERMINATED: 'Terminated'
};

// Employment Type
export const EmploymentType = {
  PERMANENT: 'Permanent',
  CONTRACT: 'Contract',
  PROBATION: 'Probation',
  INTERNSHIP: 'Internship'
};

// Job Level
export const JobLevel = {
  INTERN: 'Intern',
  JUNIOR: 'Junior',
  MIDDLE: 'MIDDLE',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  MANAGER: 'Manager',
  DIRECTOR: 'Director',
  VP: 'VP'
};

// Gender
export const Gender = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
};

// Marital Status
export const MaritalStatus = {
  SINGLE: 'Single',
  MARRIED: 'Married',
  DIVORCED: 'Divorced',
  WIDOWED: 'Widowed'
};

// Work Location
export const WorkLocation = {
  JAKARTA: 'Jakarta HQ',
  BANDUNG: 'Bandung Office',
  SURABAYA: 'Surabaya Office',
  MEDAN: 'Medan Office',
  REMOTE: 'Remote'
};

// Department
export const Department = {
  IT: 'IT Department',
  HR: 'Human Resources',
  FINANCE: 'Finance',
  MARKETING: 'Marketing',
  SALES: 'Sales',
  OPERATIONS: 'Operations',
  LEGAL: 'Legal',
  RND: 'R&D',
  CUSTOMER_SERVICE: 'Customer Service'
};

// Grade
export const Grade = {
  G1: 'Grade 1',
  G2: 'Grade 2',
  G3: 'Grade 3',
  G4: 'Grade 4',
  G5: 'Grade 5',
  G6: 'Grade 6',
  G7: 'Grade 7',
  G8: 'Grade 8'
};

/**
 * Personal Information
 */
export const PersonalInfoFields = [
  { key: 'employeeId', label: 'Employee ID', type: 'text', readonly: true },
  { key: 'fullName', label: 'Full Name', type: 'text', required: true },
  { key: 'nik', label: 'NIK', type: 'text', required: true },
  { key: 'birthDate', label: 'Birth Date', type: 'date', required: true },
  { key: 'gender', label: 'Gender', type: 'select', options: Object.values(Gender), required: true },
  { key: 'maritalStatus', label: 'Marital Status', type: 'select', options: Object.values(MaritalStatus), required: true },
  { key: 'address', label: 'Address', type: 'textarea', required: true },
  { key: 'phone', label: 'Phone', type: 'tel', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'photo', label: 'Photo', type: 'file', accept: 'image/*' }
];

/**
 * Employment Information
 */
export const EmploymentInfoFields = [
  { key: 'joinDate', label: 'Join Date', type: 'date', required: true },
  { key: 'employmentType', label: 'Employment Type', type: 'select', options: Object.values(EmploymentType), required: true },
  { key: 'contractStart', label: 'Contract Start', type: 'date' },
  { key: 'contractEnd', label: 'Contract End', type: 'date' },
  { key: 'probationPeriod', label: 'Probation Period (months)', type: 'number' },
  { key: 'employmentStatus', label: 'Employment Status', type: 'select', options: Object.values(EmploymentStatus), required: true }
];

/**
 * Organization Information
 */
export const OrganizationInfoFields = [
  { key: 'company', label: 'Company', type: 'text', required: true },
  { key: 'division', label: 'Division', type: 'text' },
  { key: 'department', label: 'Department', type: 'select', options: Object.values(Department), required: true },
  { key: 'section', label: 'Section', type: 'text' },
  { key: 'position', label: 'Position', type: 'text', required: true },
  { key: 'jobLevel', label: 'Job Level', type: 'select', options: Object.values(JobLevel), required: true },
  { key: 'reportingManager', label: 'Reporting Manager', type: 'text' },
  { key: 'workLocation', label: 'Work Location', type: 'select', options: Object.values(WorkLocation), required: true }
];

/**
 * Payroll Information
 */
export const PayrollInfoFields = [
  { key: 'salaryType', label: 'Salary Type', type: 'select', options: ['Monthly', 'Daily', 'Hourly'] },
  { key: 'basicSalary', label: 'Basic Salary', type: 'number' },
  { key: 'allowances', label: 'Allowances', type: 'number' },
  { key: 'bankName', label: 'Bank Name', type: 'text' },
  { key: 'bankAccount', label: 'Bank Account', type: 'text' },
  { key: 'npwp', label: 'NPWP', type: 'text' },
  { key: 'bpjsKetenagakerjaan', label: 'BPJS Ketenagakerjaan', type: 'text' },
  { key: 'bpjsKesehatan', label: 'BPJS Kesehatan', type: 'text' },
  { key: 'ptkp', label: 'PTKP Status', type: 'select', options: ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'] }
];

/**
 * Family Information
 */
export const FamilyInfoFields = {
  spouse: [
    { key: 'spouseName', label: 'Spouse Name', type: 'text' },
    { key: 'spouseNik', label: 'NIK', type: 'text' },
    { key: 'spouseBirthDate', label: 'Birth Date', type: 'date' },
    { key: 'spouseOccupation', label: 'Occupation', type: 'text' }
  ],
  children: [
    { key: 'childName', label: 'Child Name', type: 'text' },
    { key: 'childNik', label: 'NIK', type: 'text' },
    { key: 'childBirthDate', label: 'Birth Date', type: 'date' },
    { key: 'childGender', label: 'Gender', type: 'select', options: Object.values(Gender) }
  ],
  emergencyContact: [
    { key: 'emergencyName', label: 'Contact Name', type: 'text', required: true },
    { key: 'emergencyRelation', label: 'Relationship', type: 'text', required: true },
    { key: 'emergencyPhone', label: 'Phone', type: 'tel', required: true },
    { key: 'emergencyAddress', label: 'Address', type: 'textarea' }
  ]
};

/**
 * Education Information
 */
export const EducationFields = [
  { key: 'degree', label: 'Degree', type: 'select', options: ['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3'] },
  { key: 'institution', label: 'Institution', type: 'text', required: true },
  { key: 'major', label: 'Major', type: 'text' },
  { key: 'graduationYear', label: 'Graduation Year', type: 'number' },
  { key: 'gpa', label: 'GPA', type: 'text' },
  { key: 'certification', label: 'Certification', type: 'text' }
];

/**
 * Document Types
 */
export const DocumentTypes = {
  ID_CARD: 'ID Card (KTP)',
  FAMILY_CARD: 'Family Card (KK)',
  BIRTH_CERTIFICATE: 'Birth Certificate',
  EDUCATION_CERTIFICATE: 'Education Certificate',
  EMPLOYMENT_CONTRACT: 'Employment Contract',
  NDA: 'NDA',
  OTHER: 'Other'
};

/**
 * Career History Event Types
 */
export const CareerEventTypes = {
  PROMOTION: 'Promotion',
  MUTATION: 'Mutation',
  SALARY_ADJUSTMENT: 'Salary Adjustment',
  WARNING_LETTER: 'Warning Letter',
  PERFORMANCE_REVIEW: 'Performance Review'
};

/**
 * Asset Types
 */
export const AssetTypes = {
  LAPTOP: 'Laptop',
  MONITOR: 'Monitor',
  PHONE: 'Phone',
  ID_CARD: 'ID Card',
  VEHICLE: 'Vehicle',
  OTHER: 'Other'
};

/**
 * Default Employee Object
 */
export const createEmptyEmployee = () => ({
  // Personal Info
  employeeId: '',
  fullName: '',
  nik: '',
  birthDate: '',
  gender: '',
  maritalStatus: '',
  address: '',
  phone: '',
  email: '',
  photo: null,
  
  // Employment
  joinDate: '',
  employmentType: '',
  contractStart: '',
  contractEnd: '',
  probationPeriod: 0,
  employmentStatus: EmploymentStatus.ACTIVE,
  
  // Organization
  company: 'PT Termez Indonesia',
  division: '',
  department: '',
  section: '',
  position: '',
  jobLevel: '',
  reportingManager: '',
  workLocation: '',
  
  // Payroll
  salaryType: 'Monthly',
  basicSalary: 0,
  allowances: 0,
  bankName: '',
  bankAccount: '',
  npwp: '',
  bpjsKetenagakerjaan: '',
  bpjsKesehatan: '',
  ptkp: 'TK/0',
  
  // Family
  spouse: {
    name: '',
    nik: '',
    birthDate: '',
    occupation: ''
  },
  children: [],
  emergencyContact: {
    name: '',
    relation: '',
    phone: '',
    address: ''
  },
  
  // Education
  education: [],
  
  // Documents
  documents: [],
  
  // Career History
  careerHistory: [],
  
  // Assets
  assets: []
});

export default {
  EmploymentStatus,
  EmploymentType,
  JobLevel,
  Gender,
  MaritalStatus,
  WorkLocation,
  Department,
  Grade,
  PersonalInfoFields,
  EmploymentInfoFields,
  OrganizationInfoFields,
  PayrollInfoFields,
  FamilyInfoFields,
  EducationFields,
  DocumentTypes,
  CareerEventTypes,
  AssetTypes,
  createEmptyEmployee
};

