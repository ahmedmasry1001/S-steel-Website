import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          // Placeholder project for demo
          const placeholderProject = {
            id: parseInt(id),
            title: 'Modern Steel Office Complex',
            description: `This state-of-the-art office building showcases innovative steel framework design supporting multiple floors and open spaces. The project demonstrates our expertise in commercial steel construction with emphasis on both functionality and aesthetic appeal.

            The building features a sophisticated structural design that maximizes open floor space while ensuring optimal load distribution. Our team employed advanced engineering techniques to create a structure that is not only safe and durable but also energy-efficient and environmentally conscious.

            Key highlights of this project include the use of high-grade structural steel, precision welding techniques, and innovative connection methods that ensure long-term structural integrity. The project was completed on schedule and within budget, meeting all client requirements and exceeding safety standards.`,
            category: 'commercial',
            location: 'Downtown Business District',
            size: '50,000 sq ft',
            year: '2023',
            client: 'Metro Business Solutions',
            duration: '8 months',
            status: 'Completed',
            images: [
              { 
                id: 1, 
                image_path: 'projects/main1.jpg', 
                image_name: 'Main Structure', 
                is_main: true 
              },
              { 
                id: 2, 
                image_path: 'projects/detail1.jpg', 
                image_name: 'Steel Framework', 
                is_main: false 
              },
              { 
                id: 3, 
                image_path: 'projects/detail2.jpg', 
                image_name: 'Interior Structure', 
                is_main: false 
              }
            ],
            specifications: [
              { label: 'Steel Grade', value: 'ASTM A992 Grade 50' },
              { label: 'Total Steel Weight', value: '450 tons' },
              { label: 'Foundation Type', value: 'Deep Foundation Piles' },
              { label: 'Building Height', value: '6 floors, 80 ft' },
              { label: 'Structural System', value: 'Moment Frame with Braced Cores' }
            ],
            features: [
              'Advanced seismic design compliance',
              'Sustainable construction practices',
              'Energy-efficient structural design',
              'Rapid construction methodology',
              'Integrated building systems',
              'Quality control and testing'
            ]
          };
          setProject(placeholderProject);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        // Set placeholder on error
        setProject({
          id: parseInt(id),
          title: 'Steel Construction Project',
          description: 'Professional steel construction project details.',
          category: 'commercial',
          location: 'Project Location',
          size: 'Project Size',
          year: '2023',
          images: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading text-center">
          <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-steel-gray">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-gray mb-4">Project Not Found</h2>
          <Link to="/projects" className="btn btn-primary">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      {/* Header */}
      <section className="bg-gradient-to-r from-dark-gray to-steel-gray text-white py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              to="/projects" 
              className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-6"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Projects
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-primary-blue text-white text-sm px-3 py-1 rounded-full capitalize">
                {project.category}
              </span>
              <span className="bg-success text-white text-sm px-3 py-1 rounded-full">
                {project.status || 'Completed'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {project.title}
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-secondary-blue" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-secondary-blue" />
                <span>{project.year}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="h-5 w-5 text-secondary-blue" />
                <span>{project.size}</span>
              </div>
              {project.duration && (
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-5 w-5 text-secondary-blue" />
                  <span>{project.duration}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Image */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="w-full h-96 lg:h-[500px] bg-gradient-to-br from-steel-gray to-dark-gray rounded-xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <PhotoIcon className="h-24 w-24 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold">Project Image</h3>
                      <p className="text-gray-300 mt-2">
                        {project.images[selectedImage]?.image_name || 'Main View'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Image Navigation */}
                {project.images && project.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          selectedImage === index 
                            ? 'bg-primary-blue' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="card sticky top-24">
                <h2 className="text-2xl font-bold text-dark-gray mb-6">
                  Project Details
                </h2>
                
                <div className="space-y-4">
                  {project.client && (
                    <div>
                      <label className="text-sm font-medium text-steel-gray">Client</label>
                      <p className="text-dark-gray">{project.client}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-steel-gray">Category</label>
                    <p className="text-dark-gray capitalize">{project.category}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-steel-gray">Location</label>
                    <p className="text-dark-gray">{project.location}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-steel-gray">Size</label>
                    <p className="text-dark-gray">{project.size}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-steel-gray">Year Completed</label>
                    <p className="text-dark-gray">{project.year}</p>
                  </div>
                  
                  {project.duration && (
                    <div>
                      <label className="text-sm font-medium text-steel-gray">Duration</label>
                      <p className="text-dark-gray">{project.duration}</p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <Link to="/contact" className="btn btn-primary w-full">
                    Start Similar Project
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section className="section-light">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-dark-gray mb-6">
                Project Overview
              </h2>
              <div className="prose prose-lg text-steel-gray">
                {project.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {project.features && (
                <div className="card">
                  <h3 className="text-2xl font-bold text-dark-gray mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-blue rounded-full flex-shrink-0"></div>
                        <span className="text-steel-gray">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      {project.specifications && (
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-dark-gray mb-8 text-center">
                Technical Specifications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.specifications.map((spec, index) => (
                  <div key={index} className="card">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-steel-gray">{spec.label}</span>
                      <span className="font-semibold text-dark-gray">{spec.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-dark">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Interested in a Similar Project?
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help bring your steel construction vision to life 
              with our expertise and proven track record.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn btn-primary">
                Get Free Quote
              </Link>
              <Link to="/projects" className="btn btn-outline bg-white text-primary-blue hover:bg-gray-100">
                View More Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
