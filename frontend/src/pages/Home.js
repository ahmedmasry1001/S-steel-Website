import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  SparklesIcon,
  PlayIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modern 3D stats with Instagram-style design
  const stats = [
    { 
      label: 'Projects Delivered', 
      value: '500+', 
      emoji: '🏗️',
      gradient: 'from-blue-500 to-purple-600',
      shadow: 'shadow-blue-500/25'
    },
    { 
      label: 'Years Experience', 
      value: '25+', 
      emoji: '⏰',
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/25'
    },
    { 
      label: 'Happy Clients', 
      value: '200+', 
      emoji: '👥',
      gradient: 'from-orange-500 to-red-600',
      shadow: 'shadow-orange-500/25'
    },
    { 
      label: 'Safety Rating', 
      value: '100%', 
      emoji: '🛡️',
      gradient: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/25'
    }
  ];

  // Fetch featured projects (limit to 8 for 2 rows)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?featured=true');
        if (response.ok) {
          const data = await response.json();
          setProjects(data.slice(0, 8)); // Only 8 for compact display
        } else {
          // Compact placeholder projects
          setProjects([
            { id: 1, title: 'Office Complex', category: 'commercial', image: '/api/placeholder/300/200' },
            { id: 2, title: 'Industrial Plant', category: 'industrial', image: '/api/placeholder/300/200' },
            { id: 3, title: 'Bridge Project', category: 'infrastructure', image: '/api/placeholder/300/200' },
            { id: 4, title: 'Residential Complex', category: 'residential', image: '/api/placeholder/300/200' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const ProjectCard = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
    >
      {/* Modern Image Container */}
      <div className="relative h-24 bg-gradient-to-br from-gray-50 to-gray-100">
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
        
        {/* Fallback with modern gradient */}
        <div
          className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm"
          style={{ display: (project.main_image || project.image) ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <div className="text-lg mb-1">🏗️</div>
            <div className="text-xs opacity-90">{project.title}</div>
          </div>
        </div>

        {/* Modern Category Badge */}
        <div className="absolute top-2 left-2">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium text-gray-700">
            {project.category}
          </div>
        </div>

        {/* Like Button */}
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <HeartIcon className="h-3 w-3 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
          </div>
        </div>
      </div>

      {/* Modern Content */}
      <div className="p-3">
        <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{project.title}</h4>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <div className="text-xs text-gray-500">Steel Construction</div>
          </div>
          <div className="text-xs text-gray-400">•••</div>
        </div>
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
      {/* Modern Hero Section - Instagram/Facebook Style */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-2xl p-6 border border-gray-100 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🏗️</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Professional Steel Services
              </h1>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 max-w-2xl">
            Book premium steel construction services with industry-leading expertise. 
            Trusted by 500+ clients worldwide.
          </p>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Book Service</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm shadow-md border border-gray-200 transition-all duration-200 flex items-center space-x-2"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Watch Demo</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Instagram-Style Stats Cards */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl p-4 border border-gray-100 ${stat.shadow} shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-lg">{stat.emoji}</span>
                </div>
                <HeartIcon className="h-4 w-4 text-gray-300 group-hover:text-red-400 transition-colors duration-200" />
              </div>
              
              <div className="text-xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              
              <div className="text-xs text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modern Featured Projects - Social Media Style */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🎯</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Featured Projects</h2>
          </div>
          <Link
            to="/projects"
            className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <span>View All</span>
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {projects.length > 0 ? (
            <div className="grid grid-cols-4 gap-3 h-full">
              {projects.slice(0, 8).map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center border border-gray-100 h-full flex items-center justify-center">
              <div>
                <span className="text-4xl mb-2 block">🏗️</span>
                <p className="text-steel-gray">No projects available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compact Call to Action */}
      <div className="bg-gradient-to-r from-industrial-orange to-industrial-orange-dark rounded-lg p-4 text-center text-white">
        <h3 className="font-bold mb-2">Ready to Start Your Project?</h3>
        <div className="flex gap-3 justify-center">
          <Link
            to="/contact"
            className="bg-white text-industrial-orange px-4 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <span className="mr-1">📞</span>
            Contact Us
          </Link>
          <Link
            to="/services"
            className="border border-white text-white px-4 py-2 rounded text-sm font-semibold hover:bg-white hover:text-industrial-orange transition-colors"
          >
            Our Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
