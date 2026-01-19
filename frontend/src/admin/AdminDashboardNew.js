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

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">S-Steel Admin</h1>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-item">
            <Link to="/admin/dashboard" className="nav-link active">
              <ChartBarIcon />
              <span>Dashboard</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/admin/projects" className="nav-link">
              <BuildingOfficeIcon />
              <span>Projects</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/admin/gallery" className="nav-link">
              <PhotoIcon />
              <span>Gallery</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/admin/contacts" className="nav-link">
              <ChatBubbleLeftRightIcon />
              <span>Contacts</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/admin/reports" className="nav-link">
              <DocumentTextIcon />
              <span>Reports</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/admin/settings" className="nav-link">
              <CogIcon />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Top Bar */}
        <div className="admin-topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {sidebarCollapsed ? <Bars3Icon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
            </button>
            <button className="sidebar-toggle md:hidden" onClick={toggleMobileMenu}>
              <Bars3Icon className="w-5 h-5" />
            </button>
            <h1 className="topbar-title">Dashboard</h1>
          </div>
          
          <div className="topbar-right">
            <Link to="/" className="text-text-secondary hover:text-text-primary transition-colors">
              View Site
            </Link>
            <div className="user-menu">
              <div className="user-avatar">
                {localStorage.getItem('admin_user')?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-text-primary">
                {localStorage.getItem('admin_user') || 'Admin'}
              </span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <ArrowRightOnRectangleIcon />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="admin-content">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-text-secondary">Loading dashboard...</div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-title">Total Projects</div>
                    <BuildingOfficeIcon className="stat-icon" />
                  </div>
                  <div className="stat-value">{stats.totalProjects}</div>
                  <div className="stat-change positive">+12% from last month</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-title">New Contacts</div>
                    <UserGroupIcon className="stat-icon" />
                  </div>
                  <div className="stat-value">{stats.newContacts}</div>
                  <div className="stat-change positive">+8% from last month</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-title">Featured Projects</div>
                    <PhotoIcon className="stat-icon" />
                  </div>
                  <div className="stat-value">{stats.featuredProjects}</div>
                  <div className="stat-change positive">+5% from last month</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <Link to="/admin/projects" className="action-btn">
                  <PlusIcon />
                  Add New Project
                </Link>
                <Link to="/admin/projects" className="action-btn action-btn-secondary">
                  <PhotoIcon />
                  Manage Gallery
                </Link>
                <Link to="/admin/contacts" className="action-btn action-btn-secondary">
                  <ChatBubbleLeftRightIcon />
                  View Contacts
                </Link>
              </div>

              {/* Recent Projects */}
              <div className="data-table">
                <div className="table-header">
                  <h3 className="table-title">Recent Projects</h3>
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
