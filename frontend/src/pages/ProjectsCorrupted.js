import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOffice2Icon
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
    { id: 'all', name: 'All', icon: '🏗️' },
    { id: 'commercial', name: 'Commercial', icon: '🏢' },
    { id: 'industrial', name: 'Industrial', icon: '🏭' },
    { id: 'residential', name: 'Residential', icon: '🏠' },
    { id: 'infrastructure', name: 'Infrastructure', icon: '🌉' }
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
          // Compact placeholder data
          const placeholderProjects = Array.from({ length: 24 }, (_, i) => ({
            id: i + 1,
            title: `Steel Project ${i + 1}`,
            description: `Professional steel construction project ${i + 1}`,
            category: ['commercial', 'industrial', 'residential', 'infrastructure'][i % 4],
            image: '/api/placeholder/300/200',
            year: ['2021', '2022', '2023', '2024'][i % 4],
            location: `Location ${i + 1}`,
            size: `${Math.floor(Math.random() * 100) + 20},000 sq ft`
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

  const ProjectCard = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group overflow-hidden"
    >
      {/* Project Image */}
      <div className="relative h-24 overflow-hidden bg-gray-200">
        {project.main_image || project.image ? (
          <img
            src={project.main_image || project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="w-full h-full bg-gradient-to-br from-steel-blue to-steel-blue-light flex items-center justify-center text-white font-semibold text-xs"
          style={{ display: (project.main_image || project.image) ? 'none' : 'flex' }}
        >
          <BuildingOffice2Icon className="h-6 w-6 mb-1" />
          <span className="sr-only">{project.title}</span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-1 left-1">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-industrial-orange text-white">
            {categories.find(cat => cat.id === project.category)?.icon}
          </span>
        </div>
        
        {/* Year Badge */}
        <div className="absolute top-1 right-1">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-steel-blue">
            {project.year}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-steel-blue mb-1 truncate group-hover:text-industrial-orange transition-colors">
          {project.title}
        </h3>
        
        <p className="text-steel-gray text-xs mb-2 line-clamp-2">
          {project.description}
        </p>
        
        {/* Project Details */}
        <div className="space-y-1 mb-3 text-xs text-steel-gray">
          {project.location && (
            <div className="flex items-center truncate">
              <MapPinIcon className="h-3 w-3 mr-1 text-industrial-orange flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          )}
          {project.size && (
            <div className="flex items-center truncate">
              <BuildingOffice2Icon className="h-3 w-3 mr-1 text-industrial-orange flex-shrink-0" />
              <span className="truncate">{project.size}</span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center justify-center w-full px-3 py-2 bg-steel-blue text-white rounded text-xs font-medium hover:bg-steel-blue-dark transition-colors"
        >
          <span>View Details</span>
          <ArrowRightIcon className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-steel-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-steel-blue to-industrial-orange rounded-lg p-4 text-white">
        <h1 className="text-xl font-bold mb-1">Our Steel Construction Projects</h1>
        <p className="text-sm opacity-90">Excellence in steel construction across all sectors</p>
      </div>

      {/* Compact Search and Filter */}
      <div className="flex gap-3">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-gray" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-industrial-orange focus:border-transparent outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-industrial-orange text-white'
                  : 'bg-white text-steel-gray hover:bg-gray-100'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-steel-gray">
          {filteredProjects.length} projects found
          {selectedCategory !== 'all' && (
            <span className="text-industrial-orange ml-1">
              in {categories.find(cat => cat.id === selectedCategory)?.name}
            </span>
          )}
        </span>
        <span className="text-steel-gray">
          Page {currentPage} of {Math.ceil(filteredProjects.length / itemsPerPage)}
        </span>
      </div>

      {/* Projects Grid - Compact 3×4 layout */}
      <div className="flex-1 overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BuildingOffice2Icon className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-steel-gray mb-2">No projects found</h3>
            <p className="text-steel-gray">Try adjusting your search or browse all projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 h-full">
            {getPaginatedProjects().map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Compact Pagination */}
      {filteredProjects.length > itemsPerPage && (
        <div className="flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredProjects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            className="scale-75"
          />
        </div>
      )}
    </div>
  );
};

export default Projects;
            {
              id: 1,
              title: 'Modern Office Complex',
              description: 'A state-of-the-art office building with innovative steel framework design supporting multiple floors and open spaces.',
              category: 'commercial',
              image: '/api/placeholder/400/300',
              main_image: '/api/placeholder/400/300',
              year: '2023',
              location: 'Downtown Business District',
              size: '50,000 sq ft'
            },
            {
              id: 2,
              title: 'Industrial Manufacturing Plant',
              description: 'Large-scale industrial facility with heavy-duty steel structures designed for manufacturing operations.',
              category: 'industrial',
              image: '/api/placeholder/400/300',
              main_image: '/api/placeholder/400/300',
              year: '2023',
              location: 'Industrial Zone',
              size: '100,000 sq ft'
            },
            {
              id: 3,
              title: 'Bridge Infrastructure Project',
              description: 'Steel bridge construction providing crucial infrastructure connectivity with advanced engineering solutions.',
              category: 'infrastructure',
              image: '/api/placeholder/400/300',
              main_image: '/api/placeholder/400/300',
              year: '2022',
              location: 'Highway Corridor',
              size: '800 ft span'
            },
            {
              id: 4,
              title: 'Residential Steel Frame Complex',
              description: 'Modern residential development utilizing steel frame construction for durability and design flexibility.',
              category: 'residential',
              image: '/api/placeholder/400/300',
              main_image: '/api/placeholder/400/300',
              year: '2023',
              location: 'Suburban Area',
              size: '200 units'
            },
            {
              id: 5,
              title: 'Warehouse Distribution Center',
              description: 'Expansive warehouse facility with optimized steel structure design for logistics and distribution operations.',
              category: 'industrial',
              image: '/api/placeholder/400/300',
              main_image: '/api/placeholder/400/300',
              year: '2022',
              location: 'Logistics Hub',
              size: '150,000 sq ft'
            },
            {
              id: 6,
              title: 'Shopping Mall Steel Framework',
              description: 'Multi-level retail complex featuring sophisticated steel construction supporting large open spaces.',
              category: 'commercial',
              image: '/api/placeholder/400/300',
              main_image: '/api/placeholder/400/300',
              year: '2023',
              location: 'City Center',
              size: '300,000 sq ft'
            },
            // Additional projects to test pagination
            ...Array.from({ length: 18 }, (_, i) => ({
              id: i + 7,
              title: `Steel Project ${i + 7}`,
              description: `Professional steel construction project showcasing our expertise in ${['commercial', 'industrial', 'residential', 'infrastructure'][i % 4]} applications.`,
              category: ['commercial', 'industrial', 'residential', 'infrastructure'][i % 4],
              image: '/api/placeholder/400/300',
              main_image: '/api/placeholder/400/300',
              year: ['2021', '2022', '2023'][i % 3],
              location: `Project Site ${i + 7}`,
              size: `${Math.floor(Math.random() * 100) + 20},000 sq ft`
            }))
          ];
          setProjects(placeholderProjects);
          setFilteredProjects(placeholderProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on category and search
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
    setCurrentPage(1); // Reset to first page when filtering
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

  const ProjectCard = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
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
        <div
          className="w-full h-full bg-gradient-to-br from-steel-blue to-steel-blue-light flex items-center justify-center text-white font-semibold text-lg"
          style={{ display: (project.main_image || project.image) ? 'none' : 'flex' }}
        >
          <BuildingOffice2Icon className="h-12 w-12 mb-2" />
          <span className="sr-only">{project.title}</span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-industrial-orange text-white shadow-lg">
            {categories.find(cat => cat.id === project.category)?.icon} {' '}
            {categories.find(cat => cat.id === project.category)?.name}
          </span>
        </div>
        
        {/* Year Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white text-steel-blue shadow-lg">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {project.year}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-steel-blue mb-2 group-hover:text-industrial-orange transition-colors">
          {project.title}
        </h3>
        
        <p className="text-steel-gray text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        {/* Project Details */}
        <div className="space-y-2 mb-4 text-sm text-steel-gray">
          {project.location && (
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-2 text-industrial-orange" />
              <span>{project.location}</span>
            </div>
          )}
          {project.size && (
            <div className="flex items-center">
              <BuildingOffice2Icon className="h-4 w-4 mr-2 text-industrial-orange" />
              <span>{project.size}</span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-steel-blue to-steel-blue-light text-white rounded-lg hover:from-steel-blue-dark hover:to-steel-blue transition-all duration-200 group-hover:shadow-lg"
        >
          <span className="font-medium">View Details</span>
          <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-steel-blue border-t-transparent"></div>
          <p className="text-steel-gray">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-steel-blue to-steel-blue-light rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Our Steel Construction Projects</h1>
        <p className="text-steel-blue-light opacity-90">
          Showcasing excellence in steel construction across commercial, industrial, residential, and infrastructure sectors.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-gray" />
          <input
            type="text"
            placeholder="Search projects by name, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-industrial-orange text-white shadow-lg'
                  : 'bg-gray-100 text-steel-gray hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 ${viewMode === 'grid' ? 'bg-industrial-orange text-white' : 'bg-white text-steel-gray hover:bg-gray-50'}`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 ${viewMode === 'list' ? 'bg-industrial-orange text-white' : 'bg-white text-steel-gray hover:bg-gray-50'}`}
          >
            <ViewColumnsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-steel-gray">
          Found <span className="font-semibold text-steel-blue">{filteredProjects.length}</span> projects
          {selectedCategory !== 'all' && (
            <>
              {' '}in <span className="font-semibold text-industrial-orange">
                {categories.find(cat => cat.id === selectedCategory)?.name}
              </span>
            </>
          )}
        </p>
        <p className="text-steel-gray text-sm">
          Page {currentPage} of {Math.ceil(filteredProjects.length / itemsPerPage)}
        </p>
      </div>

      {/* Projects Grid (3 rows × 4 columns = 12 items max) */}
      <div className="flex-1">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <BuildingOffice2Icon className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-steel-gray mb-2">No projects found</h3>
            <p className="text-steel-gray">Try adjusting your search criteria or browse all projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
            {getPaginatedProjects().map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredProjects.length > itemsPerPage && (
        <div className="flex justify-center pt-4">
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredProjects.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Projects;
