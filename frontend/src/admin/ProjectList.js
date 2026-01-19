import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Set placeholder data
      setProjects([
        {
          id: 1,
          title: 'Modern Office Complex',
          category: 'commercial',
          status: 'active',
          featured: true,
          created_at: '2024-01-15',
          image: '/api/placeholder/300/200'
        },
        {
          id: 2,
          title: 'Industrial Plant',
          category: 'industrial',
          status: 'active',
          featured: false,
          created_at: '2024-01-10',
          image: '/api/placeholder/300/200'
        },
        {
          id: 3,
          title: 'Residential Building',
          category: 'residential',
          status: 'completed',
          featured: true,
          created_at: '2024-01-05',
          image: '/api/placeholder/300/200'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        setProjects(prev => prev.filter(project => project.id !== projectId));
        toast.success('Project deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'commercial', 'industrial', 'residential'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
        <span className="ml-3 text-text-secondary">Loading projects...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-steel-blue">Projects</h1>
            <p className="text-steel-gray">Manage your construction projects</p>
          </div>
          <Link
            to="/admin/projects/new"
            className="btn btn-primary text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add New Project
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-light">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-gray" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-white rounded-lg shadow-light overflow-hidden hover:shadow-medium transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.featured && (
                  <span className="absolute top-3 right-3 bg-industrial-orange text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-steel-blue line-clamp-2">{project.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-sm text-steel-gray mb-3 capitalize">{project.category}</p>
                <p className="text-xs text-steel-gray mb-4">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/project/${project.id}`}
                    target="_blank"
                    className="flex-1 btn btn-outline text-xs py-1"
                  >
                    <EyeIcon className="h-3 w-3" />
                    View
                  </Link>
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="flex-1 btn btn-primary text-xs py-1"
                  >
                    <PencilIcon className="h-3 w-3" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-steel-gray-light mb-4">
              <PlusIcon className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-steel-gray mb-2">No projects found</h3>
            <p className="text-steel-gray mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first project'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && (
              <Link
                to="/admin/projects/new"
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4" />
                Add Your First Project
              </Link>
            )}
          </div>
        )}
    </div>
    </>
  );
};

export default ProjectList;
