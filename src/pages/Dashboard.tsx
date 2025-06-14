
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Heart, MessageCircle, MapPin, Star, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import AnonymousJourneyModal from '../components/AnonymousJourneyModal';
import MeetupMap from '../components/MeetupMap';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
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

  // Mock featured groups - in a real app, these would come from your backend
  const featuredGroups = [
    {
      id: 1,
      name: "Local Photographers",
      description: "Capturing moments around the city",
      members: 127,
      category: "Creative Arts",
      isLocal: true,
      trending: true
    },
    {
      id: 2,
      name: "Weekend Hikers",
      description: "Exploring trails every Saturday",
      members: 89,
      category: "Sports & Outdoors",
      isLocal: true,
      trending: false
    },
    {
      id: 3,
      name: "Book Club Enthusiasts",
      description: "Monthly discussions on great reads",
      members: 156,
      category: "Intellectual",
      isLocal: false,
      trending: true
    },
    {
      id: 4,
      name: "Coffee & Conversations",
      description: "Weekly meetups at local cafes",
      members: 203,
      category: "Lifestyle",
      isLocal: true,
      trending: false
    }
  ];

  // Get username from user metadata or email
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const hasSelectedInterests = profile?.selected_tags && profile.selected_tags.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                <Sparkles className="text-amber-500" size={32} />
                <span>Welcome back, {username}!</span>
              </h1>
              <p className="text-gray-600">
                Discover groups, make connections, and join conversations that matter to you.
              </p>
            </div>
          </div>
        </div>

        {/* Onboarding Prompt */}
        {!hasSelectedInterests && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Get Started with Your Interests</h2>
                <p className="text-amber-100 mb-4">
                  Help us recommend groups by selecting topics you're passionate about.
                </p>
                <Link
                  to="/tag-onboarding"
                  className="inline-flex items-center space-x-2 bg-white text-amber-600 px-6 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors"
                >
                  <Sparkles size={18} />
                  <span>Choose Your Interests</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Meetup Map */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <MeetupMap />
        </div>

        {/* Featured Groups */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="text-amber-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Featured Groups</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGroups.map((group) => (
              <div
                key={group.id}
                className="group p-6 border border-gray-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-amber-800 transition-colors flex items-center space-x-2">
                        <span>{group.name}</span>
                        {group.trending && <Star className="text-amber-500" size={16} />}
                        {group.isLocal && <MapPin className="text-green-500" size={16} />}
                      </h3>
                      <p className="text-sm text-gray-600">{group.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{group.members} members</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {group.category}
                    </span>
                  </div>
                  <Link
                    to="/groups"
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Join →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Link
              to="/groups"
              className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium"
            >
              <span>View All Groups</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Getting Started Tips */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tips for Authentic Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Heart className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Be Genuine</h3>
                  <p className="text-gray-600 text-sm">
                    Share your real thoughts and experiences. Authenticity creates lasting connections.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="text-green-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Engage Actively</h3>
                  <p className="text-gray-600 text-sm">
                    Comment, like, and participate in discussions. Engagement unlocks direct messaging.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="text-purple-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Join Local Groups</h3>
                  <p className="text-gray-600 text-sm">
                    Find people in your city for real-world meetups and activities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="text-amber-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Stay Consistent</h3>
                  <p className="text-gray-600 text-sm">
                    Regular participation keeps communities active and relationships growing.
                  </p>
                </div>
              </div>
            </div>
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
