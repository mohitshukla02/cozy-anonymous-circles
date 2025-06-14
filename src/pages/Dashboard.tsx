
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Heart, MessageCircle, MapPin, Star, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import AnonymousJourneyModal from '../components/AnonymousJourneyModal';
import MeetupMap from '../components/MeetupMap';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [showAnonymousModal, setShowAnonymousModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenAnonymousJourney');
    if (!hasSeenModal) {
      setShowAnonymousModal(true);
    }
  }, []);

  const handleCloseAnonymousModal = () => {
    setShowAnonymousModal(false);
    localStorage.setItem('hasSeenAnonymousJourney', 'true');
  };

  const featuredGroups = [
    {
      id: 1,
      name: "Local Photographers",
      description: "Capturing moments around the city",
      members: 127,
      category: "Creative Arts",
      isLocal: true,
      trending: true,
      image: "📸"
    },
    {
      id: 2,
      name: "Weekend Hikers",
      description: "Exploring trails every Saturday",
      members: 89,
      category: "Sports & Outdoors",
      isLocal: true,
      trending: false,
      image: "🥾"
    },
    {
      id: 3,
      name: "Book Club Enthusiasts",
      description: "Monthly discussions on great reads",
      members: 156,
      category: "Intellectual",
      isLocal: false,
      trending: true,
      image: "📚"
    },
    {
      id: 4,
      name: "Coffee & Conversations",
      description: "Weekly meetups at local cafes",
      members: 203,
      category: "Lifestyle",
      isLocal: true,
      trending: false,
      image: "☕"
    }
  ];

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const hasSelectedInterests = profile?.selected_tags && profile.selected_tags.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Welcome back, {username}
          </h1>
          <p className="text-lg text-gray-600">
            Discover groups and connect with people who share your interests
          </p>
        </div>

        {/* Onboarding Banner */}
        {!hasSelectedInterests && (
          <div className="bg-black text-white rounded-2xl p-8 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-3">Complete your profile</h2>
              <p className="text-gray-300 mb-6 text-lg">
                Tell us about your interests to get personalized group recommendations
              </p>
              <Link
                to="/tag-onboarding"
                className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Get started
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Meetup Map */}
        <div className="mb-16">
          <MeetupMap />
        </div>

        {/* Featured Groups */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Featured groups</h2>
              <p className="text-gray-600">Popular communities in your area</p>
            </div>
            <Link
              to="/groups"
              className="text-gray-900 font-medium hover:underline flex items-center"
            >
              Show all
              <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {featuredGroups.map((group) => (
              <div
                key={group.id}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-4xl hover:bg-gray-200 transition-colors">
                  {group.image}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 group-hover:underline">
                      {group.name}
                    </h3>
                    {group.trending && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        Trending
                      </span>
                    )}
                    {group.isLocal && (
                      <MapPin className="text-gray-400" size={14} />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{group.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{group.members} members</span>
                    <span className="text-gray-500">{group.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="border-t border-gray-200 pt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Tips for authentic connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="text-gray-600" size={14} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Be genuine</h3>
                  <p className="text-gray-600">
                    Share your real thoughts and experiences. Authenticity creates lasting connections.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="text-gray-600" size={14} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Engage actively</h3>
                  <p className="text-gray-600">
                    Comment, like, and participate in discussions. Engagement unlocks direct messaging.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="text-gray-600" size={14} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Join local groups</h3>
                  <p className="text-gray-600">
                    Find people in your city for real-world meetups and activities.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="text-gray-600" size={14} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Stay consistent</h3>
                  <p className="text-gray-600">
                    Regular participation keeps communities active and relationships growing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnonymousJourneyModal 
        open={showAnonymousModal} 
        onClose={handleCloseAnonymousModal} 
      />
    </div>
  );
};

export default Dashboard;
