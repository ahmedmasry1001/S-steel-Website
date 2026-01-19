import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ContactCardsManagement = () => {
  const [contactCards, setContactCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    details: '',
    sub_details: '',
    contact_type: 'phone',
    icon_emoji: '',
    is_active: true
  });

  const contactTypes = [
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'address', label: 'Address' },
    { value: 'social', label: 'Social Media' },
    { value: 'chat', label: 'Chat/Messaging' },
    { value: 'other', label: 'Other' }
  ];

  // Load contact cards
  useEffect(() => {
    loadContactCards();
  }, []);

  const loadContactCards = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/contact-cards', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContactCards(data);
      } else {
        toast.error('Failed to load contact cards');
      }
    } catch (error) {
      toast.error('Error loading contact cards');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEdit = (card) => {
    setEditingCard(card.id);
    setFormData({
      title: card.title || '',
      details: card.details || '',
      sub_details: card.sub_details || '',
      contact_type: card.contact_type || 'phone',
      icon_emoji: card.icon_emoji || '',
      is_active: card.is_active
    });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setFormData({
      title: '',
      details: '',
      sub_details: '',
      contact_type: 'phone',
      icon_emoji: '',
      is_active: true
    });
  };

  const cancelEdit = () => {
    setEditingCard(null);
    setShowAddForm(false);
    setFormData({
      title: '',
      details: '',
      sub_details: '',
      contact_type: 'phone',
      icon_emoji: '',
      is_active: true
    });
  };

  const saveContactCard = async () => {
    if (!formData.title || !formData.details) {
      toast.error('Title and details are required');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const url = editingCard ? `/api/admin/contact-cards/${editingCard}` : '/api/admin/contact-cards';
      const method = editingCard ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Contact card ${editingCard ? 'updated' : 'created'} successfully`);
        await loadContactCards();
        cancelEdit();
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${editingCard ? 'update' : 'create'} contact card`);
      }
    } catch (error) {
      toast.error('Network error occurred');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteContactCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this contact card?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/contact-cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Contact card deleted successfully');
        await loadContactCards();
      } else {
        toast.error('Failed to delete contact card');
      }
    } catch (error) {
      toast.error('Error deleting contact card');
      console.error('Delete error:', error);
    }
  };

  const ContactCardForm = ({ isEdit = false }) => (
    <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Title *</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Main Office, Emergency Line"
          />
        </div>
        <div>
          <label className="form-label">Contact Type</label>
          <select
            className="form-input"
            value={formData.contact_type}
            onChange={(e) => handleInputChange('contact_type', e.target.value)}
          >
            {contactTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Details * (Phone, Email, Address, etc.)</label>
          <input
            type="text"
            className="form-input"
            value={formData.details}
            onChange={(e) => handleInputChange('details', e.target.value)}
            placeholder="e.g., +1 (555) 123-4567, contact@company.com"
          />
        </div>
        <div>
          <label className="form-label">Sub Details (Additional info)</label>
          <input
            type="text"
            className="form-input"
            value={formData.sub_details}
            onChange={(e) => handleInputChange('sub_details', e.target.value)}
            placeholder="e.g., Mon-Fri 9AM-5PM, 24/7 Available"
          />
        </div>
        <div>
          <label className="form-label">Icon Emoji</label>
          <input
            type="text"
            className="form-input"
            value={formData.icon_emoji}
            onChange={(e) => handleInputChange('icon_emoji', e.target.value)}
            placeholder="📞 📧 📍 💬 🚨"
          />
        </div>
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-text-primary">Active (visible on website)</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={cancelEdit}
          className="btn-secondary"
        >
          <XMarkIcon className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          type="button"
          onClick={saveContactCard}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              {isEdit ? 'Update' : 'Create'} Contact Card
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-text-secondary">Loading contact cards...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Contact Cards Management</h1>
            <p className="text-text-secondary">Manage contact methods displayed on the Contact page</p>
          </div>
        </div>
        <button
          onClick={startAdd}
          disabled={showAddForm}
          className="btn-primary"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Contact Card
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-text-primary">Add New Contact Card</h3>
          <ContactCardForm />
        </motion.div>
      )}

      {/* Contact Cards List */}
      <div className="space-y-4">
        {contactCards.map((card) => (
          <motion.div
            key={card.id}
            layout
            className="bg-white rounded-lg border border-border-color p-4"
          >
            {editingCard === card.id ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Edit Contact Card</h3>
                <ContactCardForm isEdit={true} />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{card.icon_emoji || '📞'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-text-primary">{card.title}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {contactTypes.find(t => t.value === card.contact_type)?.label || card.contact_type}
                      </span>
                      {!card.is_active && (
                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">Inactive</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-text-secondary">
                      <span className="font-medium">{card.details}</span>
                      {card.sub_details && <span>• {card.sub_details}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(card)}
                    className="btn-secondary text-sm"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteContactCard(card.id)}
                    className="btn-danger text-sm"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {contactCards.length === 0 && (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No contact cards added</h3>
            <p className="text-text-secondary">Add your first contact card to display on the Contact page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCardsManagement;
