import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const DashboardSettings = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statsCards, setStatsCards] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadDashboardSettings();
  }, []);

  const loadDashboardSettings = async () => {
    try {
      setInitialLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5001/api/admin/dashboard-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatsCards(data.stats_cards || []);
        setQuickActions(data.quick_actions || []);
      } else {
        toast.error('Failed to load dashboard settings');
      }
    } catch (error) {
      toast.error('Error loading dashboard settings');
      console.error('Load error:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const [editingCard, setEditingCard] = useState(null);
  const [editingAction, setEditingAction] = useState(null);

  const handleCardChange = (cardId, field, value) => {
    setStatsCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, [field]: value }
          : card
      )
    );
  };

  const handleActionChange = (actionId, field, value) => {
    setQuickActions(prev =>
      prev.map(action =>
        action.id === actionId
          ? { ...action, [field]: value }
          : action
      )
    );
  };

  const toggleCardVisibility = (cardId) => {
    setStatsCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? { ...card, visible: !card.visible }
          : card
      )
    );
  };

  const toggleActionVisibility = (actionId) => {
    setQuickActions(prev =>
      prev.map(action =>
        action.id === actionId
          ? { ...action, visible: !action.visible }
          : action
      )
    );
  };

  const deleteCard = (cardId) => {
    if (window.confirm('Are you sure you want to delete this stats card?')) {
      setStatsCards(prev => prev.filter(card => card.id !== cardId));
      toast.success('Stats card deleted successfully');
    }
  };

  const deleteAction = (actionId) => {
    if (window.confirm('Are you sure you want to delete this quick action?')) {
      setQuickActions(prev => prev.filter(action => action.id !== actionId));
      toast.success('Quick action deleted successfully');
    }
  };

  const addNewCard = () => {
    const newCard = {
      id: Date.now(),
      title: 'New Metric',
      value: '0',
      change: '+0% this month',
      icon: 'ChartBarIcon',
      visible: true,
      order: statsCards.length + 1
    };
    setStatsCards(prev => [...prev, newCard]);
    setEditingCard(newCard.id);
  };

  const addNewAction = () => {
    const newAction = {
      id: Date.now(),
      title: 'New Action',
      description: 'Description of the action',
      link: '/admin',
      icon: 'PlusIcon',
      visible: true
    };
    setQuickActions(prev => [...prev, newAction]);
    setEditingAction(newAction.id);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:5001/api/admin/dashboard-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stats_cards: statsCards,
          quick_actions: quickActions
        })
      });

      if (response.ok) {
        toast.success('Dashboard settings updated successfully!');
        setEditingCard(null);
        setEditingAction(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update dashboard settings');
      }
    } catch (error) {
      toast.error('Network error occurred');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    'ChartBarIcon',
    'BuildingOfficeIcon',
    'PhotoIcon',
    'ChatBubbleLeftRightIcon',
    'UserGroupIcon',
    'DocumentTextIcon',
    'PlusIcon',
    'CogIcon'
  ];

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
          <h1 className="text-3xl font-bold text-text-primary">Dashboard Settings</h1>
          <p className="text-text-secondary mt-1">Manage dashboard cards, metrics, and quick actions</p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Initial Loading State */}
      {initialLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-text-secondary">Loading dashboard settings...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards Management */}
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Stats Cards</h3>
          <button 
            onClick={addNewCard}
            className="btn btn-secondary"
          >
            <PlusIcon className="w-4 h-4" />
            Add Stats Card
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Value</th>
                <th>Change Text</th>
                <th>Icon</th>
                <th>Order</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statsCards.map((card) => (
                <tr key={card.id}>
                  <td>
                    {editingCard === card.id ? (
                      <input
                        type="text"
                        className="form-input"
                        value={card.title}
                        onChange={(e) => handleCardChange(card.id, 'title', e.target.value)}
                      />
                    ) : (
                      <span className="font-medium text-text-primary">{card.title}</span>
                    )}
                  </td>
                  <td>
                    {editingCard === card.id ? (
                      <input
                        type="text"
                        className="form-input"
                        value={card.value}
                        onChange={(e) => handleCardChange(card.id, 'value', e.target.value)}
                      />
                    ) : (
                      <span>{card.value}</span>
                    )}
                  </td>
                  <td>
                    {editingCard === card.id ? (
                      <input
                        type="text"
                        className="form-input"
                        value={card.change}
                        onChange={(e) => handleCardChange(card.id, 'change', e.target.value)}
                      />
                    ) : (
                      <span className="text-sm text-text-secondary">{card.change}</span>
                    )}
                  </td>
                  <td>
                    {editingCard === card.id ? (
                      <select
                        className="form-input"
                        value={card.icon}
                        onChange={(e) => handleCardChange(card.id, 'icon', e.target.value)}
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm">{card.icon}</span>
                    )}
                  </td>
                  <td>
                    {editingCard === card.id ? (
                      <input
                        type="number"
                        className="form-input"
                        value={card.order}
                        onChange={(e) => handleCardChange(card.id, 'order', parseInt(e.target.value))}
                      />
                    ) : (
                      <span>{card.order}</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleCardVisibility(card.id)}
                      className={`p-1 rounded ${card.visible ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {card.visible ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                    </button>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCard(editingCard === card.id ? null : card.id)}
                        className="text-industrial-orange hover:text-industrial-orange-dark p-1"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="text-error hover:text-red-700 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Management */}
      <div className="data-table">
        <div className="table-header">
          <h3 className="table-title">Quick Actions</h3>
          <button 
            onClick={addNewAction}
            className="btn btn-secondary"
          >
            <PlusIcon className="w-4 h-4" />
            Add Quick Action
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Link</th>
                <th>Icon</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quickActions.map((action) => (
                <tr key={action.id}>
                  <td>
                    {editingAction === action.id ? (
                      <input
                        type="text"
                        className="form-input"
                        value={action.title}
                        onChange={(e) => handleActionChange(action.id, 'title', e.target.value)}
                      />
                    ) : (
                      <span className="font-medium text-text-primary">{action.title}</span>
                    )}
                  </td>
                  <td>
                    {editingAction === action.id ? (
                      <input
                        type="text"
                        className="form-input"
                        value={action.description}
                        onChange={(e) => handleActionChange(action.id, 'description', e.target.value)}
                      />
                    ) : (
                      <span className="text-sm text-text-secondary">{action.description}</span>
                    )}
                  </td>
                  <td>
                    {editingAction === action.id ? (
                      <input
                        type="text"
                        className="form-input"
                        value={action.link}
                        onChange={(e) => handleActionChange(action.id, 'link', e.target.value)}
                      />
                    ) : (
                      <span className="text-sm">{action.link}</span>
                    )}
                  </td>
                  <td>
                    {editingAction === action.id ? (
                      <select
                        className="form-input"
                        value={action.icon}
                        onChange={(e) => handleActionChange(action.id, 'icon', e.target.value)}
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm">{action.icon}</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActionVisibility(action.id)}
                      className={`p-1 rounded ${action.visible ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {action.visible ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                    </button>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingAction(editingAction === action.id ? null : action.id)}
                        className="text-industrial-orange hover:text-industrial-orange-dark p-1"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAction(action.id)}
                        className="text-error hover:text-red-700 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </motion.div>
  );
};

export default DashboardSettings;
