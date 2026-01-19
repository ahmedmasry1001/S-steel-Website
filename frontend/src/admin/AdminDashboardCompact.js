import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PhotoIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    newContacts: 0,
    featuredProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        setRecentProjects(projects.slice(0, 3));
        setStats(prev => ({
          ...prev,
          totalProjects: projects.length,
          featuredProjects: projects.filter(p => p.featured).length
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set placeholder data
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

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Upload a new steel construction project',
      icon: PlusIcon,
      link: '/admin/projects/new',
      color: 'from-industrial-orange to-industrial-orange-light'
    },
    {
      title: 'Manage Home Content',
      description: 'Update home page photos and description',
      icon: PhotoIcon,
      link: '/admin/home-content',
      color: 'from-steel-blue to-industrial-orange'
    },
    {
      title: 'View Contacts',
      description: 'Check new contact submissions',
      icon: ChatBubbleLeftRightIcon,
      link: '/admin/contacts',
      color: 'from-success to-info'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
        <span className="ml-3 text-text-secondary">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-steel-blue">Dashboard Overview</h1>
          <p className="text-steel-gray">Welcome back, manage your S-Steel Construction website</p>
        </div>

        {/* Stats Grid - Smaller Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="bg-white p-4 rounded-lg shadow-light border-l-4 border-industrial-orange"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-steel-gray uppercase tracking-wide">Total Projects</p>
                <p className="text-2xl font-bold text-steel-blue">{stats.totalProjects}</p>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-industrial-orange" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow-light border-l-4 border-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-steel-gray uppercase tracking-wide">New Contacts</p>
                <p className="text-2xl font-bold text-steel-blue">{stats.newContacts}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-success" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow-light border-l-4 border-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-steel-gray uppercase tracking-wide">Featured Projects</p>
                <p className="text-2xl font-bold text-steel-blue">{stats.featuredProjects}</p>
              </div>
              <PhotoIcon className="h-8 w-8 text-info" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions - Smaller Cards */}
        <div>
          <h2 className="text-lg font-semibold text-steel-blue mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className={`block p-4 bg-gradient-to-br ${action.color} rounded-lg shadow-light hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 group`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{action.title}</h3>
                      <p className="text-white text-opacity-90 text-sm">{action.description}</p>
                    </div>
                    <action.icon className="h-6 w-6 text-white ml-3 group-hover:scale-110 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Projects - Compact */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-steel-blue">Recent Projects</h2>
            <Link 
              to="/admin/projects" 
              className="text-industrial-orange hover:text-industrial-orange-dark text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-light overflow-hidden">
            <div className="divide-y divide-gray-200">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-steel-blue">{project.title}</h3>
                        <p className="text-sm text-steel-gray capitalize">{project.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-steel-gray">
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                        <Link 
                          to={`/admin/projects/${project.id}/edit`}
                          className="text-xs text-industrial-orange hover:text-industrial-orange-dark"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-steel-gray">
                  <p>No recent projects</p>
                  <Link to="/admin/projects/new" className="text-industrial-orange hover:text-industrial-orange-dark text-sm">
                    Add your first project →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
    </>
  );
};

export default AdminDashboard;
