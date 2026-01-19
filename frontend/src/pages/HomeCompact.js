import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compact stats for no-scroll design
  const stats = [
    { label: 'Projects', value: '500+', icon: BuildingOffice2Icon },
    { label: 'Years', value: '25+', icon: ClockIcon },
    { label: 'Clients', value: '200+', icon: UsersIcon },
    { label: 'Safety', value: '100%', icon: ShieldCheckIcon }
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
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group"
    >
      <div className="relative h-24 bg-gray-200">
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
          className="w-full h-full bg-gradient-to-br from-steel-blue to-industrial-orange flex items-center justify-center text-white font-semibold text-sm"
          style={{ display: (project.main_image || project.image) ? 'none' : 'flex' }}
        >
          {project.title}
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-steel-blue text-sm mb-1">{project.title}</h4>
        <span className="text-xs text-industrial-orange capitalize">{project.category}</span>
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
      {/* Compact Hero Section */}
      <div className="bg-gradient-to-r from-steel-blue to-industrial-orange rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">S-Steel Construction</h1>
        <p className="text-sm opacity-90 mb-4">Professional Steel Construction Solutions - Building Your Future</p>
        <div className="flex gap-3">
          <Link
            to="/projects"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            View Projects
          </Link>
          <Link
            to="/contact"
            className="bg-industrial-orange hover:bg-industrial-orange-dark text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Get Quote
          </Link>
        </div>
      </div>

      {/* Compact Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className="bg-white rounded-lg p-3 text-center shadow-md"
          >
            <stat.icon className="h-6 w-6 text-industrial-orange mx-auto mb-1" />
            <div className="text-lg font-bold text-steel-blue">{stat.value}</div>
            <div className="text-xs text-steel-gray">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Featured Projects - Compact Grid */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-steel-blue">Featured Projects</h2>
          <Link
            to="/projects"
            className="text-industrial-orange hover:text-industrial-orange-dark text-sm font-medium inline-flex items-center"
          >
            View All
            <ArrowRightIcon className="h-4 w-4 ml-1" />
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
                <BuildingOffice2Icon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
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
            <PhoneIcon className="h-4 w-4 mr-1" />
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
