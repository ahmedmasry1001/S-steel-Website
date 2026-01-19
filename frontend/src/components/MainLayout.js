import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  PhoneIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const MainLayout = ({ children, currentPage = "home" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPageData, setCurrentPageData] = useState(1);
  const [itemsPerPage] = useState(12); // 3 rows × 4 columns

  // Navigation structure
  const topMenuCategories = [
    {
      id: 'projects',
      name: 'Our Projects',
      icon: BuildingOfficeIcon,
      subcategories: [
        { name: 'Commercial Buildings', path: '/projects?category=commercial' },
        { name: 'Industrial Facilities', path: '/projects?category=industrial' },
        { name: 'Residential Structures', path: '/projects?category=residential' },
        { name: 'Infrastructure', path: '/projects?category=infrastructure' },
        { name: 'All Projects', path: '/projects' }
      ]
    },
    {
      id: 'services',
      name: 'Our Services',
      icon: WrenchScrewdriverIcon,
      subcategories: [
        { name: 'Structural Steel Fabrication', path: '/services#fabrication' },
        { name: 'Steel Erection', path: '/services#erection' },
        { name: 'Welding Services', path: '/services#welding' },
        { name: 'Design & Engineering', path: '/services#design' },
        { name: 'Maintenance & Repair', path: '/services#maintenance' }
      ]
    },
    {
      id: 'company',
      name: 'Company Info',
      icon: InformationCircleIcon,
      subcategories: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Team', path: '/about#team' },
        { name: 'Certifications', path: '/about#certifications' },
        { name: 'Safety Standards', path: '/about#safety' }
      ]
    },
    {
      id: 'contact',
      name: 'Contact & Support',
      icon: PhoneIcon,
      subcategories: [
        { name: 'Get Quote', path: '/contact' },
        { name: 'Project Consultation', path: '/contact?type=consultation' },
        { name: 'Technical Support', path: '/contact?type=support' },
        { name: 'General Inquiry', path: '/contact?type=general' }
      ]
    }
  ];

  const sidebarMenuItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'All Projects', path: '/projects', icon: BuildingOfficeIcon },
    { name: 'Services', path: '/services', icon: WrenchScrewdriverIcon },
    { name: 'Gallery', path: '/gallery', icon: PhotoIcon },
    { name: 'About Us', path: '/about', icon: InformationCircleIcon },
    { name: 'Contact', path: '/contact', icon: PhoneIcon }
  ];

  const toggleDropdown = (categoryId) => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Container 1: Top Menu with Professional Dropdown */}
      <header className="bg-white shadow-lg border-b-2 border-industrial-orange sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Logo and Brand Row */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-steel-blue to-steel-blue-light rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-steel-blue to-industrial-orange bg-clip-text text-transparent">
                  S-Steel Construction
                </span>
                <p className="text-xs text-steel-gray">Professional Steel Solutions</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm text-steel-gray">
                <p>📞 +1 (555) 123-4567</p>
                <p>📧 info@s-steel.com</p>
              </div>
            </div>
          </div>

          {/* Professional Dropdown Menu Row */}
          <div className="py-3">
            <nav className="flex justify-center space-x-8">
              {topMenuCategories.map((category) => (
                <div key={category.id} className="relative">
                  <button
                    onClick={() => toggleDropdown(category.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-steel-gray hover:text-industrial-orange transition-all duration-200 rounded-lg hover:bg-gray-50"
                  >
                    <category.icon className="h-5 w-5" />
                    <span className="font-medium">{category.name}</span>
                    {activeDropdown === category.id ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {activeDropdown === category.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40"
                      >
                        {category.subcategories.map((subcategory, index) => (
                          <Link
                            key={index}
                            to={subcategory.path}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-4 py-2 text-steel-gray hover:text-industrial-orange hover:bg-gray-50 transition-colors"
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Container 2: Left Sidebar Navigation */}
        <aside className={`bg-steel-blue text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        } flex-shrink-0`}>
          <div className="p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-steel-blue-light transition-colors"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>

          <nav className="px-4 space-y-2">
            {sidebarMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-industrial-orange text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-steel-blue-light'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>

          {sidebarOpen && (
            <div className="mt-8 px-4">
              <div className="bg-steel-blue-light rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Quick Contact</h4>
                <p className="text-gray-300 text-sm mb-2">Need immediate assistance?</p>
                <Link
                  to="/contact"
                  className="block w-full text-center bg-industrial-orange text-white py-2 rounded-lg hover:bg-industrial-orange-dark transition-colors"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Container 3: Main Content Area (No Scroll, Pagination) */}
        <main className="flex-1 p-6 overflow-hidden">
          <div className="h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>

      {/* Container 4: Footer with Purple Background */}
      <footer className="bg-gradient-to-r from-purple-700 to-purple-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Information</h3>
              <div className="space-y-2 text-purple-100">
                <p>📍 123 Steel Industry Blvd, Industrial City</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📠 +1 (555) 123-4568</p>
                <p>📧 info@s-steel.com</p>
                <p>🌐 www.s-steel.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/projects" className="text-purple-100 hover:text-white transition-colors">Our Projects</Link></li>
                <li><Link to="/services" className="text-purple-100 hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/about" className="text-purple-100 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-purple-100 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support & Services</h3>
              <ul className="space-y-2 text-purple-100">
                <li>🛠️ Technical Support</li>
                <li>📋 Project Consultation</li>
                <li>🔧 Maintenance Services</li>
                <li>📞 24/7 Emergency Support</li>
                <li>📄 Documentation & Guides</li>
              </ul>
            </div>

            {/* Social & Certifications */}
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition-colors">📘</a>
                <a href="#" className="bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition-colors">🐦</a>
                <a href="#" className="bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition-colors">📷</a>
                <a href="#" className="bg-purple-600 p-2 rounded-lg hover:bg-purple-500 transition-colors">💼</a>
              </div>
              <div className="text-purple-100 text-sm">
                <p>✅ ISO 9001:2015 Certified</p>
                <p>✅ OSHA Compliant</p>
                <p>✅ AWS Certified Welders</p>
              </div>
            </div>
          </div>

          {/* Rights Reserved */}
          <div className="border-t border-purple-600 mt-8 pt-6 text-center">
            <p className="text-purple-100">
              © 2026 S-Steel Construction Company. All rights reserved. | 
              <Link to="/privacy" className="hover:text-white ml-1">Privacy Policy</Link> | 
              <Link to="/terms" className="hover:text-white ml-1">Terms of Service</Link>
            </p>
            <p className="text-purple-200 text-sm mt-2">
              Professional Steel Construction Solutions - Building Your Future with Strength and Precision
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Pagination Component for 12 items per page
export const PaginationControls = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage = 12, 
  onPageChange,
  className = ""
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-steel-gray hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Previous</span>
      </button>

      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg transition-colors ${
              currentPage === page
                ? 'bg-industrial-orange text-white'
                : 'border border-gray-300 text-steel-gray hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-steel-gray hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span>Next</span>
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MainLayout;
