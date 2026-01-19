import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      subDetails: 'Mon-Fri 8AM-6PM'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: 'info@s-steel.com',
      subDetails: 'We respond within 24 hours'
    },
    {
      icon: MapPinIcon,
      title: 'Office',
      details: '123 Steel Avenue',
      subDetails: 'Industrial District, City 12345'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: 'Monday - Friday: 8AM - 6PM',
      subDetails: 'Saturday: 9AM - 4PM'
    }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        reset();
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    'Steel Structure Design',
    'Commercial Construction',
    'Industrial Buildings',
    'Infrastructure Projects',
    'Residential Steel Frame',
    'Maintenance & Repair',
    'Project Management',
    'Consultation Services'
  ];

  return (
    <div className="contact-page">
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
              Get In Touch
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Ready to start your steel construction project? We're here to help. 
              Contact us for a free consultation and quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-industrial-orange to-industrial-orange-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <info.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-gray mb-2">
                  {info.title}
                </h3>
                <p className="text-steel-gray font-medium">{info.details}</p>
                <p className="text-steel-gray text-sm">{info.subDetails}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-light">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="card">
                <h2 className="text-3xl font-bold text-dark-gray mb-6">
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Your full name"
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="your.email@example.com"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+1 (555) 123-4567"
                        {...register('phone')}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Company
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Your company name"
                        {...register('company')}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Project Type
                    </label>
                    <select 
                      className="form-input"
                      {...register('projectType')}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Message *
                    </label>
                    <textarea
                      className={`form-input form-textarea ${errors.message ? 'border-red-500' : ''}`}
                      placeholder="Tell us about your project requirements..."
                      rows="6"
                      {...register('message', { required: 'Message is required' })}
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Services List */}
              <div className="card">
                <h3 className="text-2xl font-bold text-dark-gray mb-4">
                  Our Services
                </h3>
                <ul className="space-y-3">
                  {services.map((service, index) => (
                    <li key={service} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
                      <span className="text-steel-gray">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Choose Us */}
              <div className="card">
                <h3 className="text-2xl font-bold text-dark-gray mb-4">
                  Why Choose S-Steel?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-dark-gray">15+ Years Experience</p>
                      <p className="text-steel-gray text-sm">Proven track record in steel construction</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-dark-gray">Quality Guaranteed</p>
                      <p className="text-steel-gray text-sm">We stand behind our work with comprehensive warranties</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-dark-gray">Free Consultation</p>
                      <p className="text-steel-gray text-sm">Initial project assessment at no cost</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-medium text-dark-gray">24/7 Support</p>
                      <p className="text-steel-gray text-sm">Round-the-clock support for urgent issues</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="card bg-primary-blue text-white">
                <h3 className="text-xl font-bold mb-3">
                  Emergency Services
                </h3>
                <p className="mb-4 text-blue-100">
                  Need urgent steel construction support? Our emergency team is available 24/7.
                </p>
                <a 
                  href="tel:+15551234567" 
                  className="btn bg-white text-primary-blue hover:bg-gray-100 w-full text-center"
                >
                  Call Emergency Line
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-gray mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-steel-gray">
              Stop by our office to discuss your project in person or schedule a site visit.
            </p>
          </div>
          
          <div className="card">
            <div className="w-full h-96 bg-gradient-to-br from-steel-gray to-dark-gray rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <MapPinIcon className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Office Location</h3>
                <p>123 Steel Avenue, Industrial District</p>
                <p>City, State 12345</p>
                <p className="mt-4 text-sm text-gray-300">
                  Interactive map integration can be added here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
