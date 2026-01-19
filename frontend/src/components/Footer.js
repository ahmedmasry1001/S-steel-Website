import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load company info from API
    const loadCompanyInfo = async () => {
      try {
        const response = await fetch('/api/company-info');
        if (response.ok) {
          const data = await response.json();
          console.log('✓ Footer API Data loaded:', data);
          
          // Extract footer-specific data with fallbacks
          const footerData = {
            footer_address: data.footer_address || data.address || 'N/A',
            footer_phone: data.footer_phone || data.phone || 'N/A',
            footer_fax: data.footer_fax || 'N/A',
            footer_email: data.footer_email || data.email || 'N/A',
            footer_website: data.footer_website || data.website || 'N/A',
            footer_facebook: data.footer_facebook || '',
            footer_twitter: data.footer_twitter || '',
            footer_instagram: data.footer_instagram || '',
            footer_linkedin: data.footer_linkedin || '',
            footer_certification_iso: data.footer_certification_iso === true || data.footer_certification_iso === 'true',
            footer_certification_osha: data.footer_certification_osha === true || data.footer_certification_osha === 'true',
            footer_certification_aws: data.footer_certification_aws === true || data.footer_certification_aws === 'true'
          };
          
          console.log('✓ Footer Data Processed:', footerData);
          setCompanyInfo(footerData);
        } else {
          console.error('✗ Footer API response not ok:', response.status);
          setCompanyInfo(getDefaultFooterInfo());
        }
      } catch (error) {
        console.error('✗ Error loading footer info:', error);
        setCompanyInfo(getDefaultFooterInfo());
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyInfo();
  }, []);

  // Default footer info if API fails
  const getDefaultFooterInfo = () => ({
    footer_address: 'N/A',
    footer_phone: 'N/A',
    footer_fax: 'N/A',
    footer_email: 'N/A',
    footer_website: 'N/A',
    footer_facebook: '',
    footer_twitter: '',
    footer_instagram: '',
    footer_linkedin: '',
    footer_certification_iso: true,
    footer_certification_osha: true,
    footer_certification_aws: true
  });

  return (
    <footer className="bg-dark-gray text-white">
      {isLoading && <div className="text-center py-8 text-gray-400">Loading footer information...</div>}
      
      {companyInfo && (
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
                  <p>{companyInfo.footer_address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-secondary-blue" />
                <a href={`tel:${companyInfo.footer_phone}`} className="text-gray-300 hover:text-secondary-blue transition-colors">
                  {companyInfo.footer_phone}
                </a>
              </div>
              {companyInfo.footer_fax && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-secondary-blue" />
                  <span className="text-gray-300">Fax: {companyInfo.footer_fax}</span>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-secondary-blue" />
                <a href={`mailto:${companyInfo.footer_email}`} className="text-gray-300 hover:text-secondary-blue transition-colors">
                  {companyInfo.footer_email}
                </a>
              </div>
              {companyInfo.footer_website && (
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-secondary-blue" />
                  <a href={`https://${companyInfo.footer_website}`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary-blue transition-colors">
                    {companyInfo.footer_website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Media & Certifications */}
        <div className="border-t border-gray-700 mt-12 pt-8 space-y-6">
          {/* Social Media Links */}
          {(companyInfo.footer_facebook || companyInfo.footer_twitter || companyInfo.footer_instagram || companyInfo.footer_linkedin) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {companyInfo.footer_facebook && (
                  <a href={companyInfo.footer_facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary-blue transition-colors text-sm">
                    📘
                  </a>
                )}
                {companyInfo.footer_twitter && (
                  <a href={companyInfo.footer_twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary-blue transition-colors text-sm">
                    🐦
                  </a>
                )}
                {companyInfo.footer_instagram && (
                  <a href={companyInfo.footer_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary-blue transition-colors text-sm">
                    📷
                  </a>
                )}
                {companyInfo.footer_linkedin && (
                  <a href={companyInfo.footer_linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-secondary-blue transition-colors text-sm">
                    💼
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {(companyInfo.footer_certification_iso || companyInfo.footer_certification_osha || companyInfo.footer_certification_aws) && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Certifications & Compliance</h4>
              <div className="space-y-1 text-gray-400 text-sm">
                {companyInfo.footer_certification_iso && <p>✅ ISO 9001:2015 Certified</p>}
                {companyInfo.footer_certification_osha && <p>✅ OSHA Compliant</p>}
                {companyInfo.footer_certification_aws && <p>✅ AWS Certified Welders</p>}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
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
      )}
    </footer>
  );
};

export default Footer;
