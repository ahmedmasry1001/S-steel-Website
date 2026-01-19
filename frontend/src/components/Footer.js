import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-gray text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold">S-Steel</span>
            </div>
            <p className="text-gray-300">
              Professional steel structure solutions for construction, infrastructure, 
              and industrial projects. Quality craftsmanship you can trust.
            </p>
            <div className="flex items-center space-x-2">
              <BuildingOfficeIcon className="h-5 w-5 text-secondary-blue" />
              <span className="text-sm text-gray-300">Since 2010</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Services', href: '/services' },
                { name: 'Projects', href: '/projects' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-secondary-blue transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Steel Structure Design</li>
              <li>Construction Services</li>
              <li>Project Management</li>
              <li>Quality Inspection</li>
              <li>Maintenance & Repair</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-secondary-blue mt-1" />
                <div className="text-gray-300">
                  <p>123 Steel Avenue</p>
                  <p>Industrial District</p>
                  <p>City, State 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-secondary-blue" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-secondary-blue" />
                <span className="text-gray-300">info@s-steel.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-center md:text-left">
              © {currentYear} S-Steel Construction. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/admin" className="text-gray-400 hover:text-secondary-blue transition-colors text-sm">
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
