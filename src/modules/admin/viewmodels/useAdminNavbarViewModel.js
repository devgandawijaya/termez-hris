/**
 * Admin Navbar ViewModel - Business logic for admin navigation
 * Handles user data, logout, and mega menu state
 */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';

/**
 * Admin Navbar ViewModel Hook
 * @returns {Object} Admin navbar state and handlers
 */
export function useAdminNavbarViewModel() {
  const navigate = useNavigate();
  
  // UI State
  const [showDropdown, setShowDropdown] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [helpdeskOpen, setHelpdeskOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Mega menu data - kept here to avoid duplication in UI
  const slugify = useCallback((s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  []);

  const makeLink = useCallback((menuType, cat, item) => {
    const menuSlug = slugify(menuType);
    const catSlug = slugify(cat);
    const itemSlug = slugify(item);
    return `/${menuSlug}/${catSlug}/${itemSlug}`;
  }, [slugify]);

  // Mega menu structures
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

  const educationMenu = useMemo(() => [
    {
      icon: '📄',
      title: 'Documentation',
      items: [
        'User Guide',
        'Admin Guide',
        'API Documentation',
        'System Architecture',
        'Release Notes',
      ],
    },
    {
      icon: '🎬',
      title: 'Video Tutorials',
      items: [
        'Getting Started',
        'Feature Walkthrough',
        'Advanced Configuration',
        'Best Practice Implementation',
      ],
    },
    {
      icon: '📚',
      title: 'Knowledge Base',
      items: [
        'How-To Articles',
        'FAQ',
        'Troubleshooting',
        'Tips & Tricks',
      ],
    },
    {
      icon: '🎓',
      title: 'Training & Certification',
      items: [
        'Online Training',
        'Certification Program',
        'Bootcamp',
        'Corporate Training',
      ],
    },
    {
      icon: '🎤',
      title: 'Webinars & Events',
      items: [
        'Upcoming Webinar',
        'Past Webinar Recording',
        'Product Update Session',
      ],
    },
    {
      icon: '✅',
      title: 'Case Studies',
      items: [
        'Client Success Story',
        'Industry Implementation',
        'ROI Analysis',
      ],
    },
    {
      icon: '⚙️',
      title: 'Developer Resources',
      items: [
        'API Reference',
        'SDK Download',
        'Postman Collection',
        'Sandbox Access',
      ],
    },
  ], []);

  const helpdeskMenu = useMemo(() => [
    {
      icon: '🎫',
      title: 'Create Ticket',
      items: [
        'Submit Support Request',
        'Priority Selection',
        'Attachment Upload',
      ],
    },
    {
      icon: '📋',
      title: 'My Tickets',
      items: [
        'Open Tickets',
        'Pending',
        'Resolved',
        'Closed',
      ],
    },
    {
      icon: '💬',
      title: 'Live Support',
      items: [
        'Live Chat',
        'WhatsApp Support',
        'Schedule Call',
      ],
    },
    {
      icon: '⏱️',
      title: 'SLA & Support Policy',
      items: [
        'Response Time',
        'Escalation Matrix',
        'Service Coverage',
      ],
    },
    {
      icon: '🟢',
      title: 'System Status',
      items: [
        'Server Status',
        'Maintenance Schedule',
        'Incident Report',
      ],
    },
    {
      icon: '🖥️',
      title: 'Remote Assistance',
      items: [
        'Screen Sharing',
        'Remote Troubleshooting Guide',
      ],
    },
    {
      icon: '💡',
      title: 'Feedback & Feature Request',
      items: [
        'Product Feedback',
        'Feature Suggestion',
        'Bug Report',
      ],
    },
  ], []);

  const aiIntelligenceMenu = useMemo(() => [
    {
      icon: '🤖',
      title: 'AI Assistant',
      items: [
        'HR Chatbot',
        'Natural Language Query',
        'Generate Report Otomatis',
        'Draft Dokumen HR (SP, Kontrak, Offering Letter)',
        'AI Summary Bulanan',
      ],
    },
    {
      icon: '👥',
      title: 'Workforce Prediction',
      items: [
        'Prediksi Turnover',
        'Headcount Planning',
        'Overtime Forecast',
        'Workforce Capacity Simulation',
      ],
    },
    {
      icon: '📊',
      title: 'Performance Intelligence',
      items: [
        'Analisis KPI Otomatis',
        'Performance Trend',
        'High & Low Performer Detection',
        'Rekomendasi Training',
      ],
    },
    {
      icon: '⏱️',
      title: 'Attendance AI',
      items: [
        'Anomaly Detection',
        'Late Pattern Analysis',
        'Fraud Attendance Alert',
        'Behavioral Insight',
      ],
    },
    {
      icon: '🎯',
      title: 'Smart Recruitment AI',
      items: [
        'CV Screening',
        'Candidate Ranking',
        'Job Description Generator',
        'Interview Score Prediction',
      ],
    },
    {
      icon: '💰',
      title: 'Payroll Intelligence',
      items: [
        'Payroll Anomaly Detection',
        'Overtime Cost Insight',
        'Salary Benchmark Analysis',
        'Cost Optimization Suggestion',
      ],
    },
    {
      icon: '🔔',
      title: 'AI Alerts & Monitoring',
      items: [
        'Risk Alert',
        'Compliance Alert',
        'Performance Alert',
        'Custom Alert Rules',
      ],
    },
  ], []);

  const dataAnalyticsMenu = useMemo(() => [
    {
      icon: '📈',
      title: 'Executive Dashboard',
      items: [
        'Headcount Overview',
        'Attendance Summary',
        'KPI Overview',
        'Payroll Cost Summary',
        'HR Health Score',
      ],
    },
    {
      icon: '👨‍💼',
      title: 'Workforce Analytics',
      items: [
        'Headcount Trend',
        'Turnover Rate',
        'Absenteeism Rate',
        'Demographic Analysis',
        'Tenure Distribution',
      ],
    },
    {
      icon: '🎯',
      title: 'Performance Analytics',
      items: [
        'KPI per Department',
        'Target vs Actual',
        'Performance Distribution',
        'Top & Bottom Performer',
      ],
    },
    {
      icon: '💵',
      title: 'Payroll Analytics',
      items: [
        'Salary Cost per Department',
        'Overtime Cost Breakdown',
        'Tax & BPJS Summary',
        'Payroll Trend',
      ],
    },
    {
      icon: '📅',
      title: 'Attendance Analytics',
      items: [
        'Late Frequency',
        'Leave Usage',
        'Overtime Trend',
        'Shift Performance',
      ],
    },
    {
      icon: '📋',
      title: 'Recruitment Analytics',
      items: [
        'Time to Hire',
        'Cost per Hire',
        'Source of Hire',
        'Interview Conversion Rate',
      ],
    },
    {
      icon: '🛠️',
      title: 'Custom Report Builder',
      items: [
        'Drag & Drop Report',
        'Custom Filter',
        'Export (PDF / Excel)',
        'Scheduled Report',
      ],
    },
    {
      icon: '💾',
      title: 'Data Management',
      items: [
        'Data Warehouse',
        'API Integration',
        'ERP Sync',
        'Data Archive',
      ],
    },
  ], []);

  // Load user data - use useMemo for initial value from sessionStorage
  const userName = useMemo(() => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.employee?.full_name || user.username || 'User';
      }
    } catch (e) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
        console.debug(e);
      }
    }
    return 'User';
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    try {
      await authService.logout(token);
    } catch (e) {
      console.warn('logout failed', e);
    }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // Prevent browser back navigation by replacing history
    window.history.replaceState(null, '', '/');
    navigate('/', { replace: true });
  }, [navigate]);

  // Toggle handlers for dropdowns
  const toggleFeatures = useCallback(() => setFeaturesOpen((s) => !s), []);
  const toggleEducation = useCallback(() => setEducationOpen((s) => !s), []);
  const toggleHelpdesk = useCallback(() => setHelpdeskOpen((s) => !s), []);
  const toggleAi = useCallback(() => setAiOpen((s) => !s), []);
  const toggleAnalytics = useCallback(() => setAnalyticsOpen((s) => !s), []);
  const toggleDropdown = useCallback(() => setShowDropdown((s) => !s), []);

  return {
    // State
    userName,
    showDropdown,
    featuresOpen,
    educationOpen,
    helpdeskOpen,
    aiOpen,
    analyticsOpen,

    // Data
    addonFeatures,
    educationMenu,
    helpdeskMenu,
    aiIntelligenceMenu,
    dataAnalyticsMenu,

    // Helpers
    slugify,
    makeLink,

    // Handlers
    handleLogout,
    toggleFeatures,
    toggleEducation,
    toggleHelpdesk,
    toggleAi,
    toggleAnalytics,
    toggleDropdown,

    // Setters (for external control)
    setFeaturesOpen,
    setEducationOpen,
    setHelpdeskOpen,
    setAiOpen,
    setAnalyticsOpen,
    setShowDropdown,
  };
}

export default useAdminNavbarViewModel;

