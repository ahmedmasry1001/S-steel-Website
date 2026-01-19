import React from 'react';
import { motion } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  CogIcon,
  ShieldCheckIcon,
  TruckIcon,
  BuildingOfficeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Services = () => {
  const services = [
    {
      icon: WrenchScrewdriverIcon,
      title: 'Steel Structure Design',
      description: 'Professional architectural and structural design services for steel buildings and infrastructure.',
      features: [
        'CAD Design & 3D Modeling',
        'Structural Engineering Calculations',
        'Building Information Modeling (BIM)',
        'Code Compliance & Permits'
      ]
    },
    {
      icon: CogIcon,
      title: 'Steel Fabrication',
      description: 'Precision steel fabrication using advanced machinery and quality control processes.',
      features: [
        'Custom Steel Fabrication',
        'CNC Cutting & Machining',
        'Welding & Assembly',
        'Surface Treatment & Coating'
      ]
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Construction & Installation',
      description: 'Complete on-site construction services from foundation to finishing.',
      features: [
        'Site Preparation & Foundation',
        'Steel Erection & Assembly',
        'Safety Management',
        'Project Coordination'
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Control',
      description: 'Rigorous quality assurance and testing throughout all project phases.',
      features: [
        'Material Testing & Inspection',
        'Weld Quality Testing',
        'Structural Load Testing',
        'Compliance Certification'
      ]
    },
    {
      icon: TruckIcon,
      title: 'Project Management',
      description: 'End-to-end project management ensuring timely delivery and budget control.',
      features: [
        'Project Planning & Scheduling',
        'Resource Management',
        'Progress Monitoring',
        'Client Communication'
      ]
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Maintenance & Support',
      description: 'Ongoing maintenance and support services for completed steel structures.',
      features: [
        'Regular Inspections',
        'Preventive Maintenance',
        'Repair & Renovation',
        '24/7 Emergency Support'
      ]
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Consultation & Planning',
      description: 'Initial consultation to understand your requirements and develop a comprehensive project plan.'
    },
    {
      step: '02',
      title: 'Design & Engineering',
      description: 'Professional design and engineering services with detailed technical drawings and specifications.'
    },
    {
      step: '03',
      title: 'Fabrication',
      description: 'Precision steel fabrication in our state-of-the-art facility with quality control at every stage.'
    },
    {
      step: '04',
      title: 'Installation',
      description: 'Expert on-site installation and construction with safety as our top priority.'
    },
    {
      step: '05',
      title: 'Quality Assurance',
      description: 'Final inspections and testing to ensure all specifications are met and exceeded.'
    },
    {
      step: '06',
      title: 'Delivery & Support',
      description: 'Project handover with ongoing support and maintenance services as needed.'
    }
  ];

  return (
    <div className="services-page">
      {/* Header */}
      <section className="bg-gradient-to-br from-steel-blue via-steel-blue-dark to-charcoal text-white py-16">
        <div className="container">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-industrial-orange-light bg-clip-text text-transparent">
              Professional Steel Construction Services
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              From design to installation, we provide comprehensive steel construction 
              solutions for projects of all sizes and complexities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="card group hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-industrial-orange to-industrial-orange-light rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-to-br group-hover:from-industrial-orange-dark group-hover:to-industrial-orange transition-all duration-300 shadow-md">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-dark-gray mb-3 text-center">
                  {service.title}
                </h3>
                
                <p className="text-steel-gray mb-6 text-center">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-steel-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-light">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-gray mb-4">
              Our Construction Process
            </h2>
            <p className="text-lg text-steel-gray max-w-2xl mx-auto">
              We follow a systematic approach to ensure every project is completed 
              on time, within budget, and to the highest quality standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-steel-blue to-industrial-orange rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dark-gray mb-2">
                      {item.title}
                    </h3>
                    <p className="text-steel-gray">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-8 h-0.5 bg-steel-gray transform -translate-x-4"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-gray mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-steel-gray max-w-2xl mx-auto">
              Our expertise spans across various industries with specialized 
              solutions for each sector's unique requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Commercial Buildings', icon: '🏢' },
              { name: 'Industrial Facilities', icon: '🏭' },
              { name: 'Infrastructure', icon: '🌉' },
              { name: 'Residential Projects', icon: '🏘️' },
              { name: 'Warehouses', icon: '🏬' },
              { name: 'Sports Facilities', icon: '🏟️' },
              { name: 'Agricultural Buildings', icon: '🏗️' },
              { name: 'Energy Sector', icon: '⚡' }
            ].map((industry, index) => (
              <motion.div
                key={industry.name}
                className="card text-center hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-semibold text-dark-gray">{industry.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-dark">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Steel Construction Project?
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. Our experts 
              are ready to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn btn-primary">
                Get Free Consultation
              </a>
              <a href="/projects" className="btn btn-outline bg-white text-primary-blue hover:bg-gray-100">
                View Our Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
