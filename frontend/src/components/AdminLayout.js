import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Home Content', href: '/admin/home-content', icon: HomeIcon },
    { name: 'Projects', href: '/admin/projects', icon: BuildingOfficeIcon },
    { name: 'Gallery', href: '/admin/gallery', icon: PhotoIcon },
    { name: 'Contacts', href: '/admin/contacts', icon: ChatBubbleLeftRightIcon },
    { name: 'Reports', href: '/admin/reports', icon: DocumentTextIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">S-Steel Admin</h1>
        </div>
        
        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <div key={item.name} className="nav-item">
              <Link 
                to={item.href} 
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="mt-auto p-4 border-t border-white border-opacity-20">
          <button 
            onClick={handleLogout}
            className="nav-link w-full justify-center hover:bg-red-600"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Top Bar */}
        <div className="admin-topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              {sidebarCollapsed ? <Bars3Icon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
            </button>
            <button className="sidebar-toggle lg:hidden" onClick={toggleMobileMenu}>
              <Bars3Icon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="topbar-right">
            <Link 
              to="/" 
              className="text-text-secondary hover:text-text-primary transition-colors text-sm mr-4"
              target="_blank"
            >
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
          </div>
        </div>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
