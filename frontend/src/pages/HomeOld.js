import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ClockIcon,
  TruckIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [homeContent, setHomeContent] = useState({
    heroImages: [],
    companyDescription: '',
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch home content
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await fetch('/api/home-content');
        if (response.ok) {
          const data = await response.json();
          setHomeContent(data);
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    };

    fetchHomeContent();
  }, []);

  // Fetch featured projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?featured=true&limit=3');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    if (homeContent.heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          (prev + 1) % homeContent.heroImages.length
        );
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [homeContent.heroImages.length]);

  const features = [
    {
      icon: WrenchScrewdriverIcon,
      title: 'Expert Engineering',
      description: 'Professional design and engineering solutions for complex steel structures.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'Rigorous quality control and testing to ensure structural integrity.'
    },
    {
      icon: ClockIcon,
      title: 'Timely Delivery',
      description: 'On-schedule project completion with efficient project management.'
    },
    {
      icon: TruckIcon,
      title: 'Full Service',
      description: 'Complete steel construction services from design to installation.'
    }
  ];

  // Dynamic stats from admin interface
  const stats = [
    { 
      number: `${homeContent.stats.projectsCompleted || 500}+`, 
      label: 'Projects Completed' 
    },
    { 
      number: `${homeContent.stats.yearsExperience || 15}+`, 
      label: 'Years Experience' 
    },
    { 
      number: `${homeContent.stats.teamMembers || 50}+`, 
      label: 'Expert Engineers' 
    },
    { 
      number: `${homeContent.stats.clientSatisfaction || 99}%`, 
      label: 'Client Satisfaction' 
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-gray via-steel-gray to-dark-gray text-white py-20 overflow-hidden min-h-screen flex items-center">
        {/* Hero Background Images */}
        {homeContent.heroImages.length > 0 && (
          <div className="absolute inset-0">
            {homeContent.heroImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-70' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${image.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
          </div>
        )}
        
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container relative z-10">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold">
              Building the Future with{' '}
              <span className="gradient-text-animated">Steel Excellence</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {homeContent.companyDescription || 'Professional steel structure solutions for construction, infrastructure, and industrial projects. Quality craftsmanship you can trust.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/projects" className="btn btn-primary btn-pulse text-lg px-8 py-4 bg-gradient-to-r from-industrial-orange to-industrial-orange-light hover:from-industrial-orange-dark hover:to-industrial-orange shadow-xl">
                View Our Projects
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn btn-outline text-lg px-8 py-4 border-industrial-orange text-industrial-orange hover:bg-industrial-orange hover:text-white">
                Get Free Quote
              </Link>
            </div>
          </motion.div>
          
          {/* Hero Image Navigation Dots */}
          {homeContent.heroImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {homeContent.heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-industrial-orange' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 top-20 w-80 h-80 bg-industrial-orange opacity-10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute -left-20 bottom-20 w-60 h-60 bg-info opacity-10 rounded-full blur-3xl float-animation" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Features Section */}
      <section className="section bg-bg-primary">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-steel-blue mb-4">Why Choose S-Steel</h2>
            <p className="text-xl text-steel-gray max-w-3xl mx-auto">
              We combine expertise, quality, and innovation to deliver exceptional steel construction solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-white rounded-lg shadow-light hover:shadow-medium transition-all duration-300 hover:transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-industrial-orange to-industrial-orange-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-steel-blue mb-3">{feature.title}</h3>
                <p className="text-steel-gray leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-dark">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-secondary-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-gray mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-steel-gray max-w-2xl mx-auto">
              Discover our latest steel construction projects showcasing 
              innovation, quality, and engineering excellence.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="card loading">
                  <div className="bg-gray-200 h-48 rounded mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <motion.div
                    key={project.id}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={project.image || '/api/placeholder/400/250'}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-dark-gray mb-2">
                      {project.title}
                    </h3>
                    <p className="text-steel-gray mb-4">
                      {project.description?.slice(0, 120)}...
                    </p>
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-primary-blue font-medium hover:text-secondary-blue transition-colors inline-flex items-center"
                    >
                      View Details
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </motion.div>
                ))
              ) : (
                // Placeholder projects when no data is available
                [1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <div className="w-full h-48 bg-gradient-to-br from-steel-gray to-dark-gray flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">Steel Project {item}</span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-primary-blue text-white text-xs px-2 py-1 rounded">
                          Construction
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-dark-gray mb-2">
                      Steel Structure Project {item}
                    </h3>
                    <p className="text-steel-gray mb-4">
                      Professional steel construction project showcasing our expertise 
                      in structural engineering and quality craftsmanship.
                    </p>
                    <Link
                      to="/projects"
                      className="text-primary-blue font-medium hover:text-secondary-blue transition-colors inline-flex items-center"
                    >
                      View All Projects
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/projects" className="btn btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-light">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark-gray mb-6">
                Comprehensive Steel Construction Services
              </h2>
              <p className="text-lg text-steel-gray mb-8">
                From initial design concepts to final installation, we provide 
                end-to-end steel construction solutions for projects of all sizes.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  'Structural Steel Design & Engineering',
                  'Steel Fabrication & Manufacturing',
                  'On-site Construction & Installation',
                  'Quality Control & Safety Management',
                  'Project Management & Consultation'
                ].map((service, index) => (
                  <div key={service} className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-success flex-shrink-0" />
                    <span className="text-dark-gray">{service}</span>
                  </div>
                ))}
              </div>

              <Link to="/services" className="btn btn-primary">
                Learn More About Our Services
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
                <p className="mb-6">
                  Get a free consultation and quote for your steel construction project. 
                  Our experts are here to help bring your vision to life.
                </p>
                <Link to="/contact" className="btn bg-white text-primary-blue hover:bg-gray-100">
                  Get Free Quote
                </Link>
              </div>
              
              <div className="absolute -z-10 -right-4 -bottom-4 w-full h-full bg-accent-orange opacity-20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
