/**
 * Organization Structure Page
 * Main page for displaying and managing organizational structure
 * Integrates all components: chart, modals, filters, search, etc
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  ChevronRight,
} from 'lucide-react';
import useOrganizationViewModel from '../viewmodels/useOrganizationViewModel';
import OrganizationChart, { OrganizationChartFlat } from '../components/OrganizationChart';
import {
  OrganizationFormModal,
  DeleteConfirmationModal,
  DetailViewModal,
} from '../components/OrganizationModals';

/**
 * OrganizationStructurePage
 * Enterprise-grade organization structure management page
 */
export default function OrganizationStructurePage() {
  // ============ VIEW STATE ============
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'flat'

  // ============ VIEW MODEL ============
  const {
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
    centerChart,
    zoomIn,
    zoomOut,
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

    // Loading
    modalLoading,
  } = useOrganizationViewModel();

  // ============ PAGE HEADER ============
  const renderPageHeader = () => (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Admin</span>
        <ChevronRight className="w-4 h-4" />
        <span>Core HR</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-gray-900">Organization Structure</span>
      </div>

      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Organization Structure
        </h1>
        <p className="text-lg text-gray-600">
          Manage your company's hierarchical organizational structure, departments, and teams
        </p>
      </div>
    </div>
  );

  // ============ ACTION BAR ============
  const renderActionBar = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 flex flex-col sm:flex-row gap-4"
    >
      {/* Search Bar */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300
            focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            transition-colors placeholder-gray-500
          "
        />
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('chart')}
          className={`
            px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2
            ${
              viewMode === 'chart'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          title="Chart View"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="hidden sm:inline">Chart</span>
        </button>

        <button
          onClick={() => setViewMode('flat')}
          className={`
            px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2
            ${
              viewMode === 'flat'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
          title="List View"
        >
          <List className="w-5 h-5" />
          <span className="hidden sm:inline">List</span>
        </button>
      </div>

      {/* Add Button */}
      <motion.button
        onClick={() => openCreateModal()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="
          px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium
          hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2
        "
      >
        <Plus className="w-5 h-5" />
        <span>Add Unit</span>
      </motion.button>
    </motion.div>
  );

  // ============ FILTER BAR ============
  const renderFilterBar = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6 flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        <Filter className="w-5 h-5" />
        <span>Filter:</span>
      </div>

      {/* Type Filter */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="
          px-4 py-2 rounded-lg border border-gray-300 text-gray-700
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition-colors cursor-pointer
        "
      >
        <option value="">All Types</option>
        {organizationTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {/* Location Filter */}
      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="
          px-4 py-2 rounded-lg border border-gray-300 text-gray-700
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition-colors cursor-pointer
        "
      >
        <option value="">All Locations</option>
        {uniqueLocations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {(searchQuery || selectedType || selectedLocation) && (
        <motion.button
          onClick={() => {
            setSearchQuery('');
            setSelectedType('');
            setSelectedLocation('');
          }}
          whileHover={{ scale: 1.05 }}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Clear Filters
        </motion.button>
      )}

      <div className="flex-1" />

      {/* Results Count */}
      <span className="text-sm text-gray-600 whitespace-nowrap">
        {filteredOrganizations.length} result{filteredOrganizations.length !== 1 ? 's' : ''}
      </span>
    </motion.div>
  );

  // ============ CONTENT AREA ============
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96 bg-white rounded-lg border border-gray-200">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
          />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    if (viewMode === 'chart') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg border border-gray-200 shadow-md"
          style={{ minHeight: '500px' }}
        >
          <OrganizationChart
            hierarchy={hierarchy}
            expandedNodes={expandedNodes}
            onToggleExpand={toggleNodeExpand}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onAddChild={openCreateModal}
            onViewDetail={openDetailModal}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            centerChart={centerChart}
            zoomLevel={zoomLevel}
            loading={loading}
          />
        </motion.div>
      );
    } else {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg border border-gray-200 shadow-md"
        >
          <OrganizationChartFlat
            organizations={filteredOrganizations}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onAddChild={openCreateModal}
            onViewDetail={openDetailModal}
            loading={loading}
          />
        </motion.div>
      );
    }
  };

  // ============ PAGE STATE INFO ============
  const renderStateInfo = () => {
    if (organizations.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-200"
        >
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Organization Structure
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your organization chart by creating the root company unit
          </p>
          <motion.button
            onClick={() => openCreateModal()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium
              hover:bg-indigo-700 transition-colors inline-flex items-center gap-2
            "
          >
            <Plus className="w-5 h-5" />
            Create Organization
          </motion.button>
        </motion.div>
      );
    }

    return null;
  };

  // ============ RENDER PAGE ============
  return (
    <div className="pt-24 pb-12 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        {renderPageHeader()}

        {/* Action Bar */}
        {renderActionBar()}

        {/* Filter Bar */}
        {renderFilterBar()}

        {/* Main Content */}
        {renderStateInfo() || renderContent()}

        {/* Quick Stats */}
        {organizations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-gray-600 text-sm font-medium mb-1">Total Units</div>
              <div className="text-3xl font-bold text-gray-900">
                {organizations.length}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-gray-600 text-sm font-medium mb-1">Total Employees</div>
              <div className="text-3xl font-bold text-gray-900">
                {organizations.reduce((sum, org) => sum + (org.employee_count || 0), 0)}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-gray-600 text-sm font-medium mb-1">
                Organization Depth
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {hierarchy
                  ? Math.max(...[hierarchy].map((org) => getDepth(org)))
                  : 0}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-gray-600 text-sm font-medium mb-1">Locations</div>
              <div className="text-3xl font-bold text-gray-900">
                {uniqueLocations.length}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <OrganizationFormModal
        key={`create-${showCreateModal ? editingOrg?.id || editingOrg?.parent_id || 'root' : 'closed'}`}
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        onSubmit={handleCreate}
        initialData={null}
        isLoading={modalLoading}
        title={editingOrg?.id ? 'Edit Organization Unit' : 'Create Organization Unit'}
        parentOrganization={
          editingOrg?.parent_id
            ? getOrganizationById(editingOrg.parent_id)
            : null
        }
        allOrganizations={organizations}
      />

      <OrganizationFormModal
        key={`edit-${showEditModal ? editingOrg?.id || 'none' : 'closed'}`}
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSubmit={handleUpdate}
        initialData={editingOrg}
        isLoading={modalLoading}
        title="Edit Organization Unit"
        parentOrganization={
          editingOrg?.parent_id
            ? getOrganizationById(editingOrg.parent_id)
            : null
        }
        allOrganizations={organizations}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        organization={deletingOrg}
        isLoading={modalLoading}
      />

      <DetailViewModal
        isOpen={showDetailModal}
        onClose={closeDetailModal}
        organization={selectedNode}
        allOrganizations={organizations}
        onEdit={() => {
          openEditModal(selectedNode);
          closeDetailModal();
        }}
      />
    </div>
  );
}

/**
 * Helper function to calculate tree depth
 */
function getDepth(node, depth = 0) {
  if (!node || !node.children || node.children.length === 0) {
    return depth + 1;
  }
  return Math.max(...node.children.map((child) => getDepth(child, depth + 1)));
}
