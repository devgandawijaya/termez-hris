/**
 * Employee Service - API calls for Employee Management
 * Contains dummy data and CRUD operations
 */

import { 
  EmploymentStatus, 
  EmploymentType, 
  JobLevel, 
  Gender, 
  MaritalStatus, 
  WorkLocation, 
  Department,
  Grade
} from '../models/employeeModel';

// Generate unique ID
const generateId = () => 'EMP' + Math.random().toString(36).substr(2, 6).toUpperCase();

// Generate NIK
const generateNIK = () => Math.random().toString(36).substr(2, 10).toUpperCase();

// Dummy Employee Data
const generateDummyEmployees = (count = 50) => {
  const employees = [];
  const firstNames = ['Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Farhan', 'Gita', 'Hadi', 'Indra', 'Joko', 
                      'Kartika', 'Lina', 'Mira', 'Nina', 'Olivia', 'Putri', 'Queen', 'Rina', 'Siti', 'Toni',
                      'Umar', 'Vina', 'Wati', 'Xavier', 'Yuni', 'Zainal', 'Anita', 'Bella', 'Claudia', 'Dian',
                      'Eka', 'Fajar', 'Hana', 'Ika', 'Jasmine', 'Kevin', 'Lia', 'Maria', 'Nadya', 'Octavia',
                      'Putra', 'Qori', 'Rizky', 'Sari', 'Tika', 'Ulfa', 'Vicky', 'Wulan', 'Yanti', 'Zahra'];
  
  const lastNames = ['Santoso', 'Wijaya', 'Kusuma', 'Pratama', 'Saputra', 'Wibowo', 'Susanto', 'Nugroho', 
                     'Hermawan', 'Permana', 'Rahman', 'Fauzi', 'Gunawan', 'Hidayat', 'Irawan', 'Jaya', 
                     'Kartika', 'Lestari', 'Mulyani', 'Novianti', 'Oktaviani', 'Puspitasari', 'Rahayu',
                     'Sukma', 'Triana', 'Utami', 'Wulandari', 'Yulianti', 'Zaharani', 'Hartono'];

  const departments = Object.values(Department);
  const positions = ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Analyst', 'HR Manager',
                     'Finance Manager', 'Marketing Manager', 'Sales Executive', 'Operation Staff', 'Legal Counsel',
                     'QA Engineer', 'DevOps Engineer', 'System Administrator', 'Security Analyst', 'Business Analyst',
                     'Project Manager', 'Scrum Master', 'Technical Writer', 'Database Administrator', 'Mobile Developer'];
  
  const jobLevels = Object.values(JobLevel);
  const workLocations = Object.values(WorkLocation);
  const employmentTypes = Object.values(EmploymentType);
  const employmentStatuses = [EmploymentStatus.ACTIVE, EmploymentStatus.ACTIVE, EmploymentStatus.ACTIVE, 
                               EmploymentStatus.PROBATION, EmploymentStatus.CONTRACT];
  const genders = Object.values(Gender);
  const maritalStatuses = Object.values(MaritalStatus);

  const companies = ['PT Termez Indonesia', 'PT Termez Teknologi', 'PT Termez Solusi'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const birthYear = 1970 + Math.floor(Math.random() * 35);
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    const joinYear = 2015 + Math.floor(Math.random() * 10);
    const joinMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const joinDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

    const baseSalary = 3000000 + Math.floor(Math.random() * 25000000);
    const allowances = Math.floor(baseSalary * 0.15);
    
    employees.push({
      id: generateId(),
      employeeId: 'EMP' + String(1000 + i).padStart(4, '0'),
      fullName,
      nik: generateNIK(),
      birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      gender: genders[Math.floor(Math.random() * genders.length)],
      maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
      address: `Jl. Merdeka No. ${Math.floor(Math.random() * 100)}, Jakarta`,
      phone: `+62 8${Math.floor(Math.random() * 1000000000).toString().padStart(11, '0')}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@termez.id`,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
      
      joinDate: `${joinYear}-${joinMonth}-${joinDay}`,
      employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
      contractStart: joinYear + '-01-01',
      contractEnd: (joinYear + 1) + '-12-31',
      probationPeriod: employmentTypes[Math.floor(Math.random() * employmentTypes.length)] === 'Probation' ? 3 : 0,
      employmentStatus: employmentStatuses[Math.floor(Math.random() * employmentStatuses.length)],
      
      company: companies[Math.floor(Math.random() * companies.length)],
      division: departments[Math.floor(Math.random() * departments.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      section: `Section ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      jobLevel: jobLevels[Math.floor(Math.random() * jobLevels.length)],
      reportingManager: employees[Math.floor(Math.random() * Math.min(i, 10))]?.fullName || 'John Doe',
      workLocation: workLocations[Math.floor(Math.random() * workLocations.length)],
      
      salaryType: 'Monthly',
      basicSalary: baseSalary,
      allowances,
      bankName: ['BCA', 'Mandiri', 'BNI', 'BTN', 'BRI'][Math.floor(Math.random() * 5)],
      bankAccount: Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'),
      npwp: `0${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000000)}`,
      bpjsKetenagakerjaan: Math.floor(Math.random() * 1000000000000).toString().padStart(11, '0'),
      bpjsKesehatan: Math.floor(Math.random() * 1000000000000).toString().padStart(11, '0'),
      ptkp: ['TK/0', 'TK/1', 'TK/2', 'K/0', 'K/1'][Math.floor(Math.random() * 5)],
      
      spouse: Math.random() > 0.5 ? {
        name: firstName + ' Wife',
        nik: generateNIK(),
        birthDate: `${birthYear - 2}-${birthMonth}-${birthDay}`,
        occupation: 'Housewife'
      } : null,
      children: Math.random() > 0.6 ? [
        { name: 'Child 1', gender: 'Male', birthDate: `${birthYear + 5}-${birthMonth}-${birthDay}` }
      ] : [],
      emergencyContact: {
        name: lastName + ' Family',
        relation: 'Parent',
        phone: `+62 8${Math.floor(Math.random() * 1000000000).toString().padStart(11, '0')}`,
        address: `Jl. Keluarga No. 1, Jakarta`
      },
      
      education: [
        { degree: 'S1', institution: 'Universitas Indonesia', major: 'Computer Science', graduationYear: birthYear + 22 }
      ],
      
      documents: [],
      
      careerHistory: [
        { type: 'Promotion', date: `${joinYear + 2}-01-01`, description: 'Promoted to current position', before: 'Junior', after: 'Middle' }
      ],
      
      assets: []
    });
  }
  
  return employees;
};

// In-memory store for demo
let employeeStore = generateDummyEmployees(50);

/**
 * Get all employees with optional filters
 */
export async function getEmployees(params = {}) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let result = [...employeeStore];
  
  // Search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    result = result.filter(emp => 
      emp.fullName.toLowerCase().includes(searchLower) ||
      emp.employeeId.toLowerCase().includes(searchLower) ||
      emp.nik.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.position.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by department
  if (params.department) {
    result = result.filter(emp => emp.department === params.department);
  }
  
  // Filter by status
  if (params.status) {
    result = result.filter(emp => emp.employmentStatus === params.status);
  }
  
  // Filter by location
  if (params.location) {
    result = result.filter(emp => emp.workLocation === params.location);
  }
  
  // Filter by employment type
  if (params.employmentType) {
    result = result.filter(emp => emp.employmentType === params.employmentType);
  }
  
  // Sorting
  if (params.sortBy) {
    const sortKey = params.sortBy;
    const sortOrder = params.sortOrder || 'asc';
    result.sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }
  
  // Pagination
  const total = result.length;
  const page = params.page || 1;
  const limit = params.limit || 30;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  result = result.slice(startIndex, endIndex);
  
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get employee by ID
 */
export async function getEmployeeById(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  const employee = employeeStore.find(emp => emp.id === id);
  if (!employee) {
    throw new Error('Employee not found');
  }
  return employee;
}

/**
 * Create new employee
 */
export async function createEmployee(data) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newEmployee = {
    ...data,
    id: generateId(),
    employeeId: 'EMP' + String(employeeStore.length + 1000).padStart(4, '0'),
    nik: data.nik || generateNIK()
  };
  
  employeeStore.unshift(newEmployee);
  return newEmployee;
}

/**
 * Update employee
 */
export async function updateEmployee(id, data) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = employeeStore.findIndex(emp => emp.id === id);
  if (index === -1) {
    throw new Error('Employee not found');
  }
  
  employeeStore[index] = {
    ...employeeStore[index],
    ...data
  };
  
  return employeeStore[index];
}

/**
 * Delete employee (soft delete - set to inactive)
 */
export async function deleteEmployee(id) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = employeeStore.findIndex(emp => emp.id === id);
  if (index === -1) {
    throw new Error('Employee not found');
  }
  
  employeeStore[index].employmentStatus = EmploymentStatus.INACTIVE;
  return employeeStore[index];
}

/**
 * Get employee statistics for dashboard
 */
export async function getEmployeeStats() {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const employees = employeeStore;
  
  // Total employees
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.employmentStatus === EmploymentStatus.ACTIVE).length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  
  // Employment status breakdown
  const employmentStatusCount = {};
  employees.forEach(emp => {
    employmentStatusCount[emp.employmentStatus] = (employmentStatusCount[emp.employmentStatus] || 0) + 1;
  });
  
  // Department breakdown
  const departmentCount = {};
  employees.forEach(emp => {
    departmentCount[emp.department] = (departmentCount[emp.department] || 0) + 1;
  });
  
  // Find largest department
  const largestDept = Object.entries(departmentCount).sort((a, b) => b[1] - a[1])[0];
  
  // Work location breakdown
  const locationCount = {};
  employees.forEach(emp => {
    locationCount[emp.workLocation] = (locationCount[emp.workLocation] || 0) + 1;
  });
  
  // Payroll overview
  const totalPayrollHeadcount = activeEmployees;
  const totalGrossSalary = employees
    .filter(e => e.employmentStatus === EmploymentStatus.ACTIVE)
    .reduce((sum, emp) => sum + (emp.basicSalary || 0) + (emp.allowances || 0), 0);
  
  return {
    total: {
      employees: totalEmployees,
      active: activeEmployees,
      inactive: inactiveEmployees
    },
    employmentStatus: {
      permanent: employees.filter(e => e.employmentType === EmploymentType.PERMANENT).length,
      contract: employees.filter(e => e.employmentType === EmploymentType.CONTRACT).length,
      probation: employees.filter(e => e.employmentType === EmploymentType.PROBATION).length
    },
    department: {
      total: Object.keys(departmentCount).length,
      largest: {
        name: largestDept?.[0] || 'N/A',
        count: largestDept?.[1] || 0
      },
      breakdown: departmentCount
    },
    payroll: {
      headcount: totalPayrollHeadcount,
      grossSalary: totalGrossSalary
    },
    location: locationCount
  };
}

/**
 * Get filter options
 */
export async function getFilterOptions() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const employees = employeeStore;
  
  return {
    departments: [...new Set(employees.map(e => e.department))],
    statuses: [...new Set(employees.map(e => e.employmentStatus))],
    locations: [...new Set(employees.map(e => e.workLocation))],
    employmentTypes: [...new Set(employees.map(e => e.employmentType))]
  };
}

export default {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  getFilterOptions
};

