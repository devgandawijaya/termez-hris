/**
 * Organization Chart Component - Card-Based Layout
 * Hierarchical tree visualization with clean card design
 * Displays organization structure with professional card layout
 */

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Maximize2,
} from 'lucide-react';
import OrganizationNode from './OrganizationNode';

/**
 * OrganizationChart Component
 * 
 * Props:
 * - hierarchy: Root organization object with children
 * - expandedNodes: Set of expanded node IDs
 * - onToggleExpand: Callback for toggling node expansion
 * - onEdit: Callback for edit action
 * - onDelete: Callback for delete action
 * - onAddChild: Callback for adding child
 * - onViewDetail: Callback for viewing details
 * - onZoomIn: Callback for zoom in
 * - onZoomOut: Callback for zoom out
 * - centerChart: Callback to center/reset chart
 * - zoomLevel: Current zoom level (0-200)
 * - loading: Whether chart is loading
 */
export default function OrganizationChart({
  hierarchy,
  expandedNodes = new Set(),
  onToggleExpand = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onAddChild = () => {},
  onViewDetail = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  centerChart = () => {},
  zoomLevel = 100,
  loading = false,
}) {
  /**
   * Render node recursively with card-based layout
   */
  const renderNode = useCallback(
    (org, level = 0) => {
      if (!org) return null;

      const isExpanded = expandedNodes.has(org.id);
      const children = org.children || [];
      const hasChildren = children.length > 0;

      return (
        <div
          key={org.id}
          className="flex flex-col items-center"
        >
          {/* Node Card */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: level * 0.05 }}
          >
            <OrganizationNode
              org={org}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              onToggleExpand={onToggleExpand}
              onEdit={() => onEdit(org)}
              onDelete={() => onDelete(org)}
              onAddChild={() => onAddChild(org)}
              onViewDetail={() => onViewDetail(org)}
              level={level}
            />
          </motion.div>

          {/* Vertical Line from Parent to Children */}
          {hasChildren && isExpanded && (
            <div
              className="
                h-6 border-l-2 border-gray-300
                mt-2
              "
            />
          )}

          {/* Children Container */}
          {isExpanded && hasChildren && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Horizontal Connector Line */}
              <div
                className="
                  h-2 flex items-center"
              >
                {children.length > 1 && (
                  <div
                    className="
                      border-t-2 border-gray-300
                    "
                    style={{
                      width: `${Math.max(180, children.length * 160)}px`,
                    }}
                  />
                )}
              </div>

              {/* Children - Grid Layout */}
              <div
                className="flex gap-4 mt-1 justify-center flex-wrap"
              >
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="relative flex flex-col items-center group"
                  >
                    {/* Vertical Line from Horizontal to Child */}
                    <div
                      className="
                        h-2 border-l-2 border-gray-300
                        absolute -top-2 left-1/2
                      "
                    />

                    {/* Render Child Recursively */}
                    <div className="pt-2">
                      {renderNode(child, level + 1)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      );
    },
    [expandedNodes, onToggleExpand, onEdit, onDelete, onAddChild, onViewDetail]
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  // No data state
  if (!hierarchy) {
    return (
      <div className="flex items-center justify-center h-96 w-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-600 font-medium">No organization structure found</p>
          <p className="text-sm text-gray-500 mt-1">
            Add a root organization unit to start
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-lg">
      {/* Chart Controls */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Organization Structure
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">Hierarchical view of your organization</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg border border-gray-200">
              <motion.button
                onClick={onZoomOut}
                disabled={zoomLevel <= 50}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  p-1 rounded hover:bg-gray-100 disabled:opacity-50
                  disabled:cursor-not-allowed transition-colors
                "
                title="Zoom Out"
              >
                <ZoomOutIcon className="w-5 h-5 text-gray-600" />
              </motion.button>

              <span className="text-sm font-semibold text-gray-700 min-w-12 text-center">
                {zoomLevel}%
              </span>

              <motion.button
                onClick={onZoomIn}
                disabled={zoomLevel >= 200}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  p-1 rounded hover:bg-gray-100 disabled:opacity-50
                  disabled:cursor-not-allowed transition-colors
                "
                title="Zoom In"
              >
                <ZoomInIcon className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            {/* Center Button */}
            <motion.button
              onClick={centerChart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                p-2 rounded-lg hover:bg-gray-100 transition-colors
                border border-gray-200 bg-white
              "
              title="Reset View"
            >
              <Maximize2 className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div
        className="
          flex-1 overflow-auto relative
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
        "
      >
        <motion.div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
          }}
          className="p-12 w-full flex justify-center"
        >
          {/* Root Node */}
          {renderNode(hierarchy, 0)}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * OrganizationChartFlat - Enhanced card-based list view
 * Shows all organizations as cards grouped by company in a comprehensive layout
 */
export function OrganizationChartFlat({
  organizations = [],
  onEdit = () => {},
  onDelete = () => {},
  onViewDetail = () => {},
  onAddChild = () => {},
  loading = false,
}) {
  const typeConfig = {
    company: {
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      headerColor: 'bg-gradient-to-r from-blue-600 to-blue-700',
      icon: '🏢',
      label: 'Company',
    },
    division: {
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-300',
      headerColor: 'bg-gradient-to-r from-purple-600 to-purple-700',
      icon: '📊',
      label: 'Division',
    },
    department: {
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-300',
      headerColor: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
      icon: '👥',
      label: 'Department',
    },
    team: {
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-300',
      headerColor: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
      icon: '👨‍💼',
      label: 'Team',
    },
    position: {
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-300',
      headerColor: 'bg-gradient-to-r from-amber-600 to-amber-700',
      icon: '🎯',
      label: 'Position',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">No organizations found</p>
          <p className="text-sm text-gray-600">Try adjusting your filters or search</p>
        </div>
      </div>
    );
  }

  // Group organizations by type
  const groupedByType = organizations.reduce((acc, org) => {
    if (!acc[org.type]) {
      acc[org.type] = [];
    }
    acc[org.type].push(org);
    return acc;
  }, {});

  const typeOrder = ['company', 'division', 'department', 'team', 'position'];

  return (
    <div className="space-y-8 p-6">
      {typeOrder.map((type) => {
        if (!groupedByType[type]) return null;
        const config = typeConfig[type];
        const items = groupedByType[type];

        return (
          <div key={type}>
            {/* Section Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                {config.label}s ({items.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                All {config.label.toLowerCase()} units in your organization
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((org) => (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    rounded-xl border-2 overflow-hidden
                    transition-all duration-300 shadow-md hover:shadow-xl
                    ${config.bgColor} group cursor-pointer
                  `}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  {/* Header */}
                  <div
                    className={`
                      ${config.headerColor} px-4 py-3
                      flex items-center justify-between text-white
                    `}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0">{config.icon}</span>
                      <h4 className="font-bold truncate text-sm">{org.name}</h4>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 py-3 space-y-2">
                    {/* Location */}
                    {org.location && (
                      <div className="text-xs text-gray-700 flex items-center gap-1">
                        <span>📍</span> {org.location}
                      </div>
                    )}

                    {/* Employee Count */}
                    {org.employee_count > 0 && (
                      <div className="text-xs text-gray-700 flex items-center gap-1">
                        <span>👥</span>
                        {org.employee_count} employee{org.employee_count > 1 ? 's' : ''}
                      </div>
                    )}

                    {/* Description */}
                    {org.description && (
                      <p className="text-xs text-gray-700 line-clamp-2">
                        {org.description}
                      </p>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2" />

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <motion.button
                        onClick={() => onViewDetail(org)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                          flex-1 min-w-[60px] px-2 py-1.5 text-xs font-medium
                          rounded bg-blue-100 text-blue-700
                          hover:bg-blue-200 transition-colors
                        "
                      >
                        View
                      </motion.button>
                      <motion.button
                        onClick={() => onAddChild(org)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                          flex-1 min-w-[60px] px-2 py-1.5 text-xs font-medium
                          rounded bg-green-100 text-green-700
                          hover:bg-green-200 transition-colors
                        "
                      >
                        Add
                      </motion.button>
                      <motion.button
                        onClick={() => onEdit(org)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                          flex-1 min-w-[60px] px-2 py-1.5 text-xs font-medium
                          rounded bg-indigo-100 text-indigo-700
                          hover:bg-indigo-200 transition-colors
                        "
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => onDelete(org)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="
                          flex-1 min-w-[60px] px-2 py-1.5 text-xs font-medium
                          rounded bg-red-100 text-red-700
                          hover:bg-red-200 transition-colors
                        "
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
