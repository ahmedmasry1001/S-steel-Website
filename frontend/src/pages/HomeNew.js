import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ClockIcon,
  TruckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Featured services data
  const services = [
    {
      id: 1,
      title: 'Structural Steel Fabrication',
      description: 'Custom steel fabrication services for commercial and industrial projects',
      icon: WrenchScrewdriverIcon,
      features: ['Custom Design', 'Quality Materials', 'Precision Engineering']
    },
    {
      id: 2,
      title: 'Steel Erection',
      description: 'Professional steel structure installation and assembly services',
      icon: BuildingOffice2Icon,
      features: ['Safety Certified', 'Experienced Crew', 'Timely Completion']
    },
    {
      id: 3,
      title: 'Welding Services',
      description: 'AWS certified welding for all types of steel construction projects',
      icon: ShieldCheckIcon,
      features: ['AWS Certified', 'Quality Control', 'Various Techniques']
    },
    {
      id: 4,
      title: 'Project Consultation',
      description: 'Expert consultation and project planning for steel construction',
      icon: ChatBubbleLeftRightIcon,
      features: ['Expert Analysis', 'Cost Optimization', 'Timeline Planning']
    }
  ];

  // Company stats
  const stats = [
    { label: 'Projects Completed', value: '500+', icon: BuildingOffice2Icon },
    { label: 'Years Experience', value: '25+', icon: ClockIcon },
    { label: 'Happy Clients', value: '200+', icon: UsersIcon },
    { label: 'Safety Rating', value: '100%', icon: ShieldCheckIcon }
  ];

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
        const response = await fetch('/api/projects?featured=true');
        if (response.ok) {
          const data = await response.json();
          setProjects(data.slice(0, 8)); // Limit to 8 for 2 rows
        } else {
          // Placeholder projects
          const placeholderProjects = [
            {
              id: 1,
              title: 'Modern Office Complex',
              description: 'State-of-the-art office building with innovative steel framework',
              category: 'commercial',
              image: '/api/placeholder/400/300',
              year: '2023'
            },
            {
              id: 2,
              title: 'Industrial Manufacturing Plant',
              description: 'Large-scale industrial facility with heavy-duty steel structures',
              category: 'industrial',
              image: '/api/placeholder/400/300',
              year: '2023'
            },
            {
              id: 3,
              title: 'Bridge Infrastructure',
              description: 'Steel bridge construction with advanced engineering solutions',
              category: 'infrastructure',
              image: '/api/placeholder/400/300',
              year: '2022'
            },
            {
              id: 4,
              title: 'Residential Complex',
              description: 'Modern residential development with steel frame construction',
              category: 'residential',
              image: '/api/placeholder/400/300',
              year: '2023'
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

    fetchProjects();
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    if (homeContent.heroImages && homeContent.heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => 
          (prev + 1) % homeContent.heroImages.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [homeContent.heroImages]);

  const ServiceCard = ({ service, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-industrial-orange to-industrial-orange-dark rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
          <service.icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-steel-blue">{service.title}</h3>
      </div>
      
      <p className="text-steel-gray mb-4">{service.description}</p>
      
      <ul className="space-y-2">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-center text-sm text-steel-gray">
            <CheckCircleIcon className="h-4 w-4 text-industrial-orange mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );

  const ProjectCard = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
    >
      <div className="relative h-40 overflow-hidden bg-gray-200">
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
          className="w-full h-full bg-gradient-to-br from-steel-blue to-steel-blue-light flex items-center justify-center text-white font-semibold"
          style={{ display: (project.main_image || project.image) ? 'none' : 'flex' }}
        >
          <BuildingOffice2Icon className="h-8 w-8" />
        </div>
        
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-industrial-orange text-white">
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="text-lg font-bold text-steel-blue mb-2 group-hover:text-industrial-orange transition-colors">
          {project.title}
        </h4>
        <p className="text-steel-gray text-sm mb-3 line-clamp-2">
          {project.description}
        </p>
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center text-industrial-orange hover:text-industrial-orange-dark font-medium text-sm"
        >
          View Details
          <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-steel-blue border-t-transparent"></div>
          <p className="text-steel-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-steel-blue via-steel-blue-light to-industrial-orange rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Steel Construction Solutions
            </h1>
            <p className="text-xl mb-6 text-steel-blue-light opacity-90 max-w-2xl">
              Building your future with strength, precision, and reliability. 
              Over 25 years of excellence in steel construction across commercial, 
              industrial, residential, and infrastructure projects.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="bg-industrial-orange hover:bg-industrial-orange-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
              >
                View Our Projects
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Get Quote
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      {/* Company Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 text-center shadow-lg border border-gray-100"
          >
            <stat.icon className="h-8 w-8 text-industrial-orange mx-auto mb-3" />
            <div className="text-2xl font-bold text-steel-blue mb-1">{stat.value}</div>
            <div className="text-steel-gray text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-steel-blue">Our Services</h2>
          <Link
            to="/services"
            className="text-industrial-orange hover:text-industrial-orange-dark font-medium inline-flex items-center"
          >
            View All Services
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* Featured Projects Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-steel-blue">Featured Projects</h2>
          <Link
            to="/projects"
            className="text-industrial-orange hover:text-industrial-orange-dark font-medium inline-flex items-center"
          >
            View All Projects
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.slice(0, 8).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <BuildingOffice2Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-steel-gray mb-2">No Featured Projects</h3>
            <p className="text-steel-gray">Check back soon for our latest projects.</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-industrial-orange to-industrial-orange-dark rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Your Steel Construction Project?</h3>
        <p className="text-lg mb-6 opacity-90">
          Get a free consultation and quote for your next steel construction project. 
          Our experts are ready to help bring your vision to life.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-white text-industrial-orange px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <PhoneIcon className="h-5 w-5 mr-2" />
            Get Free Quote
          </Link>
          <Link
            to="/projects"
            className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-industrial-orange transition-colors"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
