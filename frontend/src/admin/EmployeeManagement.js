import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience_years: '',
    specialty: '',
    bio: '',
    email: '',
    phone: '',
    avatar_url: '',
    is_active: true
  });

  // Load employees
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        toast.error('Failed to load employees');
      }
    } catch (error) {
      toast.error('Error loading employees');
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

  const startEdit = (employee) => {
    setEditingEmployee(employee.id);
    setFormData({
      name: employee.name || '',
      role: employee.role || '',
      experience_years: employee.experience_years || '',
      specialty: employee.specialty || '',
      bio: employee.bio || '',
      email: employee.email || '',
      phone: employee.phone || '',
      avatar_url: employee.avatar_url || '',
      is_active: employee.is_active
    });
  };

  const startAdd = () => {
    setShowAddForm(true);
    setFormData({
      name: '',
      role: '',
      experience_years: '',
      specialty: '',
      bio: '',
      email: '',
      phone: '',
      avatar_url: '',
      is_active: true
    });
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      role: '',
      experience_years: '',
      specialty: '',
      bio: '',
      email: '',
      phone: '',
      avatar_url: '',
      is_active: true
    });
  };

  const saveEmployee = async () => {
    if (!formData.name || !formData.role) {
      toast.error('Name and role are required');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const url = editingEmployee ? `/api/admin/employees/${editingEmployee}` : '/api/admin/employees';
      const method = editingEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Employee ${editingEmployee ? 'updated' : 'created'} successfully`);
        await loadEmployees();
        cancelEdit();
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${editingEmployee ? 'update' : 'create'} employee`);
      }
    } catch (error) {
      toast.error('Network error occurred');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteEmployee = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Employee deleted successfully');
        await loadEmployees();
      } else {
        toast.error('Failed to delete employee');
      }
    } catch (error) {
      toast.error('Error deleting employee');
      console.error('Delete error:', error);
    }
  };

  const EmployeeForm = ({ isEdit = false }) => (
    <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Name *</label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Employee name"
          />
        </div>
        <div>
          <label className="form-label">Role *</label>
          <input
            type="text"
            className="form-input"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            placeholder="Job title"
          />
        </div>
        <div>
          <label className="form-label">Experience (Years)</label>
          <input
            type="number"
            className="form-input"
            value={formData.experience_years}
            onChange={(e) => handleInputChange('experience_years', e.target.value)}
            placeholder="Years of experience"
          />
        </div>
        <div>
          <label className="form-label">Specialty</label>
          <input
            type="text"
            className="form-input"
            value={formData.specialty}
            onChange={(e) => handleInputChange('specialty', e.target.value)}
            placeholder="Area of expertise"
          />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="employee@company.com"
          />
        </div>
        <div>
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-input"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div className="col-span-2">
          <label className="form-label">Avatar (Emoji or URL)</label>
          <input
            type="text"
            className="form-input"
            value={formData.avatar_url}
            onChange={(e) => handleInputChange('avatar_url', e.target.value)}
            placeholder="👨‍💼 or image URL"
          />
        </div>
        <div className="col-span-2">
          <label className="form-label">Bio</label>
          <textarea
            className="form-input"
            rows={3}
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Brief description of employee"
          />
        </div>
        <div className="col-span-2 flex items-center">
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
          onClick={saveEmployee}
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
              {isEdit ? 'Update' : 'Create'} Employee
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
        <span className="ml-2 text-text-secondary">Loading employees...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserGroupIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Employee Management</h1>
            <p className="text-text-secondary">Manage team members displayed on the About page</p>
          </div>
        </div>
        <button
          onClick={startAdd}
          disabled={showAddForm}
          className="btn-primary"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-text-primary">Add New Employee</h3>
          <EmployeeForm />
        </motion.div>
      )}

      {/* Employees List */}
      <div className="space-y-4">
        {employees.map((employee) => (
          <motion.div
            key={employee.id}
            layout
            className="bg-white rounded-lg border border-border-color p-4"
          >
            {editingEmployee === employee.id ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Edit Employee</h3>
                <EmployeeForm isEdit={true} />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{employee.avatar_url || '👤'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-text-primary">{employee.name}</h3>
                      <span className="text-sm text-text-secondary">{employee.role}</span>
                      {!employee.is_active && (
                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">Inactive</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-text-secondary">
                      {employee.specialty && <span>• {employee.specialty}</span>}
                      {employee.experience_years && <span>• {employee.experience_years} years experience</span>}
                      {employee.email && <span>• {employee.email}</span>}
                    </div>
                    {employee.bio && (
                      <p className="text-sm text-text-secondary mt-2 max-w-2xl">{employee.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(employee)}
                    className="btn-secondary text-sm"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
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

        {employees.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No employees added</h3>
            <p className="text-text-secondary">Add your first employee to display on the About page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
