import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-industrial-orange">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-steel-blue to-steel-blue-light rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-steel-blue to-industrial-orange bg-clip-text text-transparent">S-Steel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-lg font-medium transition-all duration-300 hover:scale-105 ${
                  isActive(item.href)
                    ? 'text-industrial-orange border-b-2 border-industrial-orange'
                    : 'text-steel-gray hover:text-industrial-orange'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link to="/contact" className="btn btn-primary bg-gradient-to-r from-industrial-orange to-industrial-orange-light hover:from-industrial-orange-dark hover:to-industrial-orange shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Get Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-steel-gray hover:text-industrial-orange transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-all duration-300 rounded-md ${
                    isActive(item.href)
                      ? 'text-industrial-orange bg-industrial-orange bg-opacity-10'
                      : 'text-steel-gray hover:text-industrial-orange hover:bg-industrial-orange hover:bg-opacity-10'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="btn btn-primary w-fit"
                onClick={() => setIsOpen(false)}
              >
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
