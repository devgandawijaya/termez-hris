/**
 * Organization Utilities
 * Helper functions for organization structure management
 */

/**
 * Organization Type Metadata
 */
export const OrganizationTypeMetadata = {
  company: {
    label: 'Company',
    color: 'blue',
    icon: '🏢',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    lightTextColor: 'text-blue-600',
    description: 'Main company entity',
  },
  division: {
    label: 'Division',
    color: 'purple',
    icon: '📊',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    lightTextColor: 'text-purple-600',
    description: 'Major division or business unit',
  },
  department: {
    label: 'Department',
    color: 'indigo',
    icon: '👥',
    gradientFrom: 'from-indigo-600',
    gradientTo: 'to-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    lightTextColor: 'text-indigo-600',
    description: 'Department within a division',
  },
  team: {
    label: 'Team',
    color: 'emerald',
    icon: '👨‍💼',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    lightTextColor: 'text-emerald-600',
    description: 'Small team or subunit',
  },
  position: {
    label: 'Position',
    color: 'amber',
    icon: '🎯',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    lightTextColor: 'text-amber-600',
    description: 'Individual position',
  },
};

/**
 * Get metadata for organization type
 * @param {string} type - Organization type
 * @returns {Object} Type metadata
 */
export function getTypeMetadata(type) {
  return OrganizationTypeMetadata[type] || OrganizationTypeMetadata.team;
}

/**
 * Calculate tree depth recursively
 * @param {Object} node - Root node
 * @param {number} depth - Current depth
 * @returns {number} Maximum depth
 */
export function calculateTreeDepth(node, depth = 0) {
  if (!node || !node.children || node.children.length === 0) {
    return depth + 1;
  }
  return Math.max(...node.children.map((child) => calculateTreeDepth(child, depth + 1)));
}

/**
 * Count total nodes in tree
 * @param {Object} node - Root node
 * @returns {number} Total node count
 */
export function countTreeNodes(node) {
  if (!node) return 0;
  let count = 1;
  if (node.children && node.children.length > 0) {
    count += node.children.reduce((sum, child) => sum + countTreeNodes(child), 0);
  }
  return count;
}

/**
 * Find node in tree by ID
 * @param {Object} node - Root node
 * @param {string} id - Node ID to find
 * @returns {Object|null} Found node or null
 */
export function findNodeById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Flatten tree to array
 * @param {Object} node - Root node
 * @param {Array} result - Result array
 * @returns {Array} Flattened array of all nodes
 */
export function flattenTree(node, result = []) {
  if (!node) return result;

  result.push(node);

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => flattenTree(child, result));
  }

  return result;
}

/**
 * Get path to node from root
 * @param {Object} tree - Root tree
 * @param {string} targetId - Target node ID
 * @returns {Array} Array of nodes from root to target
 */
export function getPathToNode(tree, targetId, path = []) {
  if (!tree) return [];

  const newPath = [...path, tree];

  if (tree.id === targetId) {
    return newPath;
  }

  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const result = getPathToNode(child, targetId, newPath);
      if (result.length > 0) return result;
    }
  }

  return [];
}

/**
 * Format employee count display
 * @param {number} count - Employee count
 * @returns {string} Formatted string
 */
export function formatEmployeeCount(count) {
  if (count === 0) return 'No employees';
  if (count === 1) return '1 employee';
  return `${count} employees`;
}

/**
 * Format date display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
}

/**
 * Validate organization data
 * @param {Object} data - Organization data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export function validateOrganizationData(data) {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Organization name is required';
  } else if (data.name.length < 2) {
    errors.name = 'Organization name must be at least 2 characters';
  } else if (data.name.length > 255) {
    errors.name = 'Organization name must be less than 255 characters';
  }

  if (!data.type) {
    errors.type = 'Organization type is required';
  } else if (!OrganizationTypeMetadata[data.type]) {
    errors.type = 'Invalid organization type';
  }

  if (data.employee_count !== undefined && data.employee_count !== null) {
    if (!Number.isInteger(data.employee_count) || data.employee_count < 0) {
      errors.employee_count = 'Employee count must be a non-negative integer';
    }
  }

  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Export utilities
 */
export default {
  OrganizationTypeMetadata,
  getTypeMetadata,
  calculateTreeDepth,
  countTreeNodes,
  findNodeById,
  flattenTree,
  getPathToNode,
  formatEmployeeCount,
  formatDate,
  validateOrganizationData,
};
