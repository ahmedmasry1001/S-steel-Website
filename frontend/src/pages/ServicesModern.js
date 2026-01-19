import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  SparklesIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  CheckBadgeIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const itemsPerPage = 12;

  const categories = [
    { id: 'all', name: 'All Services', emoji: '🏗️' },
    { id: 'construction', name: 'Construction', emoji: '🔨' },
    { id: 'fabrication', name: 'Fabrication', emoji: '⚙️' },
    { id: 'consulting', name: 'Consulting', emoji: '💼' }
  ];

  // Modern services with social media style
  const services = [
    {
      id: 1,
      title: 'Structural Steel Design',
      description: 'Custom structural steel design for commercial and industrial projects',
      category: 'construction',
      price: 'From $5,000',
      rating: 4.9,
      reviews: 124,
      duration: '2-4 weeks',
      emoji: '🏗️',
      gradient: 'from-blue-500 to-purple-600',
      verified: true,
      featured: true
    },
    {
      id: 2,
      title: 'Steel Fabrication',
      description: 'Precision steel fabrication services for complex construction needs',
      category: 'fabrication',
      price: 'From $3,000',
      rating: 4.8,
      reviews: 89,
      duration: '1-3 weeks',
      emoji: '⚙️',
      gradient: 'from-emerald-500 to-teal-600',
      verified: true,
      featured: false
    },
    {
      id: 3,
      title: 'Building Construction',
      description: 'Complete steel building construction from foundation to finish',
      category: 'construction',
      price: 'From $50,000',
      rating: 5.0,
      reviews: 67,
      duration: '2-6 months',
      emoji: '🏢',
      gradient: 'from-orange-500 to-red-600',
      verified: true,
      featured: true
    },
    {
      id: 4,
      title: 'Project Consultation',
      description: 'Expert consultation for steel construction planning and execution',
      category: 'consulting',
      price: 'From $500',
      rating: 4.7,
      reviews: 156,
      duration: '1-2 days',
      emoji: '💼',
      gradient: 'from-violet-500 to-purple-600',
      verified: true,
      featured: false
    },
    {
      id: 5,
      title: 'Welding Services',
      description: 'Professional welding services for all steel construction needs',
      category: 'fabrication',
      price: 'From $200',
      rating: 4.9,
      reviews: 203,
      duration: '1-7 days',
      emoji: '🔥',
      gradient: 'from-green-500 to-emerald-600',
      verified: true,
      featured: true
    },
    {
      id: 6,
      title: 'Beam Installation',
      description: 'Precision beam installation for structural integrity',
      category: 'construction',
      price: 'From $2,000',
      rating: 4.8,
      reviews: 91,
      duration: '3-10 days',
      emoji: '📏',
      gradient: 'from-pink-500 to-rose-600',
      verified: true,
      featured: false
    },
    {
      id: 7,
      title: 'Safety Inspection',
      description: 'Comprehensive safety inspection and compliance checking',
      category: 'consulting',
      price: 'From $800',
      rating: 5.0,
      reviews: 45,
      duration: '1-2 days',
      emoji: '🛡️',
      gradient: 'from-yellow-500 to-orange-600',
      verified: true,
      featured: false
    },
    {
      id: 8,
      title: 'Custom Metalwork',
      description: 'Artistic and functional custom metalwork solutions',
      category: 'fabrication',
      price: 'From $1,000',
      rating: 4.6,
      reviews: 78,
      duration: '1-4 weeks',
      emoji: '🎨',
      gradient: 'from-indigo-500 to-blue-600',
      verified: false,
      featured: false
    },
    {
      id: 9,
      title: 'Maintenance Services',
      description: 'Ongoing maintenance for steel structures and buildings',
      category: 'construction',
      price: 'From $300',
      rating: 4.7,
      reviews: 134,
      duration: '1-3 days',
      emoji: '🔧',
      gradient: 'from-teal-500 to-cyan-600',
      verified: true,
      featured: false
    },
    {
      id: 10,
      title: 'Emergency Repairs',
      description: '24/7 emergency steel structure repair services',
      category: 'construction',
      price: 'From $500',
      rating: 4.9,
      reviews: 67,
      duration: 'Same day',
      emoji: '🚨',
      gradient: 'from-red-500 to-pink-600',
      verified: true,
      featured: true
    },
    {
      id: 11,
      title: 'Project Management',
      description: 'End-to-end project management for steel construction',
      category: 'consulting',
      price: 'From $2,000',
      rating: 4.8,
      reviews: 89,
      duration: 'Project duration',
      emoji: '📊',
      gradient: 'from-cyan-500 to-blue-600',
      verified: true,
      featured: false
    },
    {
      id: 12,
      title: 'Quality Assurance',
      description: 'Comprehensive quality assurance and testing services',
      category: 'consulting',
      price: 'From $1,200',
      rating: 5.0,
      reviews: 34,
      duration: '2-5 days',
      emoji: '✅',
      gradient: 'from-purple-500 to-pink-600',
      verified: false,
      featured: false
    }
  ];

  // Filter services
  const filteredServices = services.filter(service => 
    selectedCategory === 'all' || service.category === selectedCategory
  );

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
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
    >
      {/* Header */}
      <div className={`relative h-16 bg-gradient-to-br ${service.gradient} p-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-lg">{service.emoji}</span>
            </div>
            {service.verified && (
              <CheckBadgeIcon className="h-4 w-4 text-white" />
            )}
            {service.featured && (
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                FEATURED
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <HeartIcon className="h-4 w-4 text-white/70 hover:text-white transition-colors" />
            <ShareIcon className="h-4 w-4 text-white/70 hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-sm">{service.title}</h3>
          <div className="text-xs text-gray-400">•••</div>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {service.description}
        </p>
        
        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center space-x-1">
            <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-700">{service.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({service.reviews} reviews)</span>
        </div>
        
        {/* Price and Duration */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-medium text-gray-900">{service.price}</div>
          <div className="text-xs text-gray-500">{service.duration}</div>
        </div>
        
        {/* Book Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg text-white py-2 px-4 rounded-lg text-xs font-medium transition-all duration-200`}
        >
          Book Service
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Modern Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-2xl p-6 border border-gray-100 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🔨</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Professional Steel Services
            </h1>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 max-w-2xl">
            Book expert steel construction services with transparent pricing and guaranteed quality. Choose from our comprehensive service portfolio.
          </p>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Book Now</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm shadow-md border border-gray-200 transition-all duration-200 flex items-center space-x-2"
            >
              <PlayIcon className="h-4 w-4" />
              <span>See Portfolio</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-3">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center space-x-2 ${
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

      {/* Services Grid */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🔨</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Available Services</h2>
            <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
              {filteredServices.length} services
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-4 gap-3 h-full">
            {getPaginatedServices().map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>

        {/* Modern Pagination */}
        {filteredServices.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            <PaginationControls
              currentPage={currentPage}
              totalItems={filteredServices.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              className="scale-90"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
