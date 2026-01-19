import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import {
  PlusIcon,
  PhotoIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    newContacts: 0,
    featuredProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Set demo data
      setRecentProjects([
        { id: 1, title: 'Modern Office Complex', category: 'commercial', created_at: '2024-01-15' },
        { id: 2, title: 'Industrial Plant', category: 'industrial', created_at: '2024-01-10' },
        { id: 3, title: 'Steel Bridge Construction', category: 'infrastructure', created_at: '2024-01-08' }
      ]);
      setStats({
        totalProjects: 12,
        newContacts: 5,
        featuredProjects: 3
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-text-secondary">Loading dashboard...</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Dashboard Overview</h1>
              <p className="text-text-secondary mt-1">Welcome back! Here's what's happening with your projects.</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <BuildingOfficeIcon />
                </div>
                <div className="stat-change">+12% this month</div>
              </div>
              <p className="stat-title">Total Projects</p>
              <h3 className="stat-value">{stats.totalProjects}</h3>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <ChatBubbleLeftRightIcon />
                </div>
                <div className="stat-change">+8% this week</div>
              </div>
              <p className="stat-title">New Contacts</p>
              <h3 className="stat-value">{stats.newContacts}</h3>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <PhotoIcon />
                </div>
                <div className="stat-change">+5% this month</div>
              </div>
              <p className="stat-title">Featured Projects</p>
              <h3 className="stat-value">{stats.featuredProjects}</h3>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <UserGroupIcon />
                </div>
                <div className="stat-change">+15% this quarter</div>
              </div>
              <p className="stat-title">Site Visitors</p>
              <h3 className="stat-value">2.4K</h3>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/admin/projects/new" className="btn btn-secondary">
                  <PlusIcon className="w-4 h-4" />
                  New Project
                </Link>
                <Link to="/admin/gallery" className="btn btn-secondary">
                  <PhotoIcon className="w-4 h-4" />
                  Manage Gallery
                </Link>
                <Link to="/admin/contacts" className="btn btn-secondary">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  View Contacts
                </Link>
                <Link to="/admin/reports" className="btn btn-secondary">
                  <DocumentTextIcon className="w-4 h-4" />
                  Generate Report
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="data-table">
            <div className="table-header">
              <h3 className="table-title">Recent Projects</h3>
              <Link to="/admin/projects" className="btn btn-secondary">
                View All
              </Link>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Category</th>
                    <th>Date Added</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map(project => (
                    <tr key={project.id}>
                      <td className="font-medium text-text-primary">{project.title}</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-industrial-orange text-white">
                          {project.category}
                        </span>
                      </td>
                      <td>{new Date(project.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-white">
                          Active
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/admin/projects/${project.id}`}
                          className="text-industrial-orange hover:text-industrial-orange-dark font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
