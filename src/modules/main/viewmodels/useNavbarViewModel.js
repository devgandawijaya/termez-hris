/**
 * Navbar ViewModel - Business logic for main Navbar
 * Handles mega menu state and navigation helpers
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Navbar ViewModel Hook
 * @returns {Object} Navbar state and helpers
 */
export function useNavbarViewModel() {
  // UI State
  const [open, setOpen] = useState(false);
  const [addonOpen, setAddonOpen] = useState(false);
  const [developerOpen, setDeveloperOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);

  // Toggle mobile menu
  const toggleOpen = useCallback(() => {
    setOpen((s) => !s);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setOpen(false);
  }, []);

  // Mega menu helpers
  const slugify = useCallback((s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  []);

  const makeLink = useCallback((cat, item) => `/page/${slugify(cat)}-${slugify(item)}`, [slugify]);

  // Close all mega menus
  const closeAllMenus = useCallback(() => {
    setAddonOpen(false);
    setDeveloperOpen(false);
    setEducationOpen(false);
  }, []);

  // Mega menu data - memoized to prevent recreation
  const addonFeatures = useMemo(() => [
    {
      icon: '📁',
      title: 'Core HR (Data & Administrasi)',
      items: [
        'Employee Database (Master Data Karyawan)',
        'Digital Employee File (Kontrak, Dokumen)',
        'Organization Structure',
        'Job Position & Grade Management',
        'Employment Status Tracking',
        'Employee Self-Service (ESS)',
      ],
    },
    {
      icon: '⏱️',
      title: 'Attendance & Time Management',
      items: [
        'Attendance (Absensi online/offline, GPS, biometric)',
        'Shift Scheduling',
        'Overtime Management',
        'Leave & Permission Management',
        'Timesheet',
        'Work From Home Monitoring',
      ],
    },
    {
      icon: '💰',
      title: 'Payroll & Compensation',
      items: [
        'Payroll Automation',
        'BPJS / Tax (PPh 21) Calculation',
        'Allowance & Deduction Management',
        'Bonus & Incentive Management',
        'Payslip Digital',
        'THR Management',
      ],
    },
    {
      icon: '🎯',
      title: 'Performance Management',
      items: [
        'KPI Management',
        'OKR Tracking',
        'Performance Appraisal',
        '360° Evaluation',
        'Performance Dashboard & Analytics',
        'Promotion & Career Path Tracking',
      ],
    },
    {
      icon: '👥',
      title: 'Recruitment & Talent Management',
      items: [
        'Applicant Tracking System (ATS)',
        'Job Posting & Career Portal',
        'CV Database',
        'Interview Scheduling',
        'Onboarding Management',
        'Talent Pool Management',
      ],
    },
    {
      icon: '📚',
      title: 'Learning & Development (LMS)',
      items: [
        'Training Management',
        'Certification Tracking',
        'Skill Matrix',
        'Competency Management',
        'Learning Progress Tracking',
      ],
    },
    {
      icon: '💬',
      title: 'Employee Engagement',
      items: [
        'Employee Survey',
        'Feedback System',
        'Announcement & Internal Communication',
        'Reward & Recognition',
        'Employee Satisfaction Tracking',
      ],
    },
    {
      icon: '⚖️',
      title: 'Compliance & Governance',
      items: [
        'Regulatory Compliance Monitoring',
        'Contract Expiry Alerts',
        'Audit Trail',
        'Document Expiry Reminder',
        'Policy Management',
      ],
    },
    {
      icon: '🤖',
      title: 'Advanced / Smart Features (AI-Based)',
      items: [
        'Predictive Turnover Analysis',
        'Workforce Planning Analytics',
        'AI Resume Screening',
        'Automated Performance Insights',
        'HR Dashboard & Business Intelligence',
      ],
    },
  ], []);

  const developerMenu = useMemo(() => [
    {
      icon: '📄',
      title: 'Documentation',
      items: [
        'API Documentation',
        'Integration Guide',
        'SDK & Libraries',
        'Webhooks',
      ],
    },
    {
      icon: '🔗',
      title: 'API & Integration',
      items: [
        'REST API',
        'Authentication (OAuth / JWT)',
        'API Keys Management',
        'Rate Limits',
      ],
    },
    {
      icon: '📦',
      title: 'Resources',
      items: [
        'Code Examples',
        'Postman Collection',
        'GitHub Repository',
        'Changelog',
      ],
    },
    {
      icon: '🛠️',
      title: 'Tools',
      items: [
        'API Playground',
        'Sandbox Environment',
        'System Status',
      ],
    },
    {
      icon: '💡',
      title: 'Support',
      items: [
        'Developer Forum',
        'Technical Support',
        'Report Bug',
      ],
    },
  ], []);

  const educationMenu = useMemo(() => [
    {
      icon: '🎓',
      title: 'Learning Center',
      items: [
        'HRMS Fundamentals',
        'AI in HR',
        'Payroll & Compliance',
        'KPI & Performance Management',
      ],
    },
    {
      icon: '🏋️',
      title: 'Training',
      items: [
        'Video Tutorials',
        'Live Webinar',
        'Certification Program',
        'Onboarding Guide',
      ],
    },
    {
      icon: '📘',
      title: 'Documentation',
      items: [
        'User Manual',
        'Admin Guide',
        'Implementation Guide',
      ],
    },
    {
      icon: '📊',
      title: 'Case Studies',
      items: [
        'Enterprise Case Study',
        'SME Implementation',
        'Government Sector',
      ],
    },
    {
      icon: '👥',
      title: 'Community',
      items: [
        'Knowledge Base',
        'FAQ',
        'Blog & Articles',
      ],
    },
  ], []);

  return {
    // State
    open,
    addonOpen,
    developerOpen,
    educationOpen,

    // Data
    addonFeatures,
    developerMenu,
    educationMenu,

    // Helpers
    slugify,
    makeLink,

    // Handlers
    toggleOpen,
    closeMobileMenu,
    closeAllMenus,

    // Setters
    setOpen,
    setAddonOpen,
    setDeveloperOpen,
    setEducationOpen,
  };
}

export default useNavbarViewModel;

