import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAdminNavbarViewModel from '../viewmodels/useAdminNavbarViewModel';
import useOnClickOutside from '../../../shared/hooks/useOnClickOutside';

/**
 * =============================================================================
 * MEGA MENU BUG FIX - SENIOR ENGINEER EXPLANATION
 * =============================================================================
 * 
 * BUG CAUSE:
 * -----------
 * 1. Gap between trigger button and dropdown content
 * 2. onMouseLeave triggers immediately when cursor leaves button
 * 3. Dropdown closes before cursor reaches the menu items
 * 4. No delay handling - state changes instantly
 * 
 * EVENT FLOW DIAGRAM:
 * -------------------
 * 
 *    ┌─────────────────────────────────────────────────────────┐
 *    │                    USER ACTION                         │
 *    └─────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 *    ┌─────────────────────────────────────────────────────────┐
 *    │  Cursor enters trigger button                          │
 *    │  → onMouseEnter fires                                  │
 *    │  → setFeaturesOpen(true)                               │
 *    │  → Dropdown OPENS (no delay)                          │
 *    └─────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 *    ┌─────────────────────────────────────────────────────────┐
 *    │  Cursor moves toward dropdown                          │
 *    │  → Crosses gap between button and dropdown             │
 *    │  → onMouseLeave fires on BUTTON (not container!)      │
 *    │  → setFeaturesOpen(false) ← BUG: Too fast!            │
 *    │  → Dropdown CLOSES before reaching items               │
 *    └─────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 *    ┌─────────────────────────────────────────────────────────┐
 *    │  RESULT: User cannot click submenu items               │
 *    │  → Frustrating UX                                      │
 *    │  → Appears broken                                      │
 *    └─────────────────────────────────────────────────────────┘
 * 
 * =============================================================================
 * SOLUTION IMPLEMENTED
 * =============================================================================
 * 
 * 1. CONTAINER WRAPPER
 *    - Both trigger AND dropdown inside same container
 *    - Container handles the mouse events
 * 
 * 2. DELAY TIMEOUT (200ms)
 *    - onMouseLeave starts a timer
 *    - If cursor returns within 200ms, timer is cancelled
 *    - If cursor doesn't return, dropdown closes
 * 
 * 3. isHovered STATE
 *    - Track when cursor is over dropdown content
 *    - Keeps dropdown open while hovering content
 * 
 * 4. POINTER EVENTS FIX
 *    - Ensure dropdown receives pointer events
 *    - Prevents "ghost" gap that ignores mouse
 * 
 * =============================================================================
 * BEST PRACTICES FOR MEGA MENU
 * =============================================================================
 * 
 * 1. Always use container wrapper, not just button
 * 2. Add delay on close (150-250ms is ideal)
 * 3. Clear timeout on re-enter to prevent race conditions
 * 4. Use pointer-events: auto on dropdown
 * 5. Add click-outside detection for better UX
 * 6. Track hover state for dropdown content
 * 7. Use AnimatePresence for smooth exit animations
 * 
 * =============================================================================
 */

/**
 * AdminMegaMenuItem - Reusable Mega Menu Component for Admin
 * 
 * Features:
 * - 200ms delay on mouseLeave to prevent accidental close
 * - isHovered state to track cursor over dropdown
 * - Clear timeout on re-enter
 * - Click outside to close
 * - Framer Motion animations
 * - Accessibility support
 */
