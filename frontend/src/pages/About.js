import React from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  ShieldCheckIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const stats = [
    { number: '15+', label: 'Years in Business' },
    { number: '500+', label: 'Projects Completed' },
    { number: '50+', label: 'Expert Team Members' },
    { number: '10+', label: 'Countries Served' }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Quality Excellence',
      description: 'We maintain the highest standards of quality in every project, ensuring structural integrity and longevity.'
    },
    {
      icon: ClockIcon,
      title: 'Timely Delivery',
      description: 'Our efficient project management ensures on-time completion without compromising on quality.'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Team',
      description: 'Our skilled engineers and craftsmen bring decades of experience to every project.'
    },
    {
      icon: CogIcon,
      title: 'Innovation',
      description: 'We embrace cutting-edge technology and innovative solutions for complex construction challenges.'
    }
  ];

  const team = [
    {
      name: 'Ahmed Masry',
      position: 'Founder & CEO',
      description: 'With over 20 years of experience in steel construction, Ahmed leads our company with vision and expertise.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Sarah Johnson',
      position: 'Chief Engineer',
      description: 'Sarah oversees all engineering projects with her extensive background in structural design.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Michael Chen',
      position: 'Project Manager',
      description: 'Michael ensures all projects are completed on time and within budget with his meticulous planning.',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Lisa Rodriguez',
      position: 'Quality Assurance Director',
      description: 'Lisa maintains our high quality standards through rigorous testing and inspection processes.',
      image: '/api/placeholder/300/300'
    }
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Company Founded',
      description: 'S-Steel Construction was established with a vision to provide quality steel construction solutions.'
    },
    {
      year: '2013',
      title: 'First Major Project',
      description: 'Completed our first large-scale commercial building project, establishing our reputation in the industry.'
    },
    {
      year: '2016',
      title: 'International Expansion',
      description: 'Expanded operations internationally, taking on projects in multiple countries.'
    },
    {
      year: '2019',
      title: 'Technology Integration',
      description: 'Integrated advanced BIM and 3D modeling technologies into our design process.'
    },
    {
      year: '2022',
      title: 'Sustainability Focus',
      description: 'Launched our green construction initiative focusing on sustainable building practices.'
    },
    {
      year: '2025',
      title: 'Innovation Center',
      description: 'Opened our state-of-the-art innovation center for R&D in steel construction technologies.'
    }
  ];

  return (
    <div className="about-page">
      {/* Header */}
      <section className="bg-gradient-to-r from-dark-gray to-steel-gray text-white py-16">
        <div className="container">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              About S-Steel Construction
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Building the future with steel excellence since 2010. We are committed 
              to delivering innovative, sustainable, and high-quality steel construction solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-dark-gray mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-steel-gray text-lg">
                <p>
                  Founded in 2010, S-Steel Construction has grown from a small local 
                  contractor to a leading steel construction company serving clients 
                  across multiple countries. Our journey began with a simple mission: 
                  to provide exceptional steel construction services that combine 
                  traditional craftsmanship with modern innovation.
                </p>
                <p>
                  Over the years, we have built a reputation for excellence, completing 
                  hundreds of projects ranging from small residential structures to 
                  large-scale commercial and industrial facilities. Our commitment to 
                  quality, safety, and customer satisfaction has made us a trusted 
                  partner for clients worldwide.
                </p>
                <p>
                  Today, we continue to push the boundaries of what's possible in 
                  steel construction, embracing new technologies and sustainable 
                  practices to create structures that will stand the test of time.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="card text-center">
                  <div className="text-3xl font-bold text-primary-blue mb-2">
                    {stat.number}
                  </div>
                  <div className="text-steel-gray">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-gray mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-steel-gray max-w-2xl mx-auto">
              These values guide everything we do and shape our approach to 
              every project we undertake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-industrial-orange to-industrial-orange-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-gray mb-3">
                  {value.title}
                </h3>
                <p className="text-steel-gray">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-gray mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-steel-gray max-w-2xl mx-auto">
              Key milestones that have shaped S-Steel Construction into 
              the company we are today.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-primary-blue"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary-blue rounded-full border-4 border-white shadow-lg"></div>
                  
                  {/* Content */}
                  <div className={`flex-1 ml-12 md:ml-0 ${
                    index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                  }`}>
                    <div className="card">
                      <div className="text-2xl font-bold text-primary-blue mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-dark-gray mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-steel-gray">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-gray mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-lg text-steel-gray max-w-2xl mx-auto">
              Our experienced leadership team brings together decades of expertise 
              in steel construction, engineering, and project management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="card text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-steel-gray to-dark-gray flex items-center justify-center">
                  <UserGroupIcon className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-gray mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-blue font-medium mb-3">
                  {member.position}
                </p>
                <p className="text-steel-gray text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-gray mb-4">
              Certifications & Accreditations
            </h2>
            <p className="text-lg text-steel-gray max-w-2xl mx-auto">
              We maintain the highest industry standards through continuous 
              certification and accreditation programs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'ISO 9001:2015',
              'AWS Certified',
              'OSHA Compliant',
              'Green Building Certified',
              'Quality Assurance',
              'Safety Standards',
              'Environmental Management',
              'Professional Engineering'
            ].map((cert, index) => (
              <motion.div
                key={cert}
                className="card text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TrophyIcon className="h-8 w-8 text-primary-blue mx-auto mb-2" />
                <p className="text-dark-gray font-medium text-sm">{cert}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how our expertise and experience can help 
              bring your steel construction project to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn btn-primary">
                Start Your Project
              </a>
              <a href="/projects" className="btn btn-outline bg-white text-primary-blue hover:bg-gray-100">
                View Our Portfolio
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
