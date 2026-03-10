import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useNavbarViewModel from '../../modules/main/viewmodels/useNavbarViewModel';
import useOnClickOutside from '../hooks/useOnClickOutside';

/**
 * MegaMenuItem - Reusable Mega Menu Component
 * 
 * Problem yang dipecahkan:
 * - Bug: Menu menghilang saat cursor bergerak dari parent ke dropdown
 * - Penyebab: Ada gap antara trigger dan dropdown, sehingga onMouseLeave ter-trigger
 * - Solusi: Container wrapper + delay timeout + pointer-events handling
 * 
 * Best Practice:
 * - onMouseEnter dengan delay opening (instant open lebih baik UX)
 * - onMouseLeave dengan delay closing (150-200ms delay untuk toleransi)
 * - Click outside to close
 * - aria-expanded untuk accessibility
 */
function MegaMenuItem({ 
  label, 
  isOpen, 
  onToggle, 
  onMouseEnter, 
  onMouseLeave, 
  children,
  icon,
  isMobile = false 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  
  // Close on click outside
  useOnClickOutside(menuRef, () => {
    if (isOpen && !isMobile) {
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
      y: -10,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  if (isMobile) {
    // Mobile version - simple accordion style
    return (
      <div className="w-full">
        <button
          onClick={() => onToggle(!isOpen)}
          className="w-full text-left flex items-center justify-between py-3 px-4 text-gray-700 font-medium hover:text-cyan-600 transition rounded-lg hover:bg-cyan-50"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center">
            {icon && <span className="mr-3 text-lg">{icon}</span>}
            {label}
          </span>
          <motion.svg 
            className="w-5 h-5 text-gray-400"
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden ml-4 pl-4 border-l-2 border-cyan-200"
            >
              <div className="py-2 space-y-1">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop version - full mega menu
  return (
    <div 
      className="relative"
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => onToggle(!isOpen)}
        className={`flex items-center py-2 text-gray-700 font-medium transition-all duration-200 rounded-lg px-3 ${
          isOpen || isHovered 
            ? 'text-cyan-600 bg-cyan-50' 
            : 'hover:text-cyan-600 hover:bg-gray-50'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon && <span className="mr-2 text-lg">{icon}</span>}
        {label}
        <motion.svg 
          className="ml-1.5 w-4 h-4"
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
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-screen md:w-auto md:min-w-[700px] lg:min-w-[800px] bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden"
            style={{ pointerEvents: 'auto' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Gradient top accent */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />
            
            <div className="p-4 md:p-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Navbar - Main Navigation Component
 * 
 * Features:
 * - Fixed position with backdrop blur
 * - Responsive (desktop + mobile)
 * - Mega menu dengan perbaikan bug
 * - Smooth animations
 * - Accessibility support
 */
export default function Navbar({ onOpenAuth }) {
  const {
    open,
    addonOpen,
    developerOpen,
    educationOpen,
    addonFeatures,
    developerMenu,
    educationMenu,
    makeLink,
    setAddonOpen,
    setDeveloperOpen,
    setEducationOpen,
    setOpen,
  } = useNavbarViewModel();

  // Delay timers untuk smooth UX
  const closeTimeoutRef = useRef(null);

  // Helpers untuk mega menu dengan delay
  const handleMenuMouseEnter = useCallback(() => {
    // Clear close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  const handleMenuMouseLeave = useCallback((setOpenFn) => {
    // Add delay sebelum menutup - memberikan waktu cursor sampai ke menu
    closeTimeoutRef.current = setTimeout(() => {
      setOpenFn(false);
    }, 200); // 200ms delay - cukup untuk toleransi cursor movement
  }, []);

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-4 md:px-8 lg:px-12 py-3 md:py-4 fixed top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-wider uppercase"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/">
            termez
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {/* Home Link */}
          <motion.a 
            href="#home" 
            whileHover={{ color: '#0891b2' }}
            className="text-gray-700 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            Home
          </motion.a>

          {/* Addon Features Mega Menu */}
          <MegaMenuItem
            label="Addon Features"
            icon="⚡"
            isOpen={addonOpen}
            onToggle={(val) => {
              if (val) {
                setAddonOpen(true);
                setDeveloperOpen(false);
                setEducationOpen(false);
              } else {
                setAddonOpen(false);
              }
            }}
            onMouseEnter={() => {
              handleMenuMouseEnter();
              setAddonOpen(true);
              setDeveloperOpen(false);
              setEducationOpen(false);
            }}
            onMouseLeave={() => handleMenuMouseLeave(setAddonOpen)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {addonFeatures.map((cat, idx) => (
                <div key={idx} className="group">
                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center text-sm md:text-base">
                    {cat.icon && <span className="mr-2 text-lg">{cat.icon}</span>}
                    {cat.title}
                  </h4>
                  <ul className="space-y-2">
                    {cat.items.map((it, i) => (
                      <li key={i}>
                        <Link 
                          to={makeLink(cat.title, it)} 
                          onClick={() => setAddonOpen(false)}
                          className="block text-sm text-gray-600 hover:text-cyan-600 hover:translate-x-1 transition-all duration-200 py-1 px-2 -mx-2 rounded-lg hover:bg-cyan-50"
                        >
                          {it}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MegaMenuItem>

          {/* Profile Link */}
          <motion.a 
            href="#profile" 
            whileHover={{ color: '#0891b2' }}
            className="text-gray-700 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            Profile
          </motion.a>

          {/* Developer Mega Menu */}
          <MegaMenuItem
            label="Developer"
            icon="👨‍💻"
            isOpen={developerOpen}
            onToggle={(val) => {
              if (val) {
                setDeveloperOpen(true);
                setAddonOpen(false);
                setEducationOpen(false);
              } else {
                setDeveloperOpen(false);
              }
            }}
            onMouseEnter={() => {
              handleMenuMouseEnter();
              setDeveloperOpen(true);
              setAddonOpen(false);
              setEducationOpen(false);
            }}
            onMouseLeave={() => handleMenuMouseLeave(setDeveloperOpen)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {developerMenu.map((cat, idx) => (
                <div key={idx} className="group">
                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center text-sm md:text-base">
                    {cat.icon && <span className="mr-2 text-lg">{cat.icon}</span>}
                    {cat.title}
                  </h4>
                  <ul className="space-y-2">
                    {cat.items.map((it, i) => (
                      <li key={i}>
                        <Link 
                          to={makeLink(cat.title, it)} 
                          onClick={() => setDeveloperOpen(false)}
                          className="block text-sm text-gray-600 hover:text-cyan-600 hover:translate-x-1 transition-all duration-200 py-1 px-2 -mx-2 rounded-lg hover:bg-cyan-50"
                        >
                          {it}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MegaMenuItem>

          {/* Education Mega Menu */}
          <MegaMenuItem
            label="Education"
            icon="🎓"
            isOpen={educationOpen}
            onToggle={(val) => {
              if (val) {
                setEducationOpen(true);
                setAddonOpen(false);
                setDeveloperOpen(false);
              } else {
                setEducationOpen(false);
              }
            }}
            onMouseEnter={() => {
              handleMenuMouseEnter();
              setEducationOpen(true);
              setAddonOpen(false);
              setDeveloperOpen(false);
            }}
            onMouseLeave={() => handleMenuMouseLeave(setEducationOpen)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {educationMenu.map((cat, idx) => (
                <div key={idx} className="group">
                  <h4 className="font-semibold mb-3 text-gray-800 flex items-center text-sm md:text-base">
                    {cat.icon && <span className="mr-2 text-lg">{cat.icon}</span>}
                    {cat.title}
                  </h4>
                  <ul className="space-y-2">
                    {cat.items.map((it, i) => (
                      <li key={i}>
                        <Link 
                          to={makeLink(cat.title, it)} 
                          onClick={() => setEducationOpen(false)}
                          className="block text-sm text-gray-600 hover:text-cyan-600 hover:translate-x-1 transition-all duration-200 py-1 px-2 -mx-2 rounded-lg hover:bg-cyan-50"
                        >
                          {it}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MegaMenuItem>

          {/* About Us Link */}
          <motion.a 
            href="#about" 
            whileHover={{ color: '#0891b2' }}
            className="text-gray-700 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            About Us
          </motion.a>

          {/* Contacts Link */}
          <motion.a 
            href="#contacts" 
            whileHover={{ color: '#0891b2' }}
            className="text-gray-700 font-medium transition px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            Contacts
          </motion.a>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenAuth('register')}
            className="ml-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl transition duration-300 text-sm"
          >
            Sign Up
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <motion.button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden mt-4 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {/* Mobile Links */}
              <a 
                href="#home" 
                onClick={() => setOpen(false)}
                className="block py-3 px-4 text-gray-700 font-medium hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
              >
                🏠 Home
              </a>
              
              {/* Mobile Mega Menus */}
              <MegaMenuItem
                label="Addon Features"
                icon="⚡"
                isOpen={addonOpen}
                onToggle={(val) => setAddonOpen(val)}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                isMobile={true}
              >
                {addonFeatures.map((cat, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="font-semibold text-gray-800 flex items-center text-sm">
                      {cat.icon && <span className="mr-2">{cat.icon}</span>}
                      {cat.title}
                    </div>
                    <ul className="mt-2 space-y-1 ml-2">
                      {cat.items.map((it, i) => (
                        <li key={i}>
                          <Link 
                            to={makeLink(cat.title, it)} 
                            onClick={() => { setAddonOpen(false); setOpen(false); }}
                            className="block text-sm text-gray-600 hover:text-cyan-600 py-1.5 px-3 rounded hover:bg-cyan-50"
                          >
                            {it}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </MegaMenuItem>

              <a 
                href="#profile" 
                onClick={() => setOpen(false)}
                className="block py-3 px-4 text-gray-700 font-medium hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
              >
                👤 Profile
              </a>

              <MegaMenuItem
                label="Developer"
                icon="👨‍💻"
                isOpen={developerOpen}
                onToggle={(val) => setDeveloperOpen(val)}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                isMobile={true}
              >
                {developerMenu.map((cat, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="font-semibold text-gray-800 flex items-center text-sm">
                      {cat.icon && <span className="mr-2">{cat.icon}</span>}
                      {cat.title}
                    </div>
                    <ul className="mt-2 space-y-1 ml-2">
                      {cat.items.map((it, i) => (
                        <li key={i}>
                          <Link 
                            to={makeLink(cat.title, it)} 
                            onClick={() => { setDeveloperOpen(false); setOpen(false); }}
                            className="block text-sm text-gray-600 hover:text-cyan-600 py-1.5 px-3 rounded hover:bg-cyan-50"
                          >
                            {it}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </MegaMenuItem>

              <MegaMenuItem
                label="Education"
                icon="🎓"
                isOpen={educationOpen}
                onToggle={(val) => setEducationOpen(val)}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                isMobile={true}
              >
                {educationMenu.map((cat, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="font-semibold text-gray-800 flex items-center text-sm">
                      {cat.icon && <span className="mr-2">{cat.icon}</span>}
                      {cat.title}
                    </div>
                    <ul className="mt-2 space-y-1 ml-2">
                      {cat.items.map((it, i) => (
                        <li key={i}>
                          <Link 
                            to={makeLink(cat.title, it)} 
                            onClick={() => { setEducationOpen(false); setOpen(false); }}
                            className="block text-sm text-gray-600 hover:text-cyan-600 py-1.5 px-3 rounded hover:bg-cyan-50"
                          >
                            {it}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </MegaMenuItem>

              <a 
                href="#about" 
                onClick={() => setOpen(false)}
                className="block py-3 px-4 text-gray-700 font-medium hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
              >
                ℹ️ About Us
              </a>

              <a 
                href="#contacts" 
                onClick={() => setOpen(false)}
                className="block py-3 px-4 text-gray-700 font-medium hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
              >
                📞 Contacts
              </a>

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  onClick={() => { setOpen(false); onOpenAuth('register'); }}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg"
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

