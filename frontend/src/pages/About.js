import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaginationControls } from '../components/MainLayout';
import {
  SparklesIcon,
  PlayIcon,
  HeartIcon,
  ShareIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [teamMembers, setTeamMembers] = useState([]);
  const [homeContent, setHomeContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  // Load team members and company data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees
        const employeesResponse = await fetch('/api/employees');
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          
          // Transform API data to match the expected format with gradient colors
          const gradients = [
            'from-blue-500 to-purple-600',
            'from-emerald-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-violet-500 to-purple-600',
            'from-green-500 to-emerald-600',
            'from-pink-500 to-rose-600',
            'from-yellow-500 to-orange-600',
            'from-indigo-500 to-blue-600'
          ];

          const transformedMembers = employeesData.map((employee, index) => ({
            id: employee.id,
            name: employee.name,
            role: employee.role,
            avatar: employee.avatar,
            experience: employee.experience,
            specialty: employee.specialty,
            gradient: gradients[index % gradients.length],
            verified: employee.verified
          }));
          
          setTeamMembers(transformedMembers);
        } else {
          // Fallback to default data if API fails
          setTeamMembers(getDefaultTeamMembers());
        }

        // Fetch home content for stats
        const homeResponse = await fetch('/api/home-content');
        if (homeResponse.ok) {
          const homeData = await homeResponse.json();
          setHomeContent(homeData);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep existing hardcoded data as fallback
        setTeamMembers(getDefaultTeamMembers());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback team members if API fails
  const getDefaultTeamMembers = () => [
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
    }
  ];

  // Generate dynamic stats from API data or use defaults
  const getStats = () => {
    if (homeContent?.stats) {
      return [
        { 
          number: `${homeContent.stats.yearsExperience}+`, 
          label: 'Years Experience', 
          emoji: '⏰',
          gradient: 'from-blue-500 to-purple-600',
          shadow: 'shadow-blue-500/25'
        },
        { 
          number: `${homeContent.stats.projectsCompleted}+`, 
          label: 'Projects Completed', 
          emoji: '🏗️',
          gradient: 'from-emerald-500 to-teal-600',
          shadow: 'shadow-emerald-500/25'
        },
        { 
          number: `${homeContent.stats.teamMembers}+`, 
          label: 'Team Members', 
          emoji: '👥',
          gradient: 'from-orange-500 to-red-600',
          shadow: 'shadow-orange-500/25'
        },
        { 
          number: `${homeContent.stats.clientSatisfaction}%`, 
          label: 'Client Satisfaction', 
          emoji: '🛡️',
          gradient: 'from-green-500 to-emerald-600',
          shadow: 'shadow-green-500/25'
        }
      ];
    }

    // Fallback to static stats if no API data
    return [
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
        number: '100%', 
        label: 'Safety Rating', 
        emoji: '🛡️',
        gradient: 'from-green-500 to-emerald-600',
        shadow: 'shadow-green-500/25'
      }
    ];
  };

  // Get paginated team members
  const getPaginatedTeam = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return teamMembers.slice(startIndex, endIndex);
  };

  const TeamCard = ({ member, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      {/* Profile Header */}
      <div className={`relative h-16 bg-gradient-to-br ${member.gradient} p-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-lg">{member.avatar}</span>
            </div>
            {member.verified && (
              <CheckBadgeIcon className="h-4 w-4 text-white" />
            )}
          </div>
          <div className="flex items-center space-x-1">
            <HeartIcon className="h-4 w-4 text-white/70 hover:text-white transition-colors cursor-pointer" />
            <ShareIcon className="h-4 w-4 text-white/70 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-sm">{member.name}</h3>
          <div className="text-xs text-gray-400">•••</div>
        </div>
        
        <div className="space-y-1 mb-3">
          <div className="text-xs font-medium text-gray-600">{member.role}</div>
          <div className="text-xs text-gray-500">{member.specialty}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{member.experience}</div>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${member.gradient}`}></div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-steel-blue border-t-transparent"></div>
        <span className="ml-2 text-text-secondary">Loading team information...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 overflow-hidden">
      {/* Modern Hero Section - Social Media Style */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 rounded-2xl p-6 border border-gray-100 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">👥</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Meet Our Expert Team
            </h1>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 max-w-2xl">
            {homeContent?.companyDescription || 'Experienced professionals delivering premium steel construction services with 25+ years of industry expertise.'}
          </p>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Join Our Team</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm shadow-md border border-gray-200 transition-all duration-200 flex items-center space-x-2"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Watch Story</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Instagram-Style Stats */}
      <div className="grid grid-cols-4 gap-3">
        {getStats().map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl p-4 border border-gray-100 ${stat.shadow} shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-lg">{stat.emoji}</span>
                </div>
                <HeartIcon className="h-4 w-4 text-gray-300 group-hover:text-red-400 transition-colors duration-200" />
              </div>
              
              <div className="text-xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              
              <div className="text-xs text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Grid */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">👥</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
            <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
              {teamMembers.length} members
            </div>
          </div>
        </div>

        {/* Team Cards Grid */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-4 gap-3 h-full">
            {getPaginatedTeam().map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>

        {/* Modern Pagination */}
        {teamMembers.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            <PaginationControls
              currentPage={currentPage}
              totalItems={teamMembers.length}
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

export default About;