import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  SparklesIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modern 3D stats with Instagram-style design
  const stats = [
    { 
      number: '25+', 
      label: 'Years Experience', 
      emoji: '⏰',
      gradient: 'from-blue-500 to-purple-600',
      shadow: 'shadow-blue-500/25'
    },
    { 
      number: '500+', 
      label: 'Projects Delivered', 
      emoji: '🏗️',
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/25'
    },
    { 
      number: '200+', 
      label: 'Happy Clients', 
      emoji: '😊',
      gradient: 'from-orange-500 to-red-600',
      shadow: 'shadow-orange-500/25'
    },
    { 
      number: '15+', 
      label: 'Countries Served', 
      emoji: '🌍',
      gradient: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/25'
    },
    { 
      number: '100%', 
      label: 'Safety Rating', 
      emoji: '🛡️',
      gradient: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/25'
    },
    { 
      number: '50+', 
      label: 'Team Members', 
      emoji: '👥',
      gradient: 'from-pink-500 to-rose-600',
      shadow: 'shadow-pink-500/25'
    },
    { 
      number: '30+', 
      label: 'Awards Won', 
      emoji: '🏆',
      gradient: 'from-yellow-500 to-orange-600',
      shadow: 'shadow-yellow-500/25'
    },
    { 
      number: '24/7', 
      label: 'Support Available', 
      emoji: '📞',
      gradient: 'from-indigo-500 to-blue-600',
      shadow: 'shadow-indigo-500/25'
    }
  ];

  // Modern team members with social media style
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Chief Engineer',
      avatar: '👩‍💼',
      experience: '15 years',
      specialty: 'Structural Design',
      gradient: 'from-blue-500 to-purple-600',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Project Manager',
      avatar: '👨‍💼',
      experience: '12 years',
      specialty: 'Project Coordination',
      gradient: 'from-emerald-500 to-teal-600',
      verified: true
    },
    {
      id: 3,
      name: 'David Rodriguez',
      role: 'Senior Welder',
      avatar: '👨‍🔧',
      experience: '18 years',
      specialty: 'Steel Fabrication',
      gradient: 'from-orange-500 to-red-600',
      verified: true
    },
    {
      id: 4,
      name: 'Emma Wilson',
      role: 'Safety Coordinator',
      avatar: '👩‍🔧',
      experience: '10 years',
      specialty: 'Safety Management',
      gradient: 'from-violet-500 to-purple-600',
      verified: true
    },
    {
      id: 5,
      name: 'James Thompson',
      role: 'Quality Inspector',
      avatar: '👨‍🔬',
      experience: '14 years',
      specialty: 'Quality Control',
      gradient: 'from-green-500 to-emerald-600',
      verified: true
    },
    {
      id: 6,
      name: 'Lisa Park',
      role: 'Design Specialist',
      avatar: '👩‍🎨',
      experience: '11 years',
      specialty: 'CAD Design',
      gradient: 'from-pink-500 to-rose-600',
      verified: true
    },
    {
      id: 7,
      name: 'Robert Kim',
      role: 'Site Supervisor',
      avatar: '👨‍🏭',
      experience: '16 years',
      specialty: 'Site Management',
      gradient: 'from-yellow-500 to-orange-600',
      verified: true
    },
    {
      id: 8,
      name: 'Maria Garcia',
      role: 'Construction Manager',
      avatar: '👩‍🏭',
      experience: '13 years',
      specialty: 'Construction Planning',
      gradient: 'from-indigo-500 to-blue-600',
      verified: true
    },
    {
      id: 9,
      name: 'Alex Johnson',
      role: 'Steel Fabricator',
      avatar: '👨‍🔧',
      experience: '9 years',
      specialty: 'Metal Working',
      gradient: 'from-teal-500 to-cyan-600',
      verified: false
    },
    {
      id: 10,
      name: 'Jennifer Lee',
      role: 'Engineering Assistant',
      avatar: '👩‍💼',
      experience: '7 years',
      specialty: 'Technical Support',
      gradient: 'from-purple-500 to-pink-600',
      verified: false
    },
    {
      id: 11,
      name: 'Mark Davis',
      role: 'Crane Operator',
      avatar: '👨‍🏭',
      experience: '20 years',
      specialty: 'Heavy Machinery',
      gradient: 'from-red-500 to-pink-600',
      verified: true
    },
    {
      id: 12,
      name: 'Rachel Brown',
      role: 'Quality Analyst',
      avatar: '👩‍🔬',
      experience: '8 years',
      specialty: 'Quality Analysis',
      gradient: 'from-cyan-500 to-blue-600',
      verified: false
    }
  ];
    {
      icon: AcademicCapIcon,
      title: 'Continuous Learning',
      description: 'Ongoing training and certification programs ensure our team stays current with latest industry standards and techniques.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Experience',
      description: 'International project experience brings diverse perspectives and best practices from around the world.'
    },
    {
      icon: StarIcon,
      title: 'Customer Focus',
      description: 'Client satisfaction is our top priority, with dedicated support throughout the entire project lifecycle.'
    }
  ];

  const team = [
    {
      name: 'Ahmed Masry',
      position: 'Founder & CEO',
      description: 'Over 25 years of experience in steel construction, leading the company with vision and expertise.',
      image: '/api/placeholder/300/300',
      certifications: ['PE License', 'AWS CWI', 'OSHA 30']
    },
    {
      name: 'Sarah Johnson',
      position: 'Chief Engineer',
      description: 'Structural engineering expert with 18 years of experience in complex steel projects.',
      image: '/api/placeholder/300/300',
      certifications: ['PE License', 'AISC Certified', 'LEED AP']
    },
    {
      name: 'Michael Chen',
      position: 'Operations Director',
      description: 'Project management specialist ensuring efficient execution and quality delivery.',
      image: '/api/placeholder/300/300',
      certifications: ['PMP', 'Six Sigma Black Belt', 'OSHA 30']
    },
    {
      name: 'Lisa Rodriguez',
      position: 'Quality Assurance Manager',
      description: 'Quality control expert maintaining highest standards across all project phases.',
      image: '/api/placeholder/300/300',
      certifications: ['CQE', 'AWS CWI', 'ISO 9001 Lead Auditor']
    },
    {
      name: 'Robert Kim',
      position: 'Senior Welding Inspector',
      description: 'AWS certified welding expert with 22 years of specialized welding experience.',
      image: '/api/placeholder/300/300',
      certifications: ['AWS CWI', 'AWS CQI', 'ASNT Level III']
    },
    {
      name: 'Jennifer Davis',
      position: 'Safety Director',
      description: 'Safety management specialist ensuring zero-accident workplaces across all projects.',
      image: '/api/placeholder/300/300',
      certifications: ['CSP', 'CHST', 'OSHA 500']
    },
    {
      name: 'David Wilson',
      position: 'Design Engineer',
      description: 'CAD and BIM specialist creating innovative design solutions for complex structures.',
      image: '/api/placeholder/300/300',
      certifications: ['Tekla Certified', 'Autodesk Expert', 'BIM Specialist']
    },
    {
      name: 'Maria Garcia',
      position: 'Project Coordinator',
      description: 'Client relations and project coordination expert ensuring smooth communication.',
      image: '/api/placeholder/300/300',
      certifications: ['PMP', 'Agile Certified', 'APICS CPIM']
    }
  ];

  const certifications = [
    { name: 'ISO 9001:2015 Certified', description: 'Quality Management System' },
    { name: 'OSHA VPP Star Status', description: 'Voluntary Protection Program' },
    { name: 'AWS Certified Facility', description: 'American Welding Society' },
    { name: 'AISC Certified Fabricator', description: 'American Institute of Steel Construction' },
    { name: 'LEED Accredited', description: 'Green Building Certification' },
    { name: 'ICC Certified', description: 'International Code Council' }
  ];

  // Get paginated team members
  const getPaginatedTeam = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return team.slice(startIndex, endIndex);
  };

  const TeamCard = ({ member, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group text-center"
    >
      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div
          className="w-full h-full bg-gradient-to-br from-steel-blue to-steel-blue-light flex items-center justify-center text-white font-bold text-xl"
          style={{ display: 'none' }}
        >
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-steel-blue mb-1">{member.name}</h3>
      <p className="text-industrial-orange font-medium mb-3">{member.position}</p>
      <p className="text-steel-gray text-sm mb-4">{member.description}</p>
      
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-steel-blue">Certifications:</h4>
        <div className="flex flex-wrap gap-1 justify-center">
          {member.certifications.map((cert, idx) => (
            <span key={idx} className="bg-gray-100 text-steel-gray px-2 py-1 rounded text-xs">
              {cert}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-steel-blue to-steel-blue-light rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">About S-Steel Construction</h1>
        <p className="text-steel-blue-light opacity-90">
          Over 25 years of excellence in steel construction. Building the future with strength, 
          precision, and unwavering commitment to quality and safety.
        </p>
      </div>

      {/* Company Stats Grid */}
      <div>
        <h2 className="text-2xl font-bold text-steel-blue mb-4">Our Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 text-center shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300"
            >
              <stat.icon className="h-8 w-8 text-industrial-orange mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-steel-blue mb-1">{stat.number}</div>
              <div className="text-steel-gray text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Company Values */}
      <div>
        <h2 className="text-2xl font-bold text-steel-blue mb-4">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-industrial-orange to-industrial-orange-dark rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-steel-blue mb-3">{value.title}</h3>
              <p className="text-steel-gray text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section with Pagination */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-steel-blue">Our Expert Team</h2>
          <p className="text-steel-gray text-sm">
            Page {currentPage} of {Math.ceil(team.length / itemsPerPage)}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {getPaginatedTeam().map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* Team Pagination */}
        {team.length > itemsPerPage && (
          <div className="flex justify-center">
            <PaginationControls
              currentPage={currentPage}
              totalItems={team.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-steel-blue mb-4 text-center">Certifications & Accreditations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {certifications.map((cert, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-industrial-orange mx-auto mb-2" />
              <div className="font-semibold text-steel-blue text-sm">{cert.name}</div>
              <div className="text-steel-gray text-xs">{cert.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-industrial-orange to-industrial-orange-dark rounded-xl p-6 text-center text-white">
        <h3 className="text-xl font-bold mb-3">Ready to Work With Our Expert Team?</h3>
        <p className="mb-4 opacity-90">
          Experience the difference that 25+ years of steel construction expertise makes. 
          Contact us today to discuss your project requirements.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="bg-white text-industrial-orange px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2" />
            Contact Us
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-industrial-orange transition-colors inline-flex items-center">
            <EnvelopeIcon className="h-4 w-4 mr-2" />
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
