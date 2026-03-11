/**
 * Digital Employee File Service - Contract Document Management
 * CRUD operations for employee contract documents
 */

import employeeService from '../../employee/services/employeeService';

// Generate unique ID for documents
const generateDocId = () => 'DOC' + Math.random().toString(36).substr(2, 8).toUpperCase();

// In-memory document store (singleton pattern)
let documentStore = null;

/**
 * Initialize document store with dummy data
 */
const initializeStore = async () => {
  if (documentStore) return documentStore;
  
  // Get employees for reference
  const employees = await employeeService.getEmployees({ limit: 100 });
  const employeeList = employees.data;
  
  // Generate dummy documents
  documentStore = generateDummyDocuments(employeeList, 25);
  return documentStore;
};

/**
 * Generate dummy contract documents
 */
const generateDummyDocuments = (employees, count = 25) => {
  const documents = [];
  const documentTypes = [
    'Kontrak Kerja',
    'Perpanjangan Kontrak',
    'Kontrak Probation',
    'Perubahan Kontrak',
    'Kontrak Outsourcing'
  ];
  
  const sampleFileNames = [
    'Kontrak_Kerja_John_Doe.pdf',
    'Perpanjangan_Kontrak_Jane_Smith.docx',
    'Kontrak_Probation_Budi_Santoso.pdf',
    'Perubahan_Kontrak_Ani_Wati.doc',
    'Kontrak_Outsourcing_Tech_Co.pdf'
  ];

  for (let i = 0; i < count; i++) {
    const employee = employees[Math.floor(Math.random() * employees.length)];
    const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    const joinYear = 2018 + Math.floor(Math.random() * 7);
    const startDate = `${joinYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    const endYear = joinYear + Math.floor(Math.random() * 3) + 1;
    const endDate = `${endYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    
    documents.push({
      id: generateDocId(),
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeNik: employee.nik,
      employeePosition: employee.position,
      employeeDepartment: employee.department,
      documentTitle: `${docType} - ${employee.fullName}`,
      documentType: docType,
      contractStartDate: startDate,
      contractEndDate: endDate,
      fileName: sampleFileNames[Math.floor(Math.random() * sampleFileNames.length)],
      fileType: ['pdf', 'docx', 'doc'][Math.floor(Math.random() * 3)],
      fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB - 5MB
      fileUrl: '#',
      uploadedAt: `${2020 + Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      uploadedBy: 'Admin HR',
      description: docType === 'Kontrak Kerja' 
        ? 'Kontrak kerja baru untuk karyawan' 
        : docType === 'Perpanjangan Kontrak'
        ? 'Perpanjangan kontrak kerja'
        : 'Dokumen kontrak karyawan',
      status: Math.random() > 0.1 ? 'Active' : 'Expired'
    });
  }
  
  return documents;
};

// Initialize store
initializeStore();

/**
 * Get all documents with optional filters
 */
export const getDocuments = async (params = {}) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let result = [...documentStore];
  
  // Search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    result = result.filter(doc => 
      doc.employeeName.toLowerCase().includes(searchLower) ||
      doc.employeeNik.toLowerCase().includes(searchLower) ||
      doc.documentTitle.toLowerCase().includes(searchLower) ||
      doc.documentType.toLowerCase().includes(searchLower) ||
      doc.employeePosition.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by document type
  if (params.documentType) {
    result = result.filter(doc => doc.documentType === params.documentType);
  }
  
  // Filter by status
  if (params.status) {
    result = result.filter(doc => doc.status === params.status);
  }
  
  // Filter by employee
  if (params.employeeId) {
    result = result.filter(doc => doc.employeeId === params.employeeId);
  }
  
  // Sorting
  if (params.sortBy) {
    const sortKey = params.sortBy;
    const sortOrder = params.sortOrder || 'asc';
    result.sort((a, b) => {
      let aVal = a[sortKey] || '';
      let bVal = b[sortKey] || '';
      
      // Handle dates
      if (sortKey.includes('Date')) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }
  
  // Pagination
  const total = result.length;
  const page = params.page || 1;
  const limit = params.limit || 10;
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
};

/**
 * Get document by ID
 */
export const getDocumentById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const document = documentStore.find(doc => doc.id === id);
  if (!document) {
    throw new Error('Document not found');
  }
  return document;
};

/**
 * Create new document
 */
export const createDocument = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newDocument = {
    id: generateDocId(),
    ...data,
    uploadedAt: new Date().toISOString().split('T')[0],
    uploadedBy: 'Admin HR',
    status: new Date(data.contractEndDate) > new Date() ? 'Active' : 'Expired'
  };
  
  documentStore.unshift(newDocument);
  return newDocument;
};

/**
 * Update document
 */
export const updateDocument = async (id, data) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = documentStore.findIndex(doc => doc.id === id);
  if (index === -1) {
    throw new Error('Document not found');
  }
  
  documentStore[index] = {
    ...documentStore[index],
    ...data,
    status: new Date(data.contractEndDate) > new Date() ? 'Active' : 'Expired'
  };
  
  return documentStore[index];
};

/**
 * Delete document
 */
export const deleteDocument = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = documentStore.findIndex(doc => doc.id === id);
  if (index === -1) {
    throw new Error('Document not found');
  }
  
  documentStore.splice(index, 1);
  return { success: true, id };
};

/**
 * Get employees for dropdown
 */
export const getEmployeesForSelect = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const employees = await employeeService.getEmployees({ limit: 500 });
  
  return employees.data.map(emp => ({
    value: emp.id,
    label: emp.fullName,
    nik: emp.nik,
    position: emp.position,
    department: emp.department
  }));
};

/**
 * Get document type options
 */
export const getDocumentTypeOptions = () => {
  return [
    'Kontrak Kerja',
    'Perpanjangan Kontrak',
    'Kontrak Probation',
    'Perubahan Kontrak',
    'Kontrak Outsourcing',
    'Kontrak Part-Time',
    'Kontrak Freelance'
  ];
};

export default {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getEmployeesForSelect,
  getDocumentTypeOptions
};

