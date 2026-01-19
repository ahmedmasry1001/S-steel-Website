import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboardCompact from './admin/AdminDashboardCompact';
import ProjectManager from './admin/ProjectManager';
import ProjectList from './admin/ProjectList';
import ContactList from './admin/ContactList';
import HomeContentManager from './admin/HomeContentManager';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes with New MainLayout (4-container design) */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
        <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
        <Route path="/projects/:id" element={<MainLayout><ProjectDetail /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        
        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardCompact /></AdminLayout>} />
        <Route path="/admin/home-content" element={<AdminLayout><HomeContentManager /></AdminLayout>} />
        <Route path="/admin/projects" element={<AdminLayout><ProjectManager /></AdminLayout>} />
        <Route path="/admin/projects/new" element={<AdminLayout><ProjectManager /></AdminLayout>} />
        <Route path="/admin/projects/:id/edit" element={<AdminLayout><ProjectManager /></AdminLayout>} />
        <Route path="/admin/contacts" element={<AdminLayout><ContactList /></AdminLayout>} />
        <Route path="/admin/gallery" element={<AdminLayout><ProjectList /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><AdminDashboardCompact /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminDashboardCompact /></AdminLayout>} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
