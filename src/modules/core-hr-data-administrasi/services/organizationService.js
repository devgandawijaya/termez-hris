/**
 * Organization Service - HRIS Organization Structure Management
 * Implements enterprise-grade hierarchical organization management
 * Supports CRUD operations, hierarchy management, and tree traversal
 */

import axios from 'axios';
import apiConfig from '../../../core/config/apiConfig';

// Create axios instance
const client = axios.create(apiConfig);

// Include token in requests
client.interceptors.request.use((cfg) => {
  try {
    const tok = sessionStorage.getItem('token');
    if (tok) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${tok}`;
    }
  } catch {
    // Ignore
  }
  return cfg;
});

/**
 * Organization Types
 */
export const OrganizationType = {
  COMPANY: 'company',
  DIVISION: 'division',
  DEPARTMENT: 'department',
  TEAM: 'team',
  POSITION: 'position',
};

/**
 * Mock data generator - Initial organization structure
 */
const generateMockOrganization = () => {
  return [
    {
      id: 'ORG_001',
      name: 'PT Termez Indonesia',
      type: OrganizationType.COMPANY,
      parent_id: null,
      manager_id: 'EMP_001',
      description: 'Parent company - Head Office',
      employee_count: 150,
      location: 'Jakarta',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z',
    },
    {
      id: 'ORG_002',
      name: 'Technology Division',
      type: OrganizationType.DIVISION,
      parent_id: 'ORG_001',
      manager_id: 'EMP_002',
      description: 'Digital & Technology Solutions',
      employee_count: 60,
      location: 'Jakarta',
      created_at: '2023-02-01T00:00:00Z',
      updated_at: '2024-11-15T00:00:00Z',
    },
    {
      id: 'ORG_003',
      name: 'Engineering Department',
      type: OrganizationType.DEPARTMENT,
      parent_id: 'ORG_002',
      manager_id: 'EMP_003',
      description: 'Software & Infrastructure Engineering',
      employee_count: 35,
      location: 'Jakarta',
      created_at: '2023-02-15T00:00:00Z',
      updated_at: '2024-11-20T00:00:00Z',
    },
    {
      id: 'ORG_004',
      name: 'Backend Team',
      type: OrganizationType.TEAM,
      parent_id: 'ORG_003',
      manager_id: 'EMP_004',
      description: 'Backend Development & APIs',
      employee_count: 12,
      location: 'Jakarta',
      created_at: '2023-03-01T00:00:00Z',
      updated_at: '2024-11-18T00:00:00Z',
    },
    {
      id: 'ORG_005',
      name: 'Frontend Team',
      type: OrganizationType.TEAM,
      parent_id: 'ORG_003',
      manager_id: 'EMP_005',
      description: 'Frontend & UI Development',
      employee_count: 10,
      location: 'Jakarta',
      created_at: '2023-03-01T00:00:00Z',
      updated_at: '2024-11-18T00:00:00Z',
    },
    {
      id: 'ORG_006',
      name: 'QA & Testing Team',
      type: OrganizationType.TEAM,
      parent_id: 'ORG_003',
      manager_id: 'EMP_006',
      description: 'Quality Assurance & Testing',
      employee_count: 8,
      location: 'Jakarta',
      created_at: '2023-03-01T00:00:00Z',
      updated_at: '2024-11-18T00:00:00Z',
    },
    {
      id: 'ORG_007',
      name: 'Product Department',
      type: OrganizationType.DEPARTMENT,
      parent_id: 'ORG_002',
      manager_id: 'EMP_007',
      description: 'Product Management & Strategy',
      employee_count: 15,
      location: 'Jakarta',
      created_at: '2023-04-01T00:00:00Z',
      updated_at: '2024-11-20T00:00:00Z',
    },
    {
      id: 'ORG_008',
      name: 'Product Management Team',
      type: OrganizationType.TEAM,
      parent_id: 'ORG_007',
      manager_id: 'EMP_008',
      description: 'Product Managers & Analysts',
      employee_count: 8,
      location: 'Jakarta',
      created_at: '2023-04-15T00:00:00Z',
      updated_at: '2024-11-18T00:00:00Z',
    },
    {
      id: 'ORG_009',
      name: 'Design Team',
      type: OrganizationType.TEAM,
      parent_id: 'ORG_007',
      manager_id: 'EMP_009',
      description: 'UX/UI & Design',
      employee_count: 7,
      location: 'Jakarta',
      created_at: '2023-04-15T00:00:00Z',
      updated_at: '2024-11-18T00:00:00Z',
    },
    {
      id: 'ORG_010',
      name: 'Human Resources Division',
      type: OrganizationType.DIVISION,
      parent_id: 'ORG_001',
      manager_id: 'EMP_010',
      description: 'HR & Talent Management',
      employee_count: 25,
      location: 'Jakarta',
      created_at: '2023-05-01T00:00:00Z',
      updated_at: '2024-11-20T00:00:00Z',
    },
    {
      id: 'ORG_011',
      name: 'Finance Division',
      type: OrganizationType.DIVISION,
      parent_id: 'ORG_001',
      manager_id: 'EMP_011',
      description: 'Finance & Accounting',
      employee_count: 20,
      location: 'Jakarta',
      created_at: '2023-06-01T00:00:00Z',
      updated_at: '2024-11-20T00:00:00Z',
    },
  ];
};

// In-memory store (similar to employeeService)
let organizationStore = null;

/**
 * Initialize organization store
 */
const initializeStore = () => {
  if (organizationStore) return organizationStore;
  organizationStore = generateMockOrganization();
  return organizationStore;
};

/**
 * Get all organization units
 * @returns {Promise} Array of organization units
 */
export async function getAllOrganizations() {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    const store = initializeStore();
    return {
      success: true,
      data: store,
      message: 'Organization units retrieved successfully',
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err.message || 'Failed to retrieve organization units',
    };
  }
}

/**
 * Get organization unit by ID
 * @param {string} id - Organization unit ID
 * @returns {Promise} Organization unit object
 */
export async function getOrganizationById(id) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const store = initializeStore();
    const org = store.find((o) => o.id === id);
    
    if (!org) {
      return {
        success: false,
        data: null,
        message: `Organization unit with ID ${id} not found`,
      };
    }
    
    return {
      success: true,
      data: org,
      message: 'Organization unit retrieved successfully',
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err.message || 'Failed to retrieve organization unit',
    };
  }
}

/**
 * Get children of organization unit
 * @param {string} parentId - Parent organization ID
 * @returns {Promise} Array of child organization units
 */
export async function getOrganizationChildren(parentId) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const store = initializeStore();
    const children = store.filter((o) => o.parent_id === parentId);
    
    return {
      success: true,
      data: children,
      message: 'Child organization units retrieved successfully',
    };
  } catch (err) {
    return {
      success: false,
      data: [],
      message: err.message || 'Failed to retrieve child organization units',
    };
  }
}

/**
 * Get organization hierarchy (tree structure)
 * @returns {Promise} Hierarchical organization tree
 */
export async function getOrganizationHierarchy() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const store = initializeStore();
    
    // Find root (company)
    const root = store.find((o) => o.parent_id === null);
    if (!root) {
      return {
        success: false,
        data: null,
        message: 'No root organization found',
      };
    }
    
    // Build tree
    const buildTree = (org) => ({
      ...org,
      children: store
        .filter((o) => o.parent_id === org.id)
        .map((child) => buildTree(child)),
    });
    
    const tree = buildTree(root);
    
    return {
      success: true,
      data: tree,
      message: 'Organization hierarchy retrieved successfully',
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err.message || 'Failed to retrieve organization hierarchy',
    };
  }
}

/**
 * Create organization unit
 * @param {Object} orgData - Organization unit data
 * @returns {Promise} Created organization unit
 */
export async function createOrganization(orgData) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const store = initializeStore();
    
    // Validate required fields
    if (!orgData.name || !orgData.type) {
      return {
        success: false,
        data: null,
        message: 'Name and type are required',
      };
    }
    
    // Generate ID
    const id = `ORG_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const newOrg = {
      id,
      name: orgData.name,
      type: orgData.type,
      parent_id: orgData.parent_id || null,
      manager_id: orgData.manager_id || null,
      description: orgData.description || '',
      employee_count: orgData.employee_count || 0,
      location: orgData.location || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    organizationStore.push(newOrg);
    
    return {
      success: true,
      data: newOrg,
      message: 'Organization unit created successfully',
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err.message || 'Failed to create organization unit',
    };
  }
}

/**
 * Update organization unit
 * @param {string} id - Organization unit ID
 * @param {Object} updates - Updated fields
 * @returns {Promise} Updated organization unit
 */
export async function updateOrganization(id, updates) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const store = initializeStore();
    
    const index = store.findIndex((o) => o.id === id);
    
    if (index === -1) {
      return {
        success: false,
        data: null,
        message: `Organization unit with ID ${id} not found`,
      };
    }
    
    const updated = {
      ...store[index],
      ...updates,
      id: store[index].id, // Prevent ID change
      created_at: store[index].created_at, // Prevent creation date change
      updated_at: new Date().toISOString(),
    };
    
    organizationStore[index] = updated;
    
    return {
      success: true,
      data: updated,
      message: 'Organization unit updated successfully',
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err.message || 'Failed to update organization unit',
    };
  }
}

