import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  WrenchScrewdriverIcon,
  CogIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const itemsPerPage = 12;

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: '🏗️' },
    { id: 'design', name: 'Design', icon: '📐' },
    { id: 'fabrication', name: 'Fabrication', icon: '🔧' },
    { id: 'construction', name: 'Construction', icon: '🏢' }
  ];

  // Compact services array
  const allServices = [
    { id: 1, category: 'design', icon: WrenchScrewdriverIcon, title: 'Steel Design', description: 'Professional architectural design', price: '$5,000+', time: '2-4 weeks' },
    { id: 2, category: 'design', icon: CogIcon, title: 'Engineering', description: 'Expert engineering consultation', price: '$150/hr', time: '1-2 weeks' },
    { id: 3, category: 'fabrication', icon: WrenchScrewdriverIcon, title: 'Custom Fabrication', description: 'Precision steel fabrication', price: 'Quote', time: '3-8 weeks' },
    { id: 4, category: 'fabrication', title: 'Welding Services', icon: ShieldCheckIcon, description: 'AWS certified welding', price: '$75-120/hr', time: '1-3 weeks' },
    { id: 5, category: 'construction', icon: BuildingOfficeIcon, title: 'Steel Erection', description: 'Complete construction services', price: 'Quote', time: '4-16 weeks' },
    { id: 6, category: 'construction', icon: CogIcon, title: 'Project Management', description: 'Comprehensive project coordination', price: '8-12%', time: 'Full Project' },
    { id: 7, category: 'design', icon: WrenchScrewdriverIcon, title: 'CAD Services', description: 'Technical drawings and plans', price: '$2,000+', time: '1-3 weeks' },
    { id: 8, category: 'fabrication', icon: CogIcon, title: 'Metal Cutting', description: 'Precision cutting services', price: '$50-200/hr', time: '1-2 weeks' },
    { id: 9, category: 'construction', icon: BuildingOfficeIcon, title: 'Industrial Build', description: 'Industrial facility construction', price: 'Quote', time: '8-24 weeks' },
    { id: 10, category: 'design', icon: ShieldCheckIcon, title: 'Safety Planning', description: 'Safety assessment and planning', price: '$1,500+', time: '1 week' },
    { id: 11, category: 'fabrication', icon: WrenchScrewdriverIcon, title: 'Steel Repair', description: 'Structural repair services', price: 'Quote', time: '1-4 weeks' },
    { id: 12, category: 'construction', icon: CogIcon, title: 'Quality Control', description: 'Inspection and quality assurance', price: '$100/hr', time: 'Ongoing' }
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 group h-full flex flex-col"
    >
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-industrial-orange to-industrial-orange-dark rounded-lg flex items-center justify-center mr-3">
          <service.icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-steel-blue text-sm truncate">{service.title}</h3>
          <span className="text-xs text-industrial-orange capitalize">{service.category}</span>
        </div>
      </div>
      
      <p className="text-steel-gray text-xs mb-3 flex-1">{service.description}</p>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-steel-gray">Price:</span>
          <span className="font-semibold text-steel-blue">{service.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-steel-gray">Time:</span>
          <span className="font-semibold text-steel-blue">{service.time}</span>
        </div>
      </div>
      
      <button className="w-full bg-steel-blue text-white py-2 px-3 rounded text-xs font-medium mt-3 hover:bg-steel-blue-dark transition-colors">
        Get Quote
      </button>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-steel-blue to-industrial-orange rounded-lg p-4 text-white">
        <h1 className="text-xl font-bold mb-1">Our Services</h1>
        <p className="text-sm opacity-90">Professional steel construction services from design to completion</p>
      </div>

      {/* Compact Category Filter */}
      <div className="flex gap-2">
        {serviceCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-industrial-orange text-white'
                : 'bg-white text-steel-gray hover:bg-gray-100'
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-steel-gray">
          {filteredServices.length} services found
        </span>
        <span className="text-steel-gray">
          Page {currentPage} of {Math.ceil(filteredServices.length / itemsPerPage)}
        </span>
      </div>

      {/* Services Grid - Compact 3×4 layout */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-4 gap-3 h-full">
          {getPaginatedServices().map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* Compact Pagination */}
      {filteredServices.length > itemsPerPage && (
        <div className="flex justify-center">
          <PaginationControls
            currentPage={currentPage}
            totalItems={filteredServices.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            className="scale-75"
          />
        </div>
      )}

      {/* Compact CTA */}
      <div className="bg-industrial-orange rounded-lg p-3 text-center text-white">
        <h3 className="font-bold text-sm mb-2">Need Custom Service?</h3>
        <div className="flex gap-2 justify-center">
          <button className="bg-white text-industrial-orange px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors">
            Contact Us
          </button>
          <button className="border border-white text-white px-3 py-1 rounded text-xs font-semibold hover:bg-white hover:text-industrial-orange transition-colors">
            Get Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
