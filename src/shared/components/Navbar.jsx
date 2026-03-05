import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useNavbarViewModel from '../../modules/main/viewmodels/useNavbarViewModel';

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

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 md:px-12 py-4 fixed top-0 z-40 backdrop-blur-md bg-white/70 border-b border-white/10 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-widest uppercase"
          whileHover={{ scale: 1.05 }}
        >
          termez
        </motion.div>

        <div className="hidden md:flex items-center space-x-8 relative">
          <motion.a href="#home" whileHover={{ color: '#0ea5e9' }} className="text-gray-700 font-medium transition hover:text-cyan-600">Home</motion.a>

          <div className="relative" onMouseEnter={() => { setAddonOpen(true); setDeveloperOpen(false); setEducationOpen(false); }} onMouseLeave={() => setAddonOpen(false)}>
            <button
              onClick={() => setAddonOpen((s) => !s)}
              className="flex items-center text-gray-700 font-medium hover:text-cyan-600 transition"
            >
              Addon Features
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {addonOpen && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 top-12 w-screen md:w-auto md:min-w-3xl bg-white shadow-lg rounded-xl p-3 md:p-4 border border-gray-200 z-50"
                onMouseEnter={() => setAddonOpen(true)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {addonFeatures.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.title}
                      </h4>
                      <ul className="text-sm space-y-1">
                        {cat.items.map((it, i) => (
                          <li key={i} className="hover:text-cyan-600 cursor-pointer">
                            <Link to={makeLink(cat.title, it)} onClick={() => setAddonOpen(false)} className="block w-full">{it}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <motion.a href="#profile" whileHover={{ color: '#0ea5e9' }} className="text-gray-700 font-medium transition hover:text-cyan-600">Profile</motion.a>

          <div className="relative" onMouseEnter={() => { setDeveloperOpen(true); setAddonOpen(false); setEducationOpen(false); }} onMouseLeave={() => setDeveloperOpen(false)}>
            <button
              onClick={() => setDeveloperOpen((s) => !s)}
              className="flex items-center text-gray-700 font-medium hover:text-cyan-600 transition"
            >
              Developer
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {developerOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 top-12 w-screen md:w-auto md:min-w-3xl bg-white shadow-lg rounded-xl p-3 md:p-4 border border-gray-200 z-50" onMouseEnter={() => setDeveloperOpen(true)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {developerMenu.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.title}
                      </h4>
                      <ul className="text-sm space-y-1">
                        {cat.items.map((it, i) => (
                          <li key={i} className="hover:text-cyan-600 cursor-pointer">
                            <Link to={makeLink(cat.title, it)} onClick={() => setDeveloperOpen(false)} className="block w-full">{it}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => { setEducationOpen(true); setAddonOpen(false); setDeveloperOpen(false); }} onMouseLeave={() => setEducationOpen(false)}>
            <button
              onClick={() => setEducationOpen((s) => !s)}
              className="flex items-center text-gray-700 font-medium hover:text-cyan-600 transition"
            >
              Education
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {educationOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 top-12 w-screen md:w-auto md:min-w-3xl bg-white shadow-lg rounded-xl p-3 md:p-4 border border-gray-200 z-50" onMouseEnter={() => setEducationOpen(true)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {educationMenu.map((cat, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold mb-2 text-gray-800 flex items-center">
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.title}
                      </h4>
                      <ul className="text-sm space-y-1">
                        {cat.items.map((it, i) => (
                          <li key={i} className="hover:text-cyan-600 cursor-pointer">
                            <Link to={makeLink(cat.title, it)} onClick={() => setEducationOpen(false)} className="block w-full">{it}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <motion.a href="#about" whileHover={{ color: '#0ea5e9' }} className="text-gray-700 font-medium transition hover:text-cyan-600">About Us</motion.a>
          <motion.a href="#contacts" whileHover={{ color: '#0ea5e9' }} className="text-gray-700 font-medium transition hover:text-cyan-600">Contacts</motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenAuth('register')}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl transition duration-300"
          >
            Sign Up
          </motion.button>
        </div>

        <div className="md:hidden">
          <motion.button
            onClick={() => setOpen((s) => !s)}
            aria-label="menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white/80 backdrop-blur text-gray-800 shadow-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="md:hidden mt-4 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-6 mx-4 border border-white/20"
        >
          <div className="flex flex-col space-y-4">
            <a href="#home" onClick={() => setOpen(false)} className="block text-gray-700 font-medium hover:text-cyan-600 transition">Home</a>
          <button
            onClick={() => setAddonOpen((s) => !s)}
            className="w-full text-left block text-gray-700 font-medium hover:text-cyan-600 transition flex items-center justify-between"
          >
            Addon Features
           
          </button>
          {addonOpen && (
            <div className="mt-2 pl-4 border-l border-gray-200 space-y-2">
              {addonFeatures.map((cat, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-gray-800 flex items-center">
                    {cat.icon && <span className="mr-2">{cat.icon}</span>}
                    {cat.title}
                  </div>
                  <ul className="text-sm list-disc ml-4 mt-1">
                    {cat.items.map((it,i) => (
                      <li key={i} className="hover:text-cyan-600">
                        <Link to={makeLink(cat.title, it)} onClick={() => { setAddonOpen(false); setOpen(false); }} className="block">{it}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <a href="#profile" onClick={() => setOpen(false)} className="block text-gray-700 font-medium hover:text-cyan-600 transition">Profile</a>
          <button
            onClick={() => setDeveloperOpen((s) => !s)}
            className="w-full text-left block text-gray-700 font-medium hover:text-cyan-600 transition flex items-center justify-between"
          >
            Developer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {developerOpen && (
            <div className="mt-2 pl-4 border-l border-gray-200 space-y-2">
              {developerMenu.map((cat, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-gray-800 flex items-center">
                    {cat.icon && <span className="mr-2">{cat.icon}</span>}
                    {cat.title}
                  </div>
                  <ul className="text-sm list-disc ml-4 mt-1">
                    {developerMenu[0].items.map((it,i) => (
                      <li key={i} className="hover:text-cyan-600">
                        <Link to={makeLink(cat.title, it)} onClick={() => { setDeveloperOpen(false); setOpen(false); }} className="block">{it}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setEducationOpen((s) => !s)}
            className="w-full text-left block text-gray-700 font-medium hover:text-cyan-600 transition flex items-center justify-between"
          >
            Education
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {educationOpen && (
            <div className="mt-2 pl-4 border-l border-gray-200 space-y-2">
              {educationMenu.map((cat, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-gray-800 flex items-center">
                    {cat.icon && <span className="mr-2">{cat.icon}</span>}
                    {cat.title}
                  </div>
                  <ul className="text-sm list-disc ml-4 mt-1">
                    {cat.items.map((it,i) => (
                      <li key={i} className="hover:text-cyan-600">
                        <Link to={makeLink(cat.title, it)} onClick={() => { setEducationOpen(false); setOpen(false); }} className="block">{it}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <a href="#about" onClick={() => setOpen(false)} className="block text-gray-700 font-medium hover:text-cyan-600 transition">About Us</a>
          <a href="#contacts" onClick={() => setOpen(false)} className="block text-gray-700 font-medium hover:text-cyan-600 transition">Contacts</a>
          <button onClick={() => { setOpen(false); onOpenAuth('register'); }} className="mt-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg">Sign Up</button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

