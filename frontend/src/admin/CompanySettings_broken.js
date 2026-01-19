import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const CompanySettings = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    founded: '',
    employees: '',
    projects_completed: ''
  });

  const [contactInfo, setContactInfo] = useState({
    support_email: '',
    support_phone: '',
    sales_email: '',
    sales_phone: '',
    emergency_contact: '',
    business_hours: '',
    office_locations: []
  });

  const [activeTab, setActiveTab] = useState('company');

  // Load data on component mount
  useEffect(() => {
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    try {
      setInitialLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5001/api/admin/company-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update company info
        setCompanyInfo({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          founded: data.founded || '',
          employees: data.employees || '',
          projects_completed: data.projects_completed || ''
        });

        // Update contact info
        setContactInfo({
          support_email: data.support_email || '',
          support_phone: data.support_phone || '',
          sales_email: data.sales_email || '',
          sales_phone: data.sales_phone || '',
          emergency_contact: data.emergency_contact || '',
          business_hours: data.business_hours || '',
          office_locations: data.office_locations || []
        });
      } else {
        toast.error('Failed to load company settings');
      }
    } catch (error) {
      toast.error('Error loading company settings');
      console.error('Load error:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCompanyInfoChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (locationId, field, value) => {
    setContactInfo(prev => ({
      ...prev,
      office_locations: prev.office_locations.map(location =>
        location.id === locationId
          ? { ...location, [field]: value }
          : location
      )
    }));
  };

  const addNewLocation = () => {
    const newLocation = {
      id: Date.now(),
      name: 'New Office',
      address: '',
      phone: ''
    };
    setContactInfo(prev => ({
      ...prev,
      office_locations: [...prev.office_locations, newLocation]
    }));
  };

  const removeLocation = (locationId) => {
    setContactInfo(prev => ({
      ...prev,
      office_locations: prev.office_locations.filter(location => location.id !== locationId)
    }));
  };

  const saveCompanyInfo = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5001/api/admin/company-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyInfo)
      });

      if (response.ok) {
        toast.success('Company information updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update company information');
      }
    } catch (error) {
      toast.error('Network error occurred');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContactInfo = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5001/api/admin/company-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactInfo)
      });

      if (response.ok) {
        toast.success('Contact information updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update contact information');
      }
    } catch (error) {
      toast.error('Network error occurred');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Company Settings</h1>
          <p className="text-text-secondary mt-1">Manage your company information and contact details</p>
        </div>
      </div>

      {/* Initial Loading State */}
      {initialLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-text-secondary">Loading company settings...</span>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="border-b border-border-color">
            <nav className="-mb-px flex space-x-8">
              <button
            onClick={() => setActiveTab('company')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'company'
                ? 'border-industrial-orange text-industrial-orange'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            <BuildingOfficeIcon className="w-5 h-5 inline mr-2" />
            Company Info
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contact'
                ? 'border-industrial-orange text-industrial-orange'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            <PhoneIcon className="w-5 h-5 inline mr-2" />
            Contact & Support
          </button>
        </nav>
      </div>

      {/* Company Info Tab */}
      {activeTab === 'company' && (
        <div className="data-table">
          <div className="table-header">
            <h3 className="table-title">Company Information</h3>
            <button 
              onClick={saveCompanyInfo}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyInfo.name}
                  onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Founded Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyInfo.founded}
                  onChange={(e) => handleCompanyInfoChange('founded', e.target.value)}
                />
              </div>

              <div className="form-group lg:col-span-2">
                <label className="form-label">Company Description</label>
                <textarea
                  className="form-input form-textarea"
                  rows={4}
                  value={companyInfo.description}
                  onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
                />
              </div>

              <div className="form-group lg:col-span-2">
                <label className="form-label">Main Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyInfo.address}
                  onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Main Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={companyInfo.phone}
                  onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Main Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={companyInfo.email}
                  onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Website</label>
                <input
                  type="url"
                  className="form-input"
                  value={companyInfo.website}
                  onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Employees</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyInfo.employees}
                  onChange={(e) => handleCompanyInfoChange('employees', e.target.value)}
                />
              </div>

              <div className="form-group lg:col-span-2">
                <label className="form-label">Projects Completed</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyInfo.projects_completed}
                  onChange={(e) => handleCompanyInfoChange('projects_completed', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact & Support Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Support Information */}
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Support & Sales Information</h3>
              <button 
                onClick={saveContactInfo}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Support Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={contactInfo.support_email}
                    onChange={(e) => handleContactInfoChange('support_email', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Support Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={contactInfo.support_phone}
                    onChange={(e) => handleContactInfoChange('support_phone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sales Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={contactInfo.sales_email}
                    onChange={(e) => handleContactInfoChange('sales_email', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sales Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={contactInfo.sales_phone}
                    onChange={(e) => handleContactInfoChange('sales_phone', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={contactInfo.emergency_contact}
                    onChange={(e) => handleContactInfoChange('emergency_contact', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Business Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    value={contactInfo.business_hours}
                    onChange={(e) => handleContactInfoChange('business_hours', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Office Locations */}
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Office Locations</h3>
              <button 
                onClick={addNewLocation}
                className="btn btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
                Add Location
              </button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Office Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contactInfo.office_locations.map((location) => (
                    <tr key={location.id}>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          value={location.name}
                          onChange={(e) => handleLocationChange(location.id, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          value={location.address}
                          onChange={(e) => handleLocationChange(location.id, 'address', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="tel"
                          className="form-input"
                          value={location.phone}
                          onChange={(e) => handleLocationChange(location.id, 'phone', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => removeLocation(location.id)}
                          className="text-error hover:text-red-700 p-2"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </>
      )}
    </motion.div>
  );
};

export default CompanySettings;
