/**
 * Organization Structure ViewModel Hook
 * Business logic for hierarchical organization management
 * Handles data fetching, state management, and CRUD operations
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import organizationService from '../services/organizationService';

/**
 * useOrganizationViewModel Hook
 * Complete state management for organization structure
 */
export function useOrganizationViewModel() {
  // ============ STATE ============
  
  // Data state
  const [organizations, setOrganizations] = useState([]);
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [deletingOrg, setDeletingOrg] = useState(null);
  
  // Zoom & view state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);

  // ============ DATA LOADING ============
  
  /**
   * Load all organizations and build hierarchy
   */
  const loadOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load both flat list and hierarchy
      const [flatRes, hierarchyRes] = await Promise.all([
        organizationService.getAllOrganizations(),
        organizationService.getOrganizationHierarchy(),
      ]);
      
      if (flatRes.success) {
        setOrganizations(flatRes.data);
      } else {
        setError(flatRes.message);
      }
      
      if (hierarchyRes.success) {
        setHierarchy(hierarchyRes.data);
        // Expand root node by default
        if (hierarchyRes.data) {
          setExpandedNodes(new Set([hierarchyRes.data.id]));
        }
      } else {
        setError(hierarchyRes.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filter organizations based on search and filters
   */
  const filterOrganizations = useCallback(() => {
    let filtered = organizations;
    
    // Search by name
    if (searchQuery) {
      filtered = filtered.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by type
    if (selectedType) {
      filtered = filtered.filter((org) => org.type === selectedType);
    }
    
    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter((org) =>
        org.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }
    
    setFilteredOrganizations(filtered);
  }, [organizations, searchQuery, selectedType, selectedLocation]);

  // ============ NODE OPERATIONS ============
  
  /**
   * Toggle node expansion
   */
  const toggleNodeExpand = useCallback((nodeId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);
  
  /**
   * Expand all nodes
   */
  const expandAllNodes = useCallback(() => {
    const allIds = new Set(organizations.map((org) => org.id));
    setExpandedNodes(allIds);
  }, [organizations]);
  
  /**
   * Collapse all nodes
   */
  const collapseAllNodes = useCallback(() => {
    setExpandedNodes(new Set([hierarchy?.id])); // Keep only root
  }, [hierarchy?.id]);
  
  /**
   * Center chart view
   */
  const centerChart = useCallback(() => {
    setZoomLevel(100);
    setSelectedNode(null);
  }, []);
  
  /**
   * Zoom in
   */
  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  }, []);
  
  /**
   * Zoom out
   */
  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  }, []);

  // ============ CRUD OPERATIONS ============
  
  /**
   * Open create modal
   */
  const openCreateModal = useCallback((parentId = null) => {
    setEditingOrg({ parent_id: parentId });
    setShowCreateModal(true);
  }, []);
  
  /**
   * Close create modal
   */
  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingOrg(null);
  }, []);
  
  /**
   * Create organization
   */
  const handleCreate = useCallback(async (formData) => {
    try {
      setModalLoading(true);
      const result = await organizationService.createOrganization(formData);
      
      if (result.success) {
        await loadOrganizations();
        closeCreateModal();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Failed to create' };
    } finally {
      setModalLoading(false);
    }
  }, [loadOrganizations, closeCreateModal]);
  
  /**
   * Open edit modal
   */
  const openEditModal = useCallback((org) => {
    setEditingOrg(org);
    setShowEditModal(true);
  }, []);
  
  /**
   * Close edit modal
   */
  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingOrg(null);
  }, []);
  
  /**
   * Update organization
   */
  const handleUpdate = useCallback(
    async (formData) => {
      if (!editingOrg?.id) {
        return { success: false, message: 'No organization selected' };
      }
      
      try {
        setModalLoading(true);
        const result = await organizationService.updateOrganization(
          editingOrg.id,
          formData
        );
        
        if (result.success) {
          await loadOrganizations();
          closeEditModal();
          return { success: true, message: result.message };
        } else {
          return { success: false, message: result.message };
        }
      } catch (err) {
        return { success: false, message: err.message || 'Failed to update' };
      } finally {
        setModalLoading(false);
      }
    },
    [editingOrg, loadOrganizations, closeEditModal]
  );
  
  /**
   * Open delete confirmation
   */
  const openDeleteModal = useCallback((org) => {
    setDeletingOrg(org);
    setShowDeleteModal(true);
  }, []);
  
  /**
   * Close delete modal
   */
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeletingOrg(null);
  }, []);
  
  /**
   * Delete organization
   */
  const handleDelete = useCallback(async () => {
    if (!deletingOrg?.id) {
      return { success: false, message: 'No organization selected' };
    }
    
    try {
      setModalLoading(true);
      const result = await organizationService.deleteOrganization(deletingOrg.id);
      
      if (result.success) {
        await loadOrganizations();
        closeDeleteModal();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Failed to delete' };
    } finally {
      setModalLoading(false);
    }
  }, [deletingOrg, loadOrganizations, closeDeleteModal]);
  
  /**
   * Open detail modal
   */
  const openDetailModal = useCallback((org) => {
    setSelectedNode(org);
    setShowDetailModal(true);
  }, []);
  
  /**
   * Close detail modal
   */
  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedNode(null);
  }, []);
  
  /**
   * Move organization (change parent)
   */
  const handleMove = useCallback(
    async (orgId, newParentId) => {
      try {
        setModalLoading(true);
        const result = await organizationService.moveOrganization(
          orgId,
          newParentId
        );
        
        if (result.success) {
          await loadOrganizations();
          return { success: true, message: result.message };
        } else {
          return { success: false, message: result.message };
        }
      } catch (err) {
        return { success: false, message: err.message || 'Failed to move' };
      } finally {
        setModalLoading(false);
      }
    },
    [loadOrganizations]
  );

  // ============ EFFECTS (After All Callbacks Defined) ============
  
  /**
   * Load organizations on mount
   */
  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);
  
  /**
   * Filter organizations when search/filter changes
   */
  useEffect(() => {
    filterOrganizations();
  }, [searchQuery, selectedType, selectedLocation, organizations, filterOrganizations]);

  // ============ COMPUTED VALUES ============
  
  /**
   * Get unique locations for filter
   */
  const uniqueLocations = useMemo(() => {
    return [...new Set(organizations.map((org) => org.location))].filter(Boolean);
  }, [organizations]);
  
  /**
   * Get organization types for filter
   */
  const organizationTypes = useMemo(() => {
    return [...new Set(organizations.map((org) => org.type))];
  }, [organizations]);
  
  /**
   * Get children of specific organization
   */
  const getChildren = useCallback(
    (parentId) => {
      return organizations.filter((org) => org.parent_id === parentId);
    },
    [organizations]
  );
  
  /**
   * Get organization by ID
   */
  const getOrganizationById = useCallback(
    (id) => {
      return organizations.find((org) => org.id === id);
    },
    [organizations]
  );

  // ============ RETURN STATE & CALLBACKS ============
  
  return {
    // Data
    organizations,
    hierarchy,
    filteredOrganizations,
    loading,
    error,
    
    // UI State
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    expandedNodes,
    selectedNode,
    zoomLevel,
    
    // Computed
    uniqueLocations,
    organizationTypes,
    
    // Node Operations
    toggleNodeExpand,
    expandAllNodes,
    collapseAllNodes,
    centerChart,
    zoomIn,
    zoomOut,
    getChildren,
    getOrganizationById,
    
    // Create
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    handleCreate,
    
    // Edit
    showEditModal,
    editingOrg,
    openEditModal,
    closeEditModal,
    handleUpdate,
    
    // Delete
    showDeleteModal,
    deletingOrg,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    
    // Detail
    showDetailModal,
    openDetailModal,
    closeDetailModal,
    
    // Move
    handleMove,
    
    // Loading
    modalLoading,
  };
}

// Export as named export
export default useOrganizationViewModel;
