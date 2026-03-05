import React from 'react';
import { Link } from 'react-router-dom';
import useAdminNavbarViewModel from '../viewmodels/useAdminNavbarViewModel';

export default function AdminNavbar() {
  const {
    userName,
    showDropdown,
    featuresOpen,
    educationOpen,
    helpdeskOpen,
    aiOpen,
    analyticsOpen,
    addonFeatures,
    educationMenu,
    helpdeskMenu,
    aiIntelligenceMenu,
    dataAnalyticsMenu,
    makeLink,
    handleLogout,
    setFeaturesOpen,
    setEducationOpen,
    setHelpdeskOpen,
    setAiOpen,
    setAnalyticsOpen,
    setShowDropdown,
  } = useAdminNavbarViewModel();

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

