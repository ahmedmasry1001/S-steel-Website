import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  PhotoIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const HomeContentManager = () => {
  const [homeData, setHomeData] = useState({
    heroImages: [],
    companyDescription: '',
    stats: {
      yearsExperience: 15,
      projectsCompleted: 500,
      teamMembers: 50,
      clientSatisfaction: 99
    }
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const response = await fetch('/api/admin/home-content', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHomeData(data);
        setNewDescription(data.companyDescription || '');
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Set default data
      setHomeData({
        heroImages: [
          { id: 1, url: '/api/placeholder/800/600', alt: 'Steel Construction Project 1' },
          { id: 2, url: '/api/placeholder/800/600', alt: 'Steel Construction Project 2' }
        ],
        companyDescription: 'S-Steel Construction has been a leading provider of steel construction services for over 15 years. We specialize in commercial, industrial, and residential steel structures.',
        stats: {
          yearsExperience: 15,
          projectsCompleted: 500,
          teamMembers: 50,
          clientSatisfaction: 99
        }
      });
      setNewDescription('S-Steel Construction has been a leading provider of steel construction services for over 15 years. We specialize in commercial, industrial, and residential steel structures.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    console.log('Selected files:', files.length, files);
    
    if (files.length === 0) {
      console.log('No files selected');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    files.forEach((file, index) => {
      console.log(`Adding file ${index}:`, file.name, file.size, file.type);
      formData.append('images', file);
    });

    console.log('FormData created, sending request...');

    try {
      const response = await fetch('/api/admin/home-content/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData
      });

      console.log('Response received:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        const newImages = result.images || []; // Handle array response
        setHomeData(prev => ({
          ...prev,
          heroImages: [...prev.heroImages, ...newImages]
        }));
        toast.success(result.message || 'Images uploaded successfully');
        fetchHomeData(); // Refresh data to get updated hero images
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        toast.error(error.error || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error uploading images');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await fetch(`/api/admin/home-content/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });

      if (response.ok) {
        setHomeData(prev => ({
          ...prev,
          heroImages: prev.heroImages.filter(img => img.id !== imageId)
        }));
        toast.success('Image deleted successfully');
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image');
    }
  };

  const handleUpdateDescription = async () => {
    try {
      const response = await fetch('/api/admin/home-content/description', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ description: newDescription })
      });

      if (response.ok) {
        setHomeData(prev => ({
          ...prev,
          companyDescription: newDescription
        }));
        setEditingDescription(false);
        toast.success('Company description updated successfully');
      } else {
        toast.error('Failed to update description');
      }
    } catch (error) {
      console.error('Error updating description:', error);
      toast.error('Error updating description');
    }
  };

  const handleUpdateStats = async (newStats) => {
    try {
      const response = await fetch('/api/admin/home-content/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ stats: newStats })
      });

      if (response.ok) {
        setHomeData(prev => ({
          ...prev,
          stats: newStats
        }));
        toast.success('Statistics updated successfully');
      } else {
        toast.error('Failed to update statistics');
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      toast.error('Error updating statistics');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
        <span className="ml-3 text-text-secondary">Loading home content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-steel-blue">Home Page Content</h1>
          <p className="text-steel-gray">Manage hero images, company description, and statistics</p>
        </div>

        {/* Hero Images Section */}
        <div className="bg-white p-6 rounded-lg shadow-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-steel-blue">Hero Images</h2>
            <div className="relative">
              <input
                type="file"
                id="hero-images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="hero-images"
                className={`btn btn-primary text-sm ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {uploading ? (
                  <>
                    <div className="spinner w-4 h-4 border-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    Add Images
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeData.heroImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
                  {image.alt}
                </div>
              </motion.div>
            ))}
            
            {homeData.heroImages.length === 0 && (
              <div className="col-span-full text-center py-12 text-steel-gray">
                <PhotoIcon className="h-12 w-12 mx-auto mb-3 text-steel-gray-light" />
                <p>No hero images uploaded yet</p>
                <p className="text-sm">Click "Add Images" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Company Description Section */}
        <div className="bg-white p-6 rounded-lg shadow-light">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-steel-blue">Company Description</h2>
            <button
              onClick={() => setEditingDescription(!editingDescription)}
              className="btn btn-secondary text-sm"
            >
              <PencilIcon className="h-4 w-4" />
              {editingDescription ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingDescription ? (
            <div className="space-y-4">
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent"
                placeholder="Enter company description..."
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateDescription}
                  className="btn btn-primary text-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditingDescription(false);
                    setNewDescription(homeData.companyDescription);
                  }}
                  className="btn btn-outline text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-steel-gray leading-relaxed">
                {homeData.companyDescription || 'No description added yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="bg-white p-6 rounded-lg shadow-light">
          <h2 className="text-lg font-semibold text-steel-blue mb-4">Company Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(homeData.stats).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-steel-gray mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const newStats = { ...homeData.stats, [key]: parseInt(e.target.value) || 0 };
                    handleUpdateStats(newStats);
                  }}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-industrial-orange focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default HomeContentManager;
