import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'residential', name: 'Residential' },
    { id: 'infrastructure', name: 'Infrastructure' }
  ];

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          setFilteredProjects(data);
        } else {
          // Placeholder data for demo
          const placeholderProjects = [
            {
              id: 1,
              title: 'Modern Office Complex',
              description: 'A state-of-the-art office building with innovative steel framework design supporting multiple floors and open spaces.',
              category: 'commercial',
              image: '/api/placeholder/500/300',
              year: '2023',
              location: 'Downtown Business District',
              size: '50,000 sq ft'
            },
            {
              id: 2,
              title: 'Industrial Manufacturing Plant',
              description: 'Large-scale industrial facility with heavy-duty steel structures designed for manufacturing operations.',
              category: 'industrial',
              image: '/api/placeholder/500/300',
              year: '2023',
              location: 'Industrial Zone',
              size: '100,000 sq ft'
            },
            {
              id: 3,
              title: 'Bridge Infrastructure Project',
              description: 'Steel bridge construction providing crucial infrastructure connectivity with advanced engineering solutions.',
              category: 'infrastructure',
              image: '/api/placeholder/500/300',
              year: '2022',
              location: 'Highway Corridor',
              size: '800 ft span'
            },
            {
              id: 4,
              title: 'Residential Steel Frame Complex',
              description: 'Modern residential development utilizing steel frame construction for durability and design flexibility.',
              category: 'residential',
              image: '/api/placeholder/500/300',
              year: '2023',
              location: 'Suburban Area',
              size: '200 units'
            },
            {
              id: 5,
              title: 'Warehouse Distribution Center',
              description: 'Expansive warehouse facility with optimized steel structure design for logistics and distribution operations.',
              category: 'industrial',
              image: '/api/placeholder/500/300',
              year: '2022',
              location: 'Logistics Hub',
              size: '150,000 sq ft'
            },
            {
              id: 6,
              title: 'Shopping Mall Steel Framework',
              description: 'Multi-level retail complex featuring sophisticated steel construction supporting large open spaces.',
              category: 'commercial',
              image: '/api/placeholder/500/300',
              year: '2023',
              location: 'City Center',
              size: '300,000 sq ft'
            }
          ];
          setProjects(placeholderProjects);
          setFilteredProjects(placeholderProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Use placeholder data on error
        const placeholderProjects = [
          {
            id: 1,
            title: 'Modern Office Complex',
            description: 'A state-of-the-art office building with innovative steel framework design.',
            category: 'commercial',
            image: '/api/placeholder/500/300',
            year: '2023',
            location: 'Downtown Business District',
            size: '50,000 sq ft'
          }
        ];
        setProjects(placeholderProjects);
        setFilteredProjects(placeholderProjects);
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
  }, [projects, selectedCategory, searchTerm]);

  const ProjectCard = ({ project, index }) => (
    <motion.div
      className="card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <div className="w-full h-64 bg-gradient-to-br from-steel-gray to-dark-gray flex items-center justify-center">
          <span className="text-white text-lg font-semibold">Steel Project</span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded capitalize">
            {project.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-primary-blue opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/projects/${project.id}`}
            className="bg-white text-primary-blue px-6 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-dark-gray group-hover:text-primary-blue transition-colors">
          {project.title}
        </h3>
        <p className="text-steel-gray line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-steel-gray">
          <span>{project.location}</span>
          <span>{project.year}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-blue">
            {project.size}
          </span>
          <Link
            to={`/projects/${project.id}`}
            className="text-primary-blue hover:text-secondary-blue transition-colors inline-flex items-center"
          >
            Learn More
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const ProjectListItem = ({ project, index }) => (
    <motion.div
      className="card flex flex-col md:flex-row gap-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="w-full md:w-80 h-48 bg-gradient-to-br from-steel-gray to-dark-gray rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-white text-lg font-semibold">Steel Project</span>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded capitalize">
              {project.category}
            </span>
            <h3 className="text-2xl font-semibold text-dark-gray mt-2">
              {project.title}
            </h3>
          </div>
          <span className="text-sm text-steel-gray">{project.year}</span>
        </div>
        
        <p className="text-steel-gray">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-steel-gray">
            <span>📍 {project.location}</span>
            <span>📏 {project.size}</span>
          </div>
          <Link
            to={`/projects/${project.id}`}
            className="btn btn-outline"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="projects-page">
      {/* Header */}
      <section className="bg-gradient-to-r from-dark-gray to-steel-gray text-white py-16">
        <div className="container">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              Our Steel Construction Projects
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Explore our portfolio of successful steel construction projects across 
              commercial, industrial, and infrastructure sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="section">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-steel-gray" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-steel-gray" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-input"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-light-gray rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-blue text-white' 
                    : 'text-steel-gray hover:text-primary-blue'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-blue text-white' 
                    : 'text-steel-gray hover:text-primary-blue'
                }`}
              >
                <ViewColumnsIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-steel-gray">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>

          {/* Projects Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="card loading">
                  <div className="bg-gray-200 h-64 rounded mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => 
                  viewMode === 'grid' ? (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ) : (
                    <ProjectListItem key={project.id} project={project} index={index} />
                  )
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-steel-gray text-lg">No projects found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="btn btn-primary mt-4"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-dark">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Steel Project?
          </h2>
          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss your steel construction needs and create something extraordinary together.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Projects;
