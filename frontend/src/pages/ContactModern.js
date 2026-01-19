import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  SparklesIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  PaperAirplaneIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState('general');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Modern contact info with social media style
  const contactInfo = [
    {
      id: 1,
      title: 'Main Office',
      details: '+1 (555) 123-4567',
      subDetails: 'Mon-Fri 8AM-6PM EST',
      emoji: '📞',
      gradient: 'from-blue-500 to-purple-600',
      verified: true
    },
    {
      id: 2,
      title: 'Email Support',
      details: 'contact@s-steel.com',
      subDetails: '24/7 Response Time',
      emoji: '📧',
      gradient: 'from-emerald-500 to-teal-600',
      verified: true
    },
    {
      id: 3,
      title: 'Emergency Line',
      details: '+1 (555) 911-HELP',
      subDetails: 'Available 24/7',
      emoji: '🚨',
      gradient: 'from-orange-500 to-red-600',
      verified: true
    },
    {
      id: 4,
      title: 'Office Location',
      details: '123 Steel Avenue',
      subDetails: 'New York, NY 10001',
      emoji: '📍',
      gradient: 'from-violet-500 to-purple-600',
      verified: true
    },
    {
      id: 5,
      title: 'Project Quotes',
      details: 'quotes@s-steel.com',
      subDetails: 'Free Estimates',
      emoji: '💼',
      gradient: 'from-green-500 to-emerald-600',
      verified: true
    },
    {
      id: 6,
      title: 'Social Media',
      details: '@SteelConstruction',
      subDetails: 'Follow Us',
      emoji: '📱',
      gradient: 'from-pink-500 to-rose-600',
      verified: true
    },
    {
      id: 7,
      title: 'Live Chat',
      details: 'Available Now',
      subDetails: 'Instant Support',
      emoji: '💬',
      gradient: 'from-yellow-500 to-orange-600',
      verified: false
    },
    {
      id: 8,
      title: 'WhatsApp',
      details: '+1 (555) 123-4567',
      subDetails: 'Quick Messages',
      emoji: '💚',
      gradient: 'from-indigo-500 to-blue-600',
      verified: false
    }
  ];

  const services = [
    { id: 'general', name: 'General Inquiry', emoji: '💬' },
    { id: 'quote', name: 'Project Quote', emoji: '💰' },
    { id: 'emergency', name: 'Emergency Service', emoji: '🚨' },
    { id: 'consultation', name: 'Consultation', emoji: '🤝' }
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
          service: selectedService,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        reset();
        setSelectedService('general');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ContactCard = ({ contact, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
    >
      {/* Header */}
      <div className={`relative h-16 bg-gradient-to-br ${contact.gradient} p-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-lg">{contact.emoji}</span>
            </div>
            {contact.verified && (
              <CheckBadgeIcon className="h-4 w-4 text-white" />
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
          <h3 className="font-bold text-gray-900 text-sm">{contact.title}</h3>
          <div className="text-xs text-gray-400">•••</div>
        </div>
        
        <div className="space-y-1 mb-3">
          <div className="text-xs font-medium text-gray-700">{contact.details}</div>
          <div className="text-xs text-gray-500">{contact.subDetails}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">Contact</div>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${contact.gradient}`}></div>
        </div>
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
              <span className="text-white text-lg">📞</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Get In Touch
            </h1>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 max-w-2xl">
            Ready to start your steel construction project? Contact our expert team for quotes, consultations, or any questions.
          </p>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Quick Quote</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm shadow-md border border-gray-200 transition-all duration-200 flex items-center space-x-2"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Schedule Call</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
        {/* Contact Info Cards - 2 columns */}
        <div className="col-span-2 flex flex-col space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📞</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-2 gap-3 h-full">
              {contactInfo.map((contact, index) => (
                <ContactCard key={contact.id} contact={contact} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form - 1 column */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">💬</span>
            </div>
            <h3 className="font-bold text-gray-900">Send Message</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Service Selection */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Service Type</label>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedService === service.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{service.emoji}</span>
                    {service.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Your Name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}

              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
                type="email"
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

              <input
                {...register('phone')}
                placeholder="Phone Number (Optional)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />

              <textarea
                {...register('message', { required: 'Message is required' })}
                placeholder="Tell us about your project..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
              />
              {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
