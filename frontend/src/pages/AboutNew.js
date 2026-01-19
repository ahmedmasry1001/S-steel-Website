import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  ShieldCheckIcon,
  CogIcon,
  AcademicCapIcon,
  StarIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const stats = [
    { number: '25+', label: 'Years in Business', icon: ClockIcon },
    { number: '500+', label: 'Projects Completed', icon: BuildingOffice2Icon },
    { number: '200+', label: 'Happy Clients', icon: UserGroupIcon },
    { number: '15+', label: 'Countries Served', icon: GlobeAltIcon },
    { number: '100%', label: 'Safety Rating', icon: ShieldCheckIcon },
    { number: '50+', label: 'Expert Team Members', icon: UserGroupIcon },
    { number: '30+', label: 'Awards Won', icon: TrophyIcon },
    { number: '24/7', label: 'Support Available', icon: PhoneIcon }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Quality Excellence',
      description: 'We maintain the highest standards of quality in every project, ensuring structural integrity and longevity that exceeds industry benchmarks.'
    },
    {
      icon: ClockIcon,
      title: 'Timely Delivery',
      description: 'Our efficient project management and advanced planning ensures on-time completion without compromising on quality standards.'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Team',
      description: 'Our skilled engineers, welders, and craftsmen bring decades of combined experience to every project challenge.'
    },
    {
      icon: CogIcon,
      title: 'Innovation',
      description: 'We embrace cutting-edge technology and innovative solutions for complex construction challenges and modern requirements.'
    },
    {
      icon: TrophyIcon,
      title: 'Award-Winning',
      description: 'Recognition from industry leaders for outstanding project delivery, safety standards, and construction excellence.'
    },
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
