/**
 * Organization Node Component
 * Individual node in the organization chart with interactive features
 * Displays organization info with actions (Edit, Delete, Add Child, etc)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Plus,
  Edit2,
  Trash2,
  Users,
} from 'lucide-react';

/**
 * Organization Structure Types - Improved Card Design
 */
const typeConfig = {
  company: {
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
    headerColor: 'bg-gradient-to-r from-blue-600 to-blue-700',
    badgeColor: 'bg-blue-100 text-blue-700',
    icon: '🏢',
    label: 'Company',
  },
  division: {
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    borderColor: 'border-purple-300',
    headerColor: 'bg-gradient-to-r from-purple-600 to-purple-700',
    badgeColor: 'bg-purple-100 text-purple-700',
    icon: '📊',
    label: 'Division',
  },
  department: {
    bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-300',
    headerColor: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    icon: '👥',
    label: 'Department',
  },
  team: {
    bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-300',
    headerColor: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    icon: '👨‍💼',
    label: 'Team',
  },
  position: {
    bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
    borderColor: 'border-amber-300',
    headerColor: 'bg-gradient-to-r from-amber-600 to-amber-700',
    badgeColor: 'bg-amber-100 text-amber-700',
    icon: '🎯',
    label: 'Position',
  },
};

/**
 * OrganizationNode Component
 * 
 * Props:
 * - org: Organization object
 * - isExpanded: Whether node is expanded
 * - hasChildren: Whether node has children
 * - onToggleExpand: Callback for toggling expansion
 * - onEdit: Callback for edit action
 * - onDelete: Callback for delete action
 * - onAddChild: Callback for adding child
 * - onViewDetail: Callback for viewing details
 * - level: Depth level in tree (for indentation)
 */
export default function OrganizationNode({
  org,
  isExpanded = false,
  hasChildren = false,
  onToggleExpand = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onAddChild = () => {},
  onViewDetail = () => {},
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get type configuration
  const config = useMemo(() => typeConfig[org.type] || typeConfig.team, [org.type]);

  // Animation variants
  const nodeVariants = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const expandButtonVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 90 },
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <motion.div
      variants={nodeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex flex-col w-64"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <motion.div
        className={`
          rounded-lg border-2 overflow-hidden
          transition-all duration-200 shadow-sm hover:shadow-md
          ${config.bgColor}
          ${isHovered ? config.borderColor : 'border-gray-200'}
        `}
        animate={{
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -4 : 0,
        }}
      >
        {/* Header Section - Type & Icon */}
        <div
          className={`
            ${config.headerColor} px-3 py-2
            flex items-center justify-between text-white
          `}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <p className="text-xs font-semibold opacity-90">{config.label}</p>
              <h3 className="text-sm font-bold truncate max-w-48">{org.name}</h3>
            </div>
          </div>

          {/* Expand Button */}
          {hasChildren && (
            <motion.button
              variants={expandButtonVariants}
              animate={isExpanded ? 'expanded' : 'collapsed'}
              onClick={() => onToggleExpand(org.id)}
              className="
                flex-shrink-0 p-1 rounded-lg
                hover:bg-white hover:bg-opacity-20
                transition-colors
              "
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>

        {/* Content Section */}
        <div className="px-4 py-3 space-y-2">
          {/* Organization Details */}
          <div className="space-y-0.5">
            {org.description && (
              <p className="text-xs text-gray-700 line-clamp-2">
                {org.description}
              </p>
            )}

            {/* Location */}
            {org.location && (
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <span>📍</span> {org.location}
              </div>
            )}

            {/* Employee Count */}
            {org.employee_count > 0 && (
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{org.employee_count} employee{org.employee_count > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-2" />

          {/* Footer with Badge and Menu */}
          <div className="flex items-center justify-between mt-1">
            {/* Badge */}
            <span
              className={`
                inline-block px-2.5 py-1 rounded-full text-xs font-semibold
                ${config.badgeColor}
              `}
            >
              {org.type.charAt(0).toUpperCase() + org.type.slice(1)}
            </span>

            {/* Action Menu Button */}
            <div className="relative">
              <motion.button
                onClick={() => setShowMenu(!showMenu)}
                className="
                  p-1.5 rounded-lg transition-colors
                  hover:bg-gray-300 hover:bg-opacity-30
                  text-gray-700
                "
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Actions"
              >
                <MoreVertical className="w-4 h-4" />
              </motion.button>

              {/* Action Menu Dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="
                      absolute right-0 top-10 w-56 bg-white
                      rounded-lg shadow-xl border border-gray-200
                      overflow-hidden z-50
                      backdrop-blur-sm
                    "
                  >
                    <button
                      onClick={() => {
                        onViewDetail();
                        setShowMenu(false);
                      }}
                      className="
                        w-full text-left px-4 py-3 text-sm text-gray-700
                        hover:bg-blue-50 transition-colors flex items-center gap-3
                        border-b border-gray-100
                        hover:text-blue-700
                      "
                    >
                      <Users className="w-4 h-4" />
                      <span className="font-medium">View Details</span>
                    </button>

                    <button
                      onClick={() => {
                        onAddChild();
                        setShowMenu(false);
                      }}
                      className="
                        w-full text-left px-4 py-3 text-sm text-gray-700
                        hover:bg-green-50 transition-colors flex items-center gap-3
                        border-b border-gray-100
                        hover:text-green-700
                      "
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Sub Unit</span>
                    </button>

                    <button
                      onClick={() => {
                        onEdit();
                        setShowMenu(false);
                      }}
                      className="
                        w-full text-left px-4 py-3 text-sm text-gray-700
                        hover:bg-indigo-50 transition-colors flex items-center gap-3
                        border-b border-gray-100
                        hover:text-indigo-700
                      "
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="font-medium">Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="
                        w-full text-left px-4 py-3 text-sm text-gray-700
                        hover:bg-red-50 transition-colors flex items-center gap-3
                        hover:text-red-700
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="font-medium">Delete</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * OrganizationNodeCompact - Compact version for tree view
 * Smaller, more condensed node display
 */
export function OrganizationNodeCompact({
  org,
  isExpanded = false,
  hasChildren = false,
  onToggleExpand = () => {},
}) {
  const config = useMemo(() => typeConfig[org.type] || typeConfig.team, [org.type]);

  return (
    <div className="py-1">
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100">
        {hasChildren && (
          <button
            onClick={() => onToggleExpand(org.id)}
            className="p-0 transition-transform"
            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        <span className="text-sm flex-shrink-0">{config.icon}</span>
        <span className="text-sm font-medium text-gray-700 flex-1 truncate">
          {org.name}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${config.textColor}`}>
          {org.type}
        </span>
      </div>
    </div>
  );
}
