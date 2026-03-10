/**
 * Excel Service - Handle Excel file operations
 * Uses SheetJS (xlsx) library
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Parse Excel file to JSON
 * @param {File} file - Excel file object
 * @returns {Promise<Array>} - Array of employee objects
 */
export const parseExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '',
          raw: false 
        });
        
        // Normalize keys to camelCase
        const normalizedData = jsonData.map(row => normalizeKeys(row));
        
        resolve(normalizedData);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Normalize Excel column keys to camelCase
 * @param {Object} obj - Row object with Excel headers
 * @returns {Object} - Normalized object
 */
const normalizeKeys = (obj) => {
  const keyMap = {
    'Full Name': 'fullName',
    'NIK': 'nik',
    'Email': 'email',
    'Phone': 'phone',
    'Department': 'department',
    'Position': 'position',
    'Job Level': 'jobLevel',
    'Type': 'employmentType',
    'Join Date': 'joinDate',
    'Location': 'workLocation',
    'Salary': 'salary',
    'Manager': 'reportingManager',
    'Status': 'status'
  };
  
  const normalized = {};
  
  Object.keys(obj).forEach(key => {
    const normalizedKey = keyMap[key] || key;
    normalized[normalizedKey] = obj[key];
  });
  
  return normalized;
};

/**
 * Generate Excel template with sample data
 * @returns {void} - Downloads the template file
 */
export const generateTemplate = () => {
  // Sample employee data for template
  const templateData = [
    {
      'Full Name': 'John Updated Doe',
      'NIK': 'EMP-001',
      'Email': 'john@email.com',
      'Phone': '08123',
      'Department': 'R&D',
      'Position': 'Developer',
      'Job Level': 'Senior',
      'Type': 'Permanent',
      'Join Date': '2022-01-15',
      'Location': 'Jakarta',
      'Salary': '15000000',
      'Manager': 'Michael Scott',
      'Status': 'Active'
    },
    {
      'Full Name': 'Jane Smith',
      'NIK': 'EMP-002',
      'Email': 'jane@email.com',
      'Phone': '08222',
      'Department': 'HR',
      'Position': 'HR Manager',
      'Job Level': 'Manager',
      'Type': 'Permanent',
      'Join Date': '2021-03-10',
      'Location': 'Bandung',
      'Salary': '12000000',
      'Manager': 'Robert',
      'Status': 'Active'
    },
    {
      'Full Name': 'David Lee',
      'NIK': 'EMP-003',
      'Email': 'david@email.com',
      'Phone': '08333',
      'Department': 'Finance',
      'Position': 'Accountant',
      'Job Level': 'Staff',
      'Type': 'Contract',
      'Join Date': '2023-07-01',
      'Location': 'Surabaya',
      'Salary': '9000000',
      'Manager': 'Angela',
      'Status': 'Active'
    }
  ];
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 20 }, // Full Name
    { wch: 12 }, // NIK
    { wch: 25 }, // Email
    { wch: 12 }, // Phone
    { wch: 15 }, // Department
    { wch: 18 }, // Position
    { wch: 12 }, // Job Level
    { wch: 12 }, // Type
    { wch: 12 }, // Join Date
    { wch: 12 }, // Location
    { wch: 12 }, // Salary
    { wch: 15 }, // Manager
    { wch: 10 }  // Status
  ];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Template');
  
  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array' 
  });
  
  // Create blob and save
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  saveAs(blob, 'employee_template.xlsx');
};

/**
 * Export employees to Excel
 * @param {Array} employees - Array of employee objects
 * @param {string} filename - Output filename
 */
export const exportToExcel = (employees, filename = 'employees_export.xlsx') => {
  const exportData = employees.map(emp => ({
    'Full Name': emp.fullName || '',
    'NIK': emp.nik || '',
    'Email': emp.email || '',
    'Phone': emp.phone || '',
    'Department': emp.department || '',
    'Position': emp.position || '',
    'Job Level': emp.jobLevel || '',
    'Type': emp.employmentType || '',
    'Join Date': emp.joinDate || '',
    'Location': emp.workLocation || '',
    'Salary': emp.basicSalary || '',
    'Manager': emp.reportingManager || '',
    'Status': emp.employmentStatus || ''
  }));
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  worksheet['!cols'] = [
    { wch: 20 }, { wch: 12 }, { wch: 25 }, { wch: 12 },
    { wch: 15 }, { wch: 18 }, { wch: 12 }, { wch: 12 },
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 10 }
  ];
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
  
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array' 
  });
  
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  saveAs(blob, filename);
};

export default {
  parseExcel,
  generateTemplate,
  exportToExcel
};

