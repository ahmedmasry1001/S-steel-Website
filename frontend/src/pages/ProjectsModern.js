import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  MapPinIcon,
  SparklesIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  CheckBadgeIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 rows × 4 columns

  const categories = [
    { id: 'all', name: 'All', emoji: '🏗️' },
    { id: 'commercial', name: 'Commercial', emoji: '🏢' },
    { id: 'industrial', name: 'Industrial', emoji: '🏭' },
    { id: 'residential', name: 'Residential', emoji: '🏠' },
    { id: 'infrastructure', name: 'Infrastructure', emoji: '🌉' }
  ];

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          setFilteredProjects(data);
        } else {
          // Modern placeholder data with social media styling
          const placeholderProjects = Array.from({ length: 24 }, (_, i) => ({
            id: i + 1,
            title: `Steel Project ${i + 1}`,
            description: `Professional steel construction project ${i + 1}`,
            category: ['commercial', 'industrial', 'residential', 'infrastructure'][i % 4],
            image: '/api/placeholder/300/200',
            year: ['2021', '2022', '2023', '2024'][i % 4],
            location: `Location ${i + 1}`,
            size: `${Math.floor(Math.random() * 100) + 20},000 sq ft`,
            rating: (4.5 + Math.random() * 0.5).toFixed(1),
            reviews: Math.floor(Math.random() * 200) + 20,
            status: ['Completed', 'In Progress', 'Planning'][Math.floor(Math.random() * 3)],
            featured: Math.random() > 0.7,
            verified: Math.random() > 0.3
          }));
          setProjects(placeholderProjects);
          setFilteredProjects(placeholderProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, selectedCategory, searchTerm]);

  // Get paginated projects
  const getPaginatedProjects = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchParams(categoryId !== 'all' ? { category: categoryId } : {});
  };

  const getProjectGradient = (category) => {
    const gradients = {
      commercial: 'from-blue-500 to-purple-600',
      industrial: 'from-emerald-500 to-teal-600',
      residential: 'from-orange-500 to-red-600',
      infrastructure: 'from-violet-500 to-purple-600'
    };
    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Planning': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const ProjectCard = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
    >
      {/* Project Image Header */}
      <div className="relative h-24 overflow-hidden bg-gray-200">
        {project.main_image || project.image ? (
          <img
            src={project.main_image || project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Modern Fallback */}
        <div
          className={`w-full h-full bg-gradient-to-br ${getProjectGradient(project.category)} flex items-center justify-center text-white font-semibold text-xs`}
          style={{ display: (project.main_image || project.image) ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <div className="text-lg mb-1">{categories.find(cat => cat.id === project.category)?.emoji || '🏗️'}</div>
            <div className="text-xs opacity-90">{project.title}</div>
          </div>
        </div>

        {/* Modern Badges */}
        <div className="absolute top-2 left-2 flex space-x-1">
          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </div>
          {project.featured && (
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold">
              FEATURED
            </div>
          )}
        </div>
        
        {/* Top Right Actions */}
        <div className="absolute top-2 right-2 flex space-x-1">
          {project.verified && (
            <CheckBadgeIcon className="h-4 w-4 text-white drop-shadow-md" />
          )}
          <HeartIcon className="h-4 w-4 text-white/70 hover:text-white transition-colors cursor-pointer drop-shadow-md" />
        </div>
      </div>

      {/* Modern Content */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <ShareIcon className="h-3 w-3 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
        </div>
        
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">
          {project.description}
        </p>
        
        {/* Rating and Reviews */}
        {project.rating && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-700">{project.rating}</span>
            </div>
            <span className="text-xs text-gray-500">({project.reviews} reviews)</span>
          </div>
        )}
        
        {/* Project Details */}
        <div className="space-y-1 mb-3 text-xs text-gray-600">
          {project.location && (
            <div className="flex items-center">
              <MapPinIcon className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          )}
          {project.size && (
            <div className="flex items-center">
              <span className="text-blue-500 mr-1">📏</span>
              <span className="truncate">{project.size}</span>
            </div>
          )}
          {project.year && (
            <div className="flex items-center">
              <span className="text-blue-500 mr-1">📅</span>
              <span className="truncate">{project.year}</span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <Link
          to={`/projects/${project.id}`}
          className={`inline-flex items-center justify-center w-full px-3 py-2 bg-gradient-to-r ${getProjectGradient(project.category)} text-white rounded-xl text-xs font-medium hover:shadow-lg transition-all duration-200`}
        >
          <span>View Project</span>
          <ArrowRightIcon className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600">Loading amazing projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Modern Header */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-2xl p-6 border border-gray-100 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🏗️</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Our Steel Projects
            </h1>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 max-w-2xl">
            Explore our portfolio of premium steel construction projects. From commercial buildings to industrial facilities.
          </p>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Start Project</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm shadow-md border border-gray-200 transition-all duration-200 flex items-center space-x-2"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Virtual Tour</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {filteredProjects.length} projects found
          {selectedCategory !== 'all' && (
            <span className="text-blue-600 ml-1">
              in {categories.find(cat => cat.id === selectedCategory)?.name}
            </span>
          )}
        </span>
        <span className="text-gray-500">
          Page {currentPage} of {Math.ceil(filteredProjects.length / itemsPerPage)}
        </span>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or browse all projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 h-full">
            {getPaginatedProjects().map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Modern Pagination */}
      {filteredProjects.length > itemsPerPage && (
        <div className="flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredProjects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            className="scale-90"
          />
        </div>
      )}
    </div>
  );
};

export default Projects;
