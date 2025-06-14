
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageCircle, Rss, Heart, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AnonymousJourneyModal from '../components/AnonymousJourneyModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [showAnonymousModal, setShowAnonymousModal] = useState(false);

  useEffect(() => {
    // Check if user has seen the anonymous journey modal before
    const hasSeenModal = localStorage.getItem('hasSeenAnonymousJourney');
    if (!hasSeenModal) {
      setShowAnonymousModal(true);
    }
  }, []);

  const handleCloseAnonymousModal = () => {
    setShowAnonymousModal(false);
    localStorage.setItem('hasSeenAnonymousJourney', 'true');
  };

  const quickStats = [
    { label: 'Groups Joined', value: '0', icon: Users, color: 'bg-blue-500' },
    { label: 'Messages', value: '0', icon: MessageCircle, color: 'bg-green-500' },
    { label: 'Posts', value: '0', icon: Rss, color: 'bg-purple-500' },
    { label: 'Connections', value: '0', icon: Heart, color: 'bg-pink-500' }
  ];

  const upcomingFeatures = [
    {
      title: 'Interest Groups',
      description: 'Join groups based on your hobbies and passions',
      status: 'Available',
      link: '/groups'
    },
    {
      title: 'Personal Feed',
      description: 'See updates from your groups and connections',
      status: 'Available',
      link: '/feed'
    },
    {
      title: 'Direct Messages',
      description: 'Have private conversations with connections',
      status: 'Available',
      link: '/messages'
    }
  ];

  // Get username from user metadata or email
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {username}!
              </h1>
              <p className="text-gray-600">
                Ready to make some authentic connections today?
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="text-white" size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-amber-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Explore Interest Groups</h3>
                <p className="text-gray-600 text-sm">Find communities that match your hobbies and interests.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-amber-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Join Conversations</h3>
                <p className="text-gray-600 text-sm">Share your thoughts and connect with like-minded people.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-amber-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Build Connections</h3>
                <p className="text-gray-600 text-sm">Form meaningful relationships through authentic dialogue.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="text-amber-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Explore Platform Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <Link 
                key={index}
                to={feature.link}
                className="group p-6 border border-gray-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-800 group-hover:text-amber-800 transition-colors">
                    {feature.title}
                  </h3>
                  <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                    {feature.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Anonymous Journey Modal */}
      <AnonymousJourneyModal 
        open={showAnonymousModal} 
        onClose={handleCloseAnonymousModal} 
      />
    </div>
  );
};

export default Dashboard;
