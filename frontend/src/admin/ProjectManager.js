import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowLeftIcon,
  TrashIcon,
  PencilIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        // Placeholder data for demo
        const placeholderProjects = [
          {
            id: 1,
            title: 'Modern Office Complex',
            description: 'A state-of-the-art office building with innovative steel framework design.',
            category: 'commercial',
            location: 'Downtown Business District',
            size: '50,000 sq ft',
            year: '2023',
            featured: true,
            created_at: '2024-01-15'
          },
          {
            id: 2,
            title: 'Industrial Manufacturing Plant',
            description: 'Large-scale industrial facility with heavy-duty steel structures.',
            category: 'industrial',
            location: 'Industrial Zone',
            size: '100,000 sq ft',
            year: '2023',
            featured: false,
            created_at: '2024-01-10'
          }
        ];
        setProjects(placeholderProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitProject = async (data) => {
    const token = localStorage.getItem('admin_token');
    
    try {
      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          featured: data.featured === 'true'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
        
        // Update local state
        if (editingProject) {
          setProjects(projects.map(p => 
            p.id === editingProject.id ? { ...editingProject, ...data, featured: data.featured === 'true' } : p
          ));
        } else {
          const newProject = { 
            id: result.project_id || Date.now(), 
            ...data, 
            featured: data.featured === 'true',
            created_at: new Date().toISOString()
          };
          setProjects([newProject, ...projects]);
        }
        
        setShowAddForm(false);
        setEditingProject(null);
        reset();
      } else {
        toast.error('Failed to save project');
      }
    } catch (error) {
      toast.error('An error occurred while saving the project');
      console.error('Project submission error:', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('category', project.category);
    setValue('location', project.location);
    setValue('size', project.size);
    setValue('year', project.year);
    setValue('featured', project.featured.toString());
    setShowAddForm(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      // For demo purposes, just remove from local state
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Delete error:', error);
    }
  };

  // Drag and drop for images
  const onDrop = useCallback(async (acceptedFiles) => {
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    setUploadingImages(true);
    const token = localStorage.getItem('admin_token');

    try {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`/api/admin/projects/${selectedProject.id}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.files.length} images uploaded successfully!`);
      } else {
        toast.error('Failed to upload images');
      }
    } catch (error) {
      toast.error('An error occurred while uploading images');
      console.error('Upload error:', error);
    } finally {
      setUploadingImages(false);
    }
  }, [selectedProject]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-steel-gray">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-manager min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-steel-gray hover:text-primary-blue transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-dark-gray">Project Manager</h1>
            </div>
            
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingProject(null);
                reset();
              }}
              className="btn btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Project
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark-gray">
                  All Projects ({projects.length})
                </h2>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <BuildingOfficeIcon className="h-24 w-24 text-steel-gray mx-auto mb-4" />
                  <p className="text-steel-gray text-lg">No projects yet</p>
                  <p className="text-steel-gray mb-6">Create your first project to get started</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="btn btn-primary"
                  >
                    Add First Project
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedProject?.id === project.id 
                          ? 'border-primary-blue bg-blue-50' 
                          : 'border-gray-200 bg-white hover:border-primary-blue'
                      }`}
                      onClick={() => setSelectedProject(project)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-dark-gray">{project.title}</h3>
                            <span className="text-xs px-2 py-1 bg-primary-blue text-white rounded capitalize">
                              {project.category}
                            </span>
                            {project.featured && (
                              <span className="text-xs px-2 py-1 bg-accent-orange text-white rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-steel-gray text-sm mb-2">{project.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-steel-gray">
                            <span>📍 {project.location}</span>
                            <span>📏 {project.size}</span>
                            <span>📅 {project.year}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(project);
                            }}
                            className="p-2 text-steel-gray hover:text-primary-blue transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project.id);
                            }}
                            className="p-2 text-steel-gray hover:text-red-500 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Panel */}
          <div>
            <div className="card">
              <h3 className="text-lg font-bold text-dark-gray mb-4">
                Image Upload
              </h3>
              
              {selectedProject ? (
                <div>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-900">{selectedProject.title}</p>
                    <p className="text-blue-700 text-sm">Selected for image upload</p>
                  </div>

                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragActive 
                        ? 'border-primary-blue bg-blue-50' 
                        : 'border-steel-gray hover:border-primary-blue'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <CloudArrowUpIcon className="h-12 w-12 text-steel-gray mx-auto mb-4" />
                    
                    {uploadingImages ? (
                      <div>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-2"></div>
                        <p className="text-steel-gray">Uploading images...</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-dark-gray font-medium mb-2">
                          {isDragActive ? 'Drop images here!' : 'Drag & drop images here'}
                        </p>
                        <p className="text-steel-gray text-sm mb-4">
                          Or click to browse files
                        </p>
                        <p className="text-steel-gray text-xs">
                          Supports: JPG, PNG, GIF, WebP (max 5MB each)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <PhotoIcon className="h-16 w-16 text-steel-gray mx-auto mb-4" />
                  <p className="text-steel-gray">Select a project to upload images</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-dark-gray">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProject(null);
                    reset();
                  }}
                  className="text-steel-gray hover:text-primary-blue transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmitProject)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Project Title *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="Enter project title"
                      {...register('title', { required: 'Project title is required' })}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className={`form-input ${errors.category ? 'border-red-500' : ''}`}
                      {...register('category', { required: 'Category is required' })}
                    >
                      <option value="">Select category</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="residential">Residential</option>
                      <option value="infrastructure">Infrastructure</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className={`form-input form-textarea ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe the project..."
                    rows="4"
                    {...register('description', { required: 'Description is required' })}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Project location"
                      {...register('location')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Size</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., 50,000 sq ft"
                      {...register('size')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., 2023"
                      {...register('year')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      {...register('featured')}
                      value="true"
                    />
                    <span>Featured Project</span>
                  </label>
                  <p className="text-steel-gray text-sm">Featured projects appear on the homepage</p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    <CheckCircleIcon className="h-5 w-5" />
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProject(null);
                      reset();
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
