import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMdCloudUpload, IoMdMenu, IoMdClose } from 'react-icons/io';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/upload', label: 'Upload PYQs' },
    { to: '/browse', label: 'Browse PYQs' },
    { to: '/about', label: 'About' },
  ];
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoMdCloudUpload className="h-8 w-8 text-primary-600" />
            </motion.div>
            <span className="font-bold text-xl tracking-tight text-primary-600">PYQ Portal</span>
          </Link>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to}
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isActive 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-500 hover:text-primary-600 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <IoMdClose className="h-6 w-6" />
              ) : (
                <IoMdMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white"
      >
        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;