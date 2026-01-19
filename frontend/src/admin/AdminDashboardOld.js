import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PhotoIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    newContacts: 0,
    featuredProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    const token = localStorage.getItem('admin_token');
    
    try {
      // Fetch projects
      const projectsResponse = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (projectsResponse.ok) {
        const projects = await projectsResponse.json();
        setRecentProjects(projects.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalProjects: projects.length,
          featuredProjects: projects.filter(p => p.featured).length
        }));
      }

      // Fetch contacts
      const contactsResponse = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (contactsResponse.ok) {
        const contacts = await contactsResponse.json();
        setRecentContacts(contacts.slice(0, 5));
        setStats(prev => ({
          ...prev,
          newContacts: contacts.filter(c => c.status === 'new').length
        }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set placeholder data for demo
      setRecentProjects([
        { id: 1, title: 'Modern Office Complex', category: 'commercial', created_at: '2024-01-15' },
        { id: 2, title: 'Industrial Plant', category: 'industrial', created_at: '2024-01-10' }
      ]);
      setStats({
        totalProjects: 12,
        newContacts: 5,
        featuredProjects: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Upload a new steel construction project',
      icon: PlusIcon,
      link: '/admin/projects',
      color: 'bg-primary-blue'
    },
    {
      title: 'Manage Gallery',
      description: 'Add or update project images',
      icon: PhotoIcon,
      link: '/admin/projects',
      color: 'bg-secondary-blue'
    },
    {
      title: 'View Contacts',
      description: 'Check new contact submissions',
      icon: ChatBubbleLeftRightIcon,
      link: '/admin/contacts',
      color: 'bg-success'
    },
    {
      title: 'Website Settings',
      description: 'Update site configuration',
      icon: UserGroupIcon,
      link: '/admin/settings',
      color: 'bg-accent-orange'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-steel-gray">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark-gray">Admin Dashboard</h1>
                <p className="text-steel-gray">Welcome back, {localStorage.getItem('admin_user')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-steel-gray hover:text-primary-blue transition-colors">
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline text-sm"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-dark-gray">{stats.totalProjects}</p>
                <p className="text-steel-gray">Total Projects</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-dark-gray">{stats.newContacts}</p>
                <p className="text-steel-gray">New Contacts</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent-orange rounded-full flex items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-dark-gray">{stats.featuredProjects}</p>
                <p className="text-steel-gray">Featured Projects</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-dark-gray mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.link}
                className="card group hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-dark-gray mb-2">{action.title}</h3>
                <p className="text-steel-gray text-sm mb-3">{action.description}</p>
                <ArrowRightIcon className="h-4 w-4 text-primary-blue group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-dark-gray">Recent Projects</h2>
              <Link 
                to="/admin/projects" 
                className="text-primary-blue hover:text-secondary-blue transition-colors text-sm"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                    <div>
                      <h3 className="font-medium text-dark-gray">{project.title}</h3>
                      <p className="text-steel-gray text-sm capitalize">{project.category}</p>
                    </div>
                    <span className="text-steel-gray text-xs">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-steel-gray text-center py-8">No recent projects</p>
              )}
            </div>
          </motion.div>

          {/* Recent Contacts */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-dark-gray">Recent Contacts</h2>
              <Link 
                to="/admin/contacts" 
                className="text-primary-blue hover:text-secondary-blue transition-colors text-sm"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                    <div>
                      <h3 className="font-medium text-dark-gray">{contact.name}</h3>
                      <p className="text-steel-gray text-sm">{contact.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        contact.status === 'new' 
                          ? 'bg-success text-white' 
                          : 'bg-steel-gray text-white'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-steel-gray text-center py-8">No recent contacts</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
