/**
 * Summary Card Component - Enterprise Dashboard Card
 * Used for displaying statistics in Employee Database Page
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  Building2, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX
} from 'lucide-react';

/**
 * Icon mapping for card types
 */
const iconMap = {
  users: Users,
  briefcase: Briefcase,
  building: Building2,
  dollar: DollarSign
};

/**
 * Default animation variants
 */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  })
};

/**
 * Summary Card Component
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {string} props.subtitle - Subtitle or additional info
 * @param {string} props.icon - Icon type (users, briefcase, building, dollar)
 * @param {string} props.color - Theme color (indigo, emerald, amber, rose, etc.)
 * @param {number} props.trend - Trend percentage (positive or negative)
 * @param {Array} props.badge - Array of badge objects [{label, value, color}]
 * @param {number} props.index - Animation index
 */
export default function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon = 'users',
  color = 'indigo',
  trend,
  badge,
  index = 0
}) {
  const IconComponent = iconMap[icon] || Users;
  
  // Color configurations
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      gradient: 'from-amber-500 to-amber-600'
    },
    rose: {
      bg: 'bg-rose-50',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      gradient: 'from-rose-500 to-rose-600'
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600'
    }
  };
  
  const colors = colorClasses[color] || colorClasses.indigo;
  
  // Format number with commas
  const formatNumber = (num) => {
    if (typeof num === 'number') {
      return num.toLocaleString('id-ID');
    }
    return num;
  };
  
  // Format currency
  const formatCurrency = (num) => {
    if (typeof num === 'number') {
      return 'Rp ' + num.toLocaleString('id-ID', { maximumFractionDigits: 0 });
    }
    return num;
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.12)'
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative"
    >
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.gradient}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-lg ${colors.iconBg}`}>
            <IconComponent className={`w-5 h-5 ${colors.iconColor}`} />
          </div>
          
          {trend !== undefined && (
            <div className={`flex items-center text-sm font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        {/* Value */}
        <div className="mb-1">
          <h3 className="text-2xl font-bold text-gray-900">
            {icon === 'dollar' ? formatCurrency(value) : formatNumber(value)}
          </h3>
        </div>
        
        {/* Title */}
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        
        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
        
        {/* Badges */}
        {badge && badge.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {badge.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center text-xs"
              >
                <span className={`w-2 h-2 rounded-full mr-1.5 ${item.color === 'green' ? 'bg-emerald-500' : item.color === 'yellow' ? 'bg-amber-500' : item.color === 'red' ? 'bg-rose-500' : 'bg-gray-400'}`} />
                <span className="text-gray-600">{item.label}:</span>
                <span className="font-semibold ml-1 text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Badge component helper
export function createBadge(label, value, type = 'default') {
  const colorMap = {
    green: 'green',
    yellow: 'yellow',
    red: 'red',
    default: 'default'
  };
  return { label, value, color: colorMap[type] || 'default' };
}

