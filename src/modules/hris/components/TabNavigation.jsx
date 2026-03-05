/**
 * Tab Navigation Component - Horizontal tab navigation for employee detail
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Briefcase, 
  Building2, 
  DollarSign, 
  Users, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  Package 
} from 'lucide-react';

/**
 * Icon mapping
 */
const iconMap = {
  User,
  Briefcase,
  Building2,
  DollarSign,
  Users,
  GraduationCap,
  FileText,
  TrendingUp,
  Package
};

/**
 * Tab Navigation Component
 */
export default function TabNavigation({ 
  tabs = [], 
  activeTab, 
  onTabChange,
  className = '' 
}) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="flex -mb-px space-x-1 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const IconComponent = iconMap[tab.icon] || User;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group relative flex items-center py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap
                transition-all duration-200
                ${isActive
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <IconComponent className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {tab.label}
              
              {/* Active indicator animation */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * Tab Panel Component - Content wrapper for each tab
 */
export function TabPanel({ 
  children, 
  activeTab, 
  tabId,
  className = '' 
}) {
  if (activeTab !== tabId) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

