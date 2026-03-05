import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [helpdeskOpen, setHelpdeskOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [userName, setUserName] = useState('User');

  // Mega menu structure
  const slugify = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const makeLink = (menuType, cat, item) => {
    const menuSlug = slugify(menuType);
    const catSlug = slugify(cat);
    const itemSlug = slugify(item);
    return `/${menuSlug}/${catSlug}/${itemSlug}`;
  };

  const addonFeatures = [
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
  ];

  const educationMenu = [
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
  ];

  const helpdeskMenu = [
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
  ];

  const aiIntelligenceMenu = [
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
  ];

  const dataAnalyticsMenu = [
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
  ];

  React.useEffect(() => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.employee?.full_name || user.username || 'User');
      }
    } catch (e) {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) console.debug(e);
    }
  }, []);

  const handleLogout = async () => {
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
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold text-indigo-600">Termez</div>
            <nav className="hidden md:flex space-x-4 text-sm text-gray-600 relative">
              <a className="px-3 py-2 rounded hover:bg-gray-100" href="/dashboard">Dashboard</a>
               <div
                className="relative"
                onMouseEnter={() => setFeaturesOpen(true)}
                onMouseLeave={() => setFeaturesOpen(false)}
              >
                <button
                  onClick={() => setFeaturesOpen((s) => !s)}
                  className="flex items-center px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded transition"
                >
                  Features
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {featuresOpen && (
                  <div
                    className="fixed left-1/2 transform -translate-x-1/2 top-16 w-screen max-w-6xl bg-white shadow-xl rounded-xl p-4 border border-gray-200 z-50 max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out opacity-100 scale-100"
                    onMouseEnter={() => setFeaturesOpen(true)}
                    onMouseLeave={() => setFeaturesOpen(false)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {addonFeatures.map((cat, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                            {cat.icon && <span className="mr-2">{cat.icon}</span>}
                            {cat.title}
                          </h4>
                          <ul className="text-sm space-y-1">
                            {cat.items.map((it, i) => (
                              <li key={i} className="hover:text-indigo-600 cursor-pointer">
                                <Link
                                  to={makeLink('features', cat.title, it)}
                                  onClick={() => setFeaturesOpen(false)}
                                  className="block w-full"
                                >
                                  {it}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div
                className="relative"
                onMouseEnter={() => { setAiOpen(true); setAnalyticsOpen(false); }}
                onMouseLeave={() => setAiOpen(false)}
              >
                <button
                  onClick={() => setAiOpen((s) => !s)}
                  className="flex items-center px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded transition"
                >
                  AI Intelligence
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {aiOpen && (
                  <div
                    className="fixed left-1/2 transform -translate-x-1/2 top-16 w-screen max-w-6xl bg-white shadow-xl rounded-xl p-4 border border-gray-200 z-50 max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out opacity-100 scale-100"
                    onMouseEnter={() => setAiOpen(true)}
                    onMouseLeave={() => setAiOpen(false)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aiIntelligenceMenu.map((cat, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                            {cat.icon && <span className="mr-2">{cat.icon}</span>}
                            {cat.title}
                          </h4>
                          <ul className="text-sm space-y-1">
                            {cat.items.map((it, i) => (
                              <li key={i} className="hover:text-indigo-600 cursor-pointer">
                                <Link
                                  to={makeLink('ai-intelligence', cat.title, it)}
                                  onClick={() => setAiOpen(false)}
                                  className="block w-full"
                                >
                                  {it}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => { setAnalyticsOpen(true); setAiOpen(false); }}
                onMouseLeave={() => setAnalyticsOpen(false)}
              >
                <button
                  onClick={() => setAnalyticsOpen((s) => !s)}
                  className="flex items-center px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded transition"
                >
                  Data Analytics
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {analyticsOpen && (
                  <div
                    className="fixed left-1/2 transform -translate-x-1/2 top-16 w-screen max-w-6xl bg-white shadow-xl rounded-xl p-4 border border-gray-200 z-50 max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out opacity-100 scale-100"
                    onMouseEnter={() => setAnalyticsOpen(true)}
                    onMouseLeave={() => setAnalyticsOpen(false)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dataAnalyticsMenu.map((cat, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                            {cat.icon && <span className="mr-2">{cat.icon}</span>}
                            {cat.title}
                          </h4>
                          <ul className="text-sm space-y-1">
                            {cat.items.map((it, i) => (
                              <li key={i} className="hover:text-indigo-600 cursor-pointer">
                                <Link
                                  to={makeLink('data-analytics', cat.title, it)}
                                  onClick={() => setAnalyticsOpen(false)}
                                  className="block w-full"
                                >
                                  {it}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
             
              <div
                className="relative"
                onMouseEnter={() => { setEducationOpen(true); setHelpdeskOpen(false); }}
                onMouseLeave={() => setEducationOpen(false)}
              >
                <button
                  onClick={() => setEducationOpen((s) => !s)}
                  className="flex items-center px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded transition"
                >
                  Education
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {educationOpen && (
                  <div
                    className="fixed left-1/2 transform -translate-x-1/2 top-16 w-screen max-w-6xl bg-white shadow-xl rounded-xl p-4 border border-gray-200 z-50 max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out opacity-100 scale-100"
                    onMouseEnter={() => setEducationOpen(true)}
                    onMouseLeave={() => setEducationOpen(false)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {educationMenu.map((cat, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                            {cat.icon && <span className="mr-2">{cat.icon}</span>}
                            {cat.title}
                          </h4>
                          <ul className="text-sm space-y-1">
                            {cat.items.map((it, i) => (
                              <li key={i} className="hover:text-indigo-600 cursor-pointer">
                                <Link
                                  to={makeLink('education', cat.title, it)}
                                  onClick={() => setEducationOpen(false)}
                                  className="block w-full"
                                >
                                  {it}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => { setHelpdeskOpen(true); setEducationOpen(false); }}
                onMouseLeave={() => setHelpdeskOpen(false)}
              >
                <button
                  onClick={() => setHelpdeskOpen((s) => !s)}
                  className="flex items-center px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded transition"
                >
                  Helpdesk
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {helpdeskOpen && (
                  <div
                    className="fixed left-1/2 transform -translate-x-1/2 top-16 w-screen max-w-6xl bg-white shadow-xl rounded-xl p-4 border border-gray-200 z-50 max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out opacity-100 scale-100"
                    onMouseEnter={() => setHelpdeskOpen(true)}
                    onMouseLeave={() => setHelpdeskOpen(false)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {helpdeskMenu.map((cat, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                            {cat.icon && <span className="mr-2">{cat.icon}</span>}
                            {cat.title}
                          </h4>
                          <ul className="text-sm space-y-1">
                            {cat.items.map((it, i) => (
                              <li key={i} className="hover:text-indigo-600 cursor-pointer">
                                <Link
                                  to={makeLink('helpdesk', cat.title, it)}
                                  onClick={() => setHelpdeskOpen(false)}
                                  className="block w-full"
                                >
                                  {it}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
             
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l-4 4m0 0l4-4m-4 4V4" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6L17 13V9a5 5 0 10-10 0v4l-1.6 1.6a2 2 0 01-.595 1.395L3 17h5" />
              </svg>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              >
                <img src="https://api.dicebear.com/6.x/initials/svg?seed=JD" alt="avatar" className="h-8 w-8 rounded-full" />
                <div className="hidden sm:block text-sm">{userName}</div>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
