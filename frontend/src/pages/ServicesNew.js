import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  WrenchScrewdriverIcon,
  CogIcon,
  ShieldCheckIcon,
  TruckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PhoneIcon,
  DocumentTextIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const itemsPerPage = 12;

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: '🏗️' },
    { id: 'design', name: 'Design & Engineering', icon: '📐' },
    { id: 'fabrication', name: 'Fabrication', icon: '🔧' },
    { id: 'construction', name: 'Construction', icon: '🏢' },
    { id: 'maintenance', name: 'Maintenance', icon: '⚙️' }
  ];

  const allServices = [
    {
      id: 1,
      category: 'design',
      icon: DocumentTextIcon,
      title: 'Structural Steel Design',
      description: 'Professional architectural and structural design services for steel buildings and infrastructure projects.',
      features: [
        'CAD Design & 3D Modeling',
        'Structural Engineering Calculations', 
        'Building Information Modeling (BIM)',
        'Code Compliance & Permits'
      ],
      pricing: 'Starting from $5,000',
      timeline: '2-4 weeks'
    },
    {
      id: 2,
      category: 'design',
      icon: CogIcon,
      title: 'Engineering Consultation',
      description: 'Expert engineering consultation for complex steel construction challenges and optimization.',
      features: [
        'Load Analysis & Calculations',
        'Material Optimization',
        'Cost-Benefit Analysis',
        'Technical Documentation'
      ],
      pricing: '$150/hour',
      timeline: '1-2 weeks'
    },
    {
      id: 3,
      category: 'fabrication',
      icon: WrenchScrewdriverIcon,
      title: 'Custom Steel Fabrication',
      description: 'Precision steel fabrication using advanced machinery and quality control processes.',
      features: [
        'CNC Cutting & Machining',
        'Precision Welding Services',
        'Surface Treatment & Coating',
        'Quality Control Testing'
      ],
      pricing: 'Quote on Request',
      timeline: '3-8 weeks'
    },
    {
      id: 4,
      category: 'fabrication',
      title: 'Welding Services',
      icon: ShieldCheckIcon,
      description: 'AWS certified welding services for all types of steel construction and repair projects.',
      features: [
        'AWS Certified Welders',
        'MIG/TIG/Stick Welding',
        'Structural Welding',
        'Repair & Maintenance Welding'
      ],
      pricing: '$75-120/hour',
      timeline: '1-3 weeks'
    },
    {
      id: 5,
      category: 'construction',
      icon: BuildingOfficeIcon,
      title: 'Steel Structure Erection',
      description: 'Complete on-site construction services from foundation preparation to final assembly.',
      features: [
        'Site Preparation & Foundation',
        'Steel Frame Erection',
        'Safety Management',
        'Project Coordination'
      ],
      pricing: 'Quote on Request',
      timeline: '4-16 weeks'
    },
    {
      id: 6,
      category: 'construction',
      icon: TruckIcon,
      title: 'Project Management',
      description: 'Comprehensive project management services ensuring timely and budget-conscious delivery.',
      features: [
        'Timeline Planning',
        'Resource Coordination',
        'Quality Assurance',
        'Client Communication'
      ],
      pricing: '8-12% of project cost',
      timeline: 'Project Duration'
    },
    {
      id: 7,
      category: 'maintenance',
      icon: ShieldCheckIcon,
      title: 'Structural Inspections',
      description: 'Thorough structural inspections and safety assessments for existing steel structures.',
      features: [
        'Visual & NDT Inspections',
        'Safety Assessments',
        'Compliance Reporting',
        'Maintenance Recommendations'
      ],
      pricing: '$2,000-8,000',
      timeline: '1-2 weeks'
    },
    {
      id: 8,
      category: 'maintenance',
      icon: CogIcon,
      title: 'Repair & Maintenance',
      description: 'Professional repair and maintenance services to extend the life of steel structures.',
      features: [
        'Structural Repairs',
        'Preventive Maintenance',
        'Coating & Protection',
        'Emergency Services'
      ],
      pricing: 'Quote on Request',
      timeline: '1-4 weeks'
    },
    // Additional services for pagination demo
    {
      id: 9,
      category: 'design',
      icon: DocumentTextIcon,
      title: 'Blueprint & Drawings',
      description: 'Detailed technical drawings and blueprints for steel construction projects.',
      features: [
        'Technical Drawings',
        'Assembly Instructions',
        'Material Specifications',
        'Revision Management'
      ],
      pricing: '$2,000-5,000',
      timeline: '1-3 weeks'
    },
    {
      id: 10,
      category: 'fabrication',
      icon: WrenchScrewdriverIcon,
      title: 'Metal Cutting Services',
      description: 'Precision metal cutting using laser, plasma, and waterjet technologies.',
      features: [
        'Laser Cutting',
        'Plasma Cutting',
        'Waterjet Cutting',
        'Custom Shapes'
      ],
      pricing: '$50-200/hour',
      timeline: '1-2 weeks'
    },
    {
      id: 11,
      category: 'construction',
      icon: BuildingOfficeIcon,
      title: 'Industrial Construction',
      description: 'Specialized construction services for industrial facilities and manufacturing plants.',
      features: [
        'Heavy Industrial Construction',
        'Equipment Installation',
        'Utility Integration',
        'Safety Compliance'
      ],
      pricing: 'Quote on Request',
      timeline: '8-24 weeks'
    },
    {
      id: 12,
      category: 'maintenance',
      icon: ShieldCheckIcon,
      title: 'Emergency Repairs',
      description: '24/7 emergency repair services for critical steel structure failures.',
      features: [
        '24/7 Availability',
        'Rapid Response Team',
        'Temporary Stabilization',
        'Permanent Solutions'
      ],
      pricing: '$150-250/hour',
      timeline: 'Immediate'
    }
  ];

  // Filter services based on category
  const filteredServices = selectedCategory === 'all' 
    ? allServices 
    : allServices.filter(service => service.category === selectedCategory);

  // Get paginated services
  const getPaginatedServices = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredServices.slice(startIndex, endIndex);
  };

  const ServiceCard = ({ service, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group h-full flex flex-col"
    >
      {/* Service Header */}
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-industrial-orange to-industrial-orange-dark rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <service.icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-steel-blue group-hover:text-industrial-orange transition-colors">
            {service.title}
          </h3>
          <span className="inline-block px-2 py-1 bg-gray-100 text-steel-gray text-xs rounded-full mt-1 capitalize">
            {service.category}
          </span>
        </div>
      </div>
      
      {/* Service Description */}
      <p className="text-steel-gray mb-4 flex-1">{service.description}</p>
      
      {/* Service Features */}
      <div className="mb-6">
        <h4 className="font-semibold text-steel-blue mb-3">What's Included:</h4>
        <ul className="space-y-2">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-steel-gray">
              <CheckCircleIcon className="h-4 w-4 text-industrial-orange mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Service Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm">
          <CurrencyDollarIcon className="h-4 w-4 text-industrial-orange mr-2" />
          <span className="text-steel-gray">Pricing: </span>
          <span className="font-semibold text-steel-blue ml-1">{service.pricing}</span>
        </div>
        <div className="flex items-center text-sm">
          <ClockIcon className="h-4 w-4 text-industrial-orange mr-2" />
          <span className="text-steel-gray">Timeline: </span>
          <span className="font-semibold text-steel-blue ml-1">{service.timeline}</span>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="mt-auto">
        <button className="w-full bg-gradient-to-r from-steel-blue to-steel-blue-light text-white py-3 px-4 rounded-lg hover:from-steel-blue-dark hover:to-steel-blue transition-all duration-200 font-medium group-hover:shadow-lg flex items-center justify-center">
          <PhoneIcon className="h-4 w-4 mr-2" />
          Request Quote
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-steel-blue to-steel-blue-light rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Our Steel Construction Services</h1>
        <p className="text-steel-blue-light opacity-90">
          Comprehensive steel construction services from design and engineering to fabrication, 
          installation, and maintenance. Professional solutions for every project need.
        </p>
      </div>

      {/* Service Categories Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-steel-blue mb-4">Service Categories</h2>
        <div className="flex flex-wrap gap-3">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
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
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-steel-gray">
          Found <span className="font-semibold text-steel-blue">{filteredServices.length}</span> services
          {selectedCategory !== 'all' && (
            <>
              {' '}in <span className="font-semibold text-industrial-orange">
                {serviceCategories.find(cat => cat.id === selectedCategory)?.name}
              </span>
            </>
          )}
        </p>
        <p className="text-steel-gray text-sm">
          Page {currentPage} of {Math.ceil(filteredServices.length / itemsPerPage)}
        </p>
      </div>

      {/* Services Grid (3 rows × 4 columns = 12 items max) */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full">
          {getPaginatedServices().map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredServices.length > itemsPerPage && (
        <div className="flex justify-center pt-4">
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredServices.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-industrial-orange to-industrial-orange-dark rounded-xl p-6 text-center text-white">
        <h3 className="text-xl font-bold mb-3">Need a Custom Solution?</h3>
        <p className="mb-4 opacity-90">
          Don't see exactly what you're looking for? We specialize in custom steel construction solutions 
          tailored to your specific project requirements.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="bg-white text-industrial-orange px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2" />
            Contact Us
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-industrial-orange transition-colors">
            Request Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