function AdminMegaMenuItem({
  label,
  isOpen,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  children,
  icon,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);

  // Click outside detection
  useOnClickOutside(menuRef, () => {
    if (isOpen) {
      onToggle(false);
    }
  });

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onMouseEnter();
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onMouseLeave();
  }, [onMouseLeave]);

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <div
      className="relative"
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => onToggle(!isOpen)}
        className={`flex items-center px-3 py-2 text-gray-600 font-medium transition-all duration-200 rounded-lg ${
          isOpen || isHovered
            ? 'bg-indigo-50 text-indigo-600'
            : 'hover:bg-gray-100'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon && <span className="mr-2 text-lg">{icon}</span>}
        {label}
        <motion.svg
          className="ml-1 w-4 h-4"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed left-1/2 -translate-x-1/2 top-16 w-screen max-w-6xl bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 max-h-[80vh] overflow-y-auto"
            style={{ pointerEvents: 'auto' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Gradient accent */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * AdminNavbar - Fixed Mega Menu Navigation
 * 
 * Features:
 * - Fixed mega menu hover bug
 * - 200ms delay on close
 * - Framer Motion animations
 * - Smooth transitions
 * - Responsive behavior
 * - Accessibility support
 */
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

  // Delay timeout refs for each mega menu
  const featuresTimeoutRef = useRef(null);
  const aiTimeoutRef = useRef(null);
  const analyticsTimeoutRef = useRef(null);
  const educationTimeoutRef = useRef(null);
  const helpdeskTimeoutRef = useRef(null);

  // Helper: Clear timeout and open menu
  const handleMegaMenuEnter = useCallback((setFn) => {
    // Clear any pending close timeout
    if (featuresTimeoutRef.current) clearTimeout(featuresTimeoutRef.current);
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    if (analyticsTimeoutRef.current) clearTimeout(analyticsTimeoutRef.current);
    if (educationTimeoutRef.current) clearTimeout(educationTimeoutRef.current);
    if (helpdeskTimeoutRef.current) clearTimeout(helpdeskTimeoutRef.current);
    // Open menu
    setFn(true);
  }, []);

  // Helper: Delay close (200ms tolerance)
  const handleMegaMenuLeave = useCallback((setFn, timeoutRef) => {
    timeoutRef.current = setTimeout(() => {
      setFn(false);
    }, 200);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Termez
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-2 text-sm text-gray-600 relative">
              <a
                className="px-3 py-2 rounded hover:bg-gray-100 transition"
                href="/dashboard"
              >
                Dashboard
              </a>

              {/* Features Mega Menu */}
              <AdminMegaMenuItem
                label="Features"
                icon="⚡"
                isOpen={featuresOpen}
                onToggle={(val) => {
                  if (val) {
                    handleMegaMenuEnter(setFeaturesOpen);
                    setAiOpen(false);
                    setAnalyticsOpen(false);
                    setEducationOpen(false);
                    setHelpdeskOpen(false);
                  } else {
                    setFeaturesOpen(false);
                  }
                }}
                onMouseEnter={() => {
                  handleMegaMenuEnter(setFeaturesOpen);
                  setAiOpen(false);
                  setAnalyticsOpen(false);
                  setEducationOpen(false);
                  setHelpdeskOpen(false);
                }}
                onMouseLeave={() => handleMegaMenuLeave(setFeaturesOpen, featuresTimeoutRef)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addonFeatures.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center text-sm">
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.title}
                      </h4>
                      <ul className="space-y-2">
                        {cat.items.map((it, i) => (
                          <li key={i}>
                            <Link
                              to={
                                it === 'Employment Status Tracking'
                                  ? '/admin/employment-status-tracking'
                                  : makeLink('features', cat.title, it)
                              }
                              onClick={() => setFeaturesOpen(false)}
                              className="block text-sm text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 py-1 px-2 -mx-2 rounded-lg hover:bg-indigo-50"
                            >
                              {it}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AdminMegaMenuItem>

              {/* AI Intelligence Mega Menu */}
              <AdminMegaMenuItem
                label="AI Intelligence"
                icon="🤖"
                isOpen={aiOpen}
                onToggle={(val) => {
                  if (val) {
                    handleMegaMenuEnter(setAiOpen);
                    setFeaturesOpen(false);
                    setAnalyticsOpen(false);
                    setEducationOpen(false);
                    setHelpdeskOpen(false);
                  } else {
                    setAiOpen(false);
                  }
                }}
                onMouseEnter={() => {
                  handleMegaMenuEnter(setAiOpen);
                  setFeaturesOpen(false);
                  setAnalyticsOpen(false);
                  setEducationOpen(false);
                  setHelpdeskOpen(false);
                }}
                onMouseLeave={() => handleMegaMenuLeave(setAiOpen, aiTimeoutRef)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiIntelligenceMenu.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center text-sm">
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.title}
                      </h4>
                      <ul className="space-y-2">
                        {cat.items.map((it, i) => (
                          <li key={i}>
                            <Link
                              to={makeLink('ai-intelligence', cat.title, it)}
                              onClick={() => setAiOpen(false)}
                              className="block text-sm text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 py-1 px-2 -mx-2 rounded-lg hover:bg-indigo-50"
                            >
                              {it}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AdminMegaMenuItem>

              {/* Data Analytics Mega Menu */}
              <AdminMegaMenuItem
                label="Data Analytics"
                icon="📊"
                isOpen={analyticsOpen}
                onToggle={(val) => {
                  if (val) {
                    handleMegaMenuEnter(setAnalyticsOpen);
                    setFeaturesOpen(false);
                    setAiOpen(false);
                    setEducationOpen(false);
                    setHelpdeskOpen(false);
                  } else {
                    setAnalyticsOpen(false);
                  }
                }}
                onMouseEnter={() => {
                  handleMegaMenuEnter(setAnalyticsOpen);
                  setFeaturesOpen(false);
                  setAiOpen(false);
                  setEducationOpen(false);
                  setHelpdeskOpen(false);
                }}
                onMouseLeave={() => handleMegaMenuLeave(setAnalyticsOpen, analyticsTimeoutRef)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataAnalyticsMenu.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center text-sm">
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.title}
                      </h4>
                      <ul className="space-y-2">
                        {cat.items.map((it, i) => (
                          <li key={i}>
                            <Link
                              to={makeLink('data-analytics', cat.title, it)}
                              onClick={() => setAnalyticsOpen(false)}
                              className="block text-sm text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 py-1 px-2 -mx-2 rounded-lg hover:bg-indigo-50"
                            >
                              {it}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AdminMegaMenuItem>

              {/* Education Mega Menu */}
              <AdminMegaMenuItem
                label="Education"
                icon="🎓"
                isOpen={educationOpen}
                onToggle={(val) => {
                  if (val) {
                    handleMegaMenuEnter(setEducationOpen);
                    setFeaturesOpen(false);
                    setAiOpen(false);
                    setAnalyticsOpen(false);
                    setHelpdeskOpen(false);
                  } else {
                    setEducationOpen(false);
                  }
                }}
                onMouseEnter={() => {
                  handleMegaMenuEnter(setEducationOpen);
                  setFeaturesOpen(false);
                  setAiOpen(false);
                  setAnalyticsOpen(false);
                  setHelpdeskOpen(false);
                }}
                onMouseLeave={() => handleMegaMenuLeave(setEducationOpen, educationTimeoutRef)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {educationMenu.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center text-sm">
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.title}
                      </h4>
                      <ul className="space-y-2">
                        {cat.items.map((it, i) => (
                          <li key={i}>
                            <Link
                              to={makeLink('education', cat.title, it)}
                              onClick={() => setEducationOpen(false)}
                              className="block text-sm text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 py-1 px-2 -mx-2 rounded-lg hover:bg-indigo-50"
                            >
                              {it}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AdminMegaMenuItem>

              {/* Helpdesk Mega Menu */}
              <AdminMegaMenuItem
                label="Helpdesk"
                icon="🎫"
                isOpen={helpdeskOpen}
                onToggle={(val) => {
                  if (val) {
                    handleMegaMenuEnter(setHelpdeskOpen);
                    setFeaturesOpen(false);
                    setAiOpen(false);
                    setAnalyticsOpen(false);
                    setEducationOpen(false);
                  } else {
                    setHelpdeskOpen(false);
                  }
                }}
                onMouseEnter={() => {
                  handleMegaMenuEnter(setHelpdeskOpen);
                  setFeaturesOpen(false);
                  setAiOpen(false);
                  setAnalyticsOpen(false);
                  setEducationOpen(false);
                }}
                onMouseLeave={() => handleMegaMenuLeave(setHelpdeskOpen, helpdeskTimeoutRef)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {helpdeskMenu.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-3 text-gray-800 flex items-center text-sm">
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.title}
                      </h4>
                      <ul className="space-y-2">
                        {cat.items.map((it, i) => (
                          <li key={i}>
                            <Link
                              to={makeLink('helpdesk', cat.title, it)}
                              onClick={() => setHelpdeskOpen(false)}
                              className="block text-sm text-gray-600 hover:text-indigo-600 hover:translate-x-1 transition-all duration-200 py-1 px-2 -mx-2 rounded-lg hover:bg-indigo-50"
                            >
                              {it}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AdminMegaMenuItem>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l-4 4m0 0l4-4m-4 4V4" />
              </svg>
            </button>
            <button className="p-2 rounded hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6L17 13V9a5 5 0 10-10 0v4l-1.6 1.6a2 2 0 01-.595 1.395L3 17h5" />
              </svg>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
                aria-expanded={showDropdown}
              >
                <img src="https://api.dicebear.com/6.x/initials/svg?seed=JD" alt="avatar" className="h-8 w-8 rounded-full" />
                <div className="hidden sm:block text-sm font-medium text-gray-700">{userName}</div>
              </button>
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50 border border-gray-100"
                  >
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition rounded-lg mx-1"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

