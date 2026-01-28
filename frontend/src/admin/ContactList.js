import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // Set placeholder data
      setContacts([
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          subject: 'Steel Building Inquiry',
          message: 'I am interested in steel construction for a commercial building project.',
          status: 'new',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.j@company.com',
          phone: '+1 (555) 987-6543',
          subject: 'Warehouse Construction',
          message: 'Need a quote for a 10,000 sq ft warehouse construction.',
          status: 'replied',
          created_at: '2024-01-14T14:20:00Z'
        },
        {
          id: 3,
          name: 'Mike Wilson',
          email: 'mike.wilson@email.com',
          phone: '',
          subject: 'Residential Steel Frame',
          message: 'Looking for steel frame construction for my house.',
          status: 'new',
          created_at: '2024-01-13T09:15:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setContacts(prev => 
          prev.map(contact => 
            contact.id === contactId ? { ...contact, status: newStatus } : contact
          )
        );
        toast.success('Contact status updated');
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
      } else if (response.status === 404) {
        toast.error('Contact not found');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update contact status');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Failed to update contact status');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        toast.success('Contact deleted successfully');
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
      } else if (response.status === 404) {
        toast.error('Contact not found');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
        <span className="ml-3 text-text-secondary">Loading contacts...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-steel-blue">Contact Messages</h1>
          <p className="text-steel-gray">Manage customer inquiries and messages</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-light">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-gray" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow-light overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                className="p-4 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Contact Info */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-steel-blue">{contact.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-steel-gray mb-2">
                      <div className="flex items-center gap-1">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-steel-blue mb-1">{contact.subject}</h4>
                    <p className="text-steel-gray text-sm line-clamp-2">{contact.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedContact(contact)}
                      className="p-2 text-industrial-orange hover:bg-industrial-orange hover:bg-opacity-10 rounded transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    
                    <select
                      value={contact.status}
                      onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-industrial-orange"
                    >
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                    
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <EnvelopeIcon className="mx-auto h-12 w-12 text-steel-gray-light mb-4" />
            <h3 className="text-lg font-medium text-steel-gray mb-2">No contacts found</h3>
            <p className="text-steel-gray">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No contact messages yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-steel-blue">Contact Details</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-steel-gray hover:text-steel-blue"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-steel-gray">Name</label>
                  <p className="text-steel-blue">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-gray">Email</label>
                  <p className="text-steel-blue">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="block text-sm font-medium text-steel-gray">Phone</label>
                    <p className="text-steel-blue">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-steel-gray">Subject</label>
                  <p className="text-steel-blue">{selectedContact.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-gray">Message</label>
                  <p className="text-steel-gray whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-gray">Received</label>
                  <p className="text-steel-gray">{new Date(selectedContact.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="btn btn-outline text-sm"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=${encodeURIComponent(`Re: ${selectedContact.subject}`)}`}
                  className="btn btn-primary text-sm"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactList;
