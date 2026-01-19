import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState('general');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Main Office',
      details: '+1 (555) 123-4567',
      subDetails: 'Mon-Fri 8AM-6PM EST',
      color: 'text-industrial-orange'
    },
    {
      icon: PhoneIcon,
      title: 'Emergency Line',
      details: '+1 (555) 123-4568',
      subDetails: '24/7 Emergency Support',
      color: 'text-red-500'
    },
    {
      icon: EnvelopeIcon,
      title: 'General Email',
      details: 'info@s-steel.com',
      subDetails: 'Response within 4 hours',
      color: 'text-steel-blue'
    },
    {
      icon: EnvelopeIcon,
      title: 'Project Quotes',
      details: 'quotes@s-steel.com',
      subDetails: 'Quote requests & estimates',
      color: 'text-industrial-orange'
    },
    {
      icon: MapPinIcon,
      title: 'Main Office',
      details: '123 Steel Industry Blvd',
      subDetails: 'Industrial City, State 12345',
      color: 'text-steel-blue'
    },
    {
      icon: MapPinIcon,
      title: 'Workshop Facility',
      details: '456 Manufacturing Way',
      subDetails: 'Production & Fabrication',
      color: 'text-steel-gray'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: 'Mon-Fri: 8AM - 6PM',
      subDetails: 'Sat: 9AM - 4PM',
      color: 'text-steel-blue'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Regional Office',
      details: '789 Construction Ave',
      subDetails: 'Secondary Location',
      color: 'text-steel-gray'
    }
  ];

  const serviceTypes = [
    { id: 'general', name: 'General Inquiry', icon: ChatBubbleLeftRightIcon },
    { id: 'quote', name: 'Request Quote', icon: CurrencyDollarIcon },
    { id: 'consultation', name: 'Project Consultation', icon: WrenchScrewdriverIcon },
    { id: 'support', name: 'Technical Support', icon: ExclamationTriangleIcon },
    { id: 'partnership', name: 'Partnership', icon: BuildingOfficeIcon },
    { id: 'emergency', name: 'Emergency Service', icon: PhoneIcon }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          serviceType: selectedService,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We will get back to you soon.', {
          position: 'top-right',
          autoClose: 5000,
        });
        reset();
        setSelectedService('general');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again or contact us directly.', {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ContactCard = ({ info, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group"
    >
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 ${
          info.color === 'text-industrial-orange' ? 'bg-orange-100' :
          info.color === 'text-red-500' ? 'bg-red-100' :
          info.color === 'text-steel-blue' ? 'bg-blue-100' :
          'bg-gray-100'
        }`}>
          <info.icon className={`h-6 w-6 ${info.color}`} />
        </div>
        <h3 className="text-lg font-bold text-steel-blue">{info.title}</h3>
      </div>
      <p className="text-steel-blue font-medium mb-2">{info.details}</p>
      <p className="text-steel-gray text-sm">{info.subDetails}</p>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-steel-blue to-steel-blue-light rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Contact S-Steel Construction</h1>
        <p className="text-steel-blue-light opacity-90">
          Ready to start your steel construction project? Get in touch with our expert team 
          for quotes, consultations, or any questions about our services.
        </p>
      </div>

      {/* Contact Information Grid (2 rows × 4 columns = 8 cards) */}
      <div>
        <h2 className="text-2xl font-bold text-steel-blue mb-4">Get In Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <ContactCard key={index} info={info} index={index} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-steel-blue mb-6">Send Us a Message</h3>

          {/* Service Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-steel-blue mb-3">
              Type of Inquiry
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {serviceTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedService(type.id)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    selectedService === type.id
                      ? 'bg-industrial-orange text-white border-industrial-orange'
                      : 'bg-gray-50 text-steel-gray border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <type.icon className="h-4 w-4 mx-auto mb-1" />
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-steel-blue mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register('firstName', { required: 'First name is required' })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition-colors ${
                    errors.firstName ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-steel-blue mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register('lastName', { required: 'Last name is required' })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition-colors ${
                    errors.lastName ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-steel-blue mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition-colors ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="john.doe@company.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-steel-blue mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-steel-blue mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  {...register('company')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition-colors"
                  placeholder="Your Company Name"
                />
              </div>
            </div>

            {/* Project Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-steel-blue mb-2">
                Project Timeline
              </label>
              <select
                id="timeline"
                {...register('timeline')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition-colors"
              >
                <option value="">Select Timeline</option>
                <option value="immediate">Immediate (Within 1 month)</option>
                <option value="short">Short Term (1-3 months)</option>
                <option value="medium">Medium Term (3-6 months)</option>
                <option value="long">Long Term (6+ months)</option>
                <option value="planning">Planning Phase</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-steel-blue mb-2">
                Message *
              </label>
              <textarea
                id="message"
                rows="4"
                {...register('message', { required: 'Message is required' })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-industrial-orange focus:border-transparent outline-none transition-colors resize-none ${
                  errors.message ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="Please describe your project requirements, timeline, and any specific questions you have about our steel construction services..."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-steel-blue to-steel-blue-light hover:from-steel-blue-dark hover:to-steel-blue shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Sending Message...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <PaperAirplaneIcon className="h-5 w-5 mr-3" />
                  Send Message
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Map and Additional Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Map Placeholder */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-steel-blue mb-4">Find Our Office</h3>
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-12 w-12 text-steel-gray mx-auto mb-2" />
                <p className="text-steel-gray">Interactive Map Coming Soon</p>
                <p className="text-sm text-steel-gray">123 Steel Industry Blvd, Industrial City</p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-industrial-orange to-industrial-orange-dark rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Quick Tips for Your Inquiry</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-orange-200 mr-2">•</span>
                Include project location and approximate size for accurate quotes
              </li>
              <li className="flex items-start">
                <span className="text-orange-200 mr-2">•</span>
                Mention any specific timeline requirements or constraints
              </li>
              <li className="flex items-start">
                <span className="text-orange-200 mr-2">•</span>
                Attach drawings or specifications if available
              </li>
              <li className="flex items-start">
                <span className="text-orange-200 mr-2">•</span>
                For emergencies, call our 24/7 emergency line directly
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