/**
 * Delete organization unit
 * @param {string} id - Organization unit ID
 * @returns {Promise} Deletion result
 */
export async function deleteOrganization(id) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const store = initializeStore();
    
    // Check if organization has children
    const hasChildren = store.some((o) => o.parent_id === id);
    if (hasChildren) {
      return {
        success: false,
        data: null,
        message: 'Cannot delete organization unit with child units. Delete children first.',
      };
    }
    
    const index = store.findIndex((o) => o.id === id);
    
    if (index === -1) {
      return {
        success: false,
        data: null,
        message: `Organization unit with ID ${id} not found`,
      };
    }
    
    const deleted = store.splice(index, 1)[0];
    
    return {
      success: true,
      data: deleted,
      message: 'Organization unit deleted successfully',
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err.message || 'Failed to delete organization unit',
    };
  }
}

/**
 * Move organization unit (change parent)
 * @param {string} id - Organization unit ID
 * @param {string} newParentId - New parent ID
 * @returns {Promise} Updated organization unit
 */
export async function moveOrganization(id, newParentId) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const store = initializeStore();
    
    // Check for circular reference
    const checkCircular = (orgId, parentId) => {
      if (orgId === parentId) return true;
      const parent = store.find((o) => o.id === parentId);
      if (!parent || !parent.parent_id) return false;
      return checkCircular(orgId, parent.parent_id);
    };
    
    if (newParentId && checkCircular(id, newParentId)) {
      return {
        success: false,
        data: null,
        message: 'Cannot move organization unit to its own child',
      };
    }
    
    return updateOrganization(id, { parent_id: newParentId });
  } catch (err) {
    return {
      success: false,
      data: null,
      message: err.message || 'Failed to move organization unit',
    };
  }
}

/**
 * Search organizations
 * @param {Object} filters - Search filters
 * @returns {Promise} Filtered organization array
 */
export async function searchOrganizations(filters = {}) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const store = initializeStore();
    
    let results = store;
    
    if (filters.name) {
      results = results.filter((o) =>
        o.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.type) {
      results = results.filter((o) => o.type === filters.type);
    }
    
    if (filters.location) {
      results = results.filter((o) =>
        o.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.parent_id) {
      results = results.filter((o) => o.parent_id === filters.parent_id);
    }
    
    return {
      success: true,
      data: results,
      message: 'Organizations searched successfully',
    };
  } catch (err) {
    return {
      success: false,
      data: [],
      message: err.message || 'Failed to search organizations',
    };
  }
}

/**
 * Export service as default
 */
const organizationService = {
  getAllOrganizations,
  getOrganizationById,
  getOrganizationChildren,
  getOrganizationHierarchy,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  moveOrganization,
  searchOrganizations,
};

export default organizationService;
