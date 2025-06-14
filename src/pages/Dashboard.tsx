import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Heart, MessageCircle, MapPin, Star, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import AnonymousJourneyModal from '../components/AnonymousJourneyModal';
import MeetupMap from '../components/MeetupMap';

const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    profile
  } = useUserProfile();
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
  const featuredGroups = [{
    id: 1,
    name: "Local Photographers",
    description: "Capturing moments around the city",
    members: 127,
    category: "Creative Arts",
    isLocal: true,
    trending: true,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop"
  }, {
    id: 2,
    name: "Weekend Hikers",
    description: "Exploring trails every Saturday",
    members: 89,
    category: "Sports & Outdoors",
    isLocal: true,
    trending: false,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop"
  }, {
    id: 3,
    name: "Book Club Enthusiasts",
    description: "Monthly discussions on great reads",
    members: 156,
    category: "Intellectual",
    isLocal: false,
    trending: true,
    image: "/lovable-uploads/a4d455b6-8ac7-4a26-b964-a285922f9f53.png"
  }, {
    id: 4,
    name: "Coffee & Conversations",
    description: "Weekly meetups at local cafes",
    members: 203,
    category: "Lifestyle",
    isLocal: true,
    trending: false,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
  }];
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const hasSelectedInterests = profile?.selected_tags && profile.selected_tags.length > 0;
  return <div className="min-h-screen bg-white pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Welcome back, {username}
          </h1>
          <p className="text-gray-600">
            Discover groups and connect with people who share your interests
          </p>
        </div>

        {/* Onboarding Banner */}
        {!hasSelectedInterests && <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-12">
            <div className="max-w-2xl">
              <h2 className="text-xl font-medium mb-2">Complete your profile</h2>
              <p className="text-gray-600 mb-4">
                Tell us about your interests to get personalized group recommendations
              </p>
              <Link to="/tag-onboarding" className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Get started
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>}

        {/* Meetup Map */}
        <div className="mb-16">
          <MeetupMap />
        </div>

        {/* Featured Groups */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-1">Featured groups</h2>
              <p className="text-gray-600 text-sm">Popular communities in your area</p>
            </div>
            <Link to="/groups" className="text-gray-900 font-medium hover:underline flex items-center text-sm">
              Show all
              <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGroups.map(group => <div key={group.id} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-3 overflow-hidden">
                  <img src={group.image} alt={group.name} className="w-full h-full group-hover:scale-105 transition-transform duration-200 object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 group-hover:underline text-sm">
                      {group.name}
                    </h3>
                    {group.trending && <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        Trending
                      </span>}
                    {group.isLocal && <MapPin className="text-gray-400" size={12} />}
                  </div>
                  <p className="text-gray-600 text-xs">{group.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{group.members} members</span>
                    <span className="text-gray-500">{group.category}</span>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Getting Started */}
        <div className="border-t border-gray-200 pt-16">
          <h2 className="text-xl font-medium text-gray-900 mb-8">Tips for authentic connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Heart className="text-red-500" size={20} fill="currentColor" />
                </div>
                <div className="flex-1 min-h-[80px] flex flex-col justify-center">
                  <h3 className="font-medium text-gray-900 mb-1">Be genuine</h3>
                  <p className="text-gray-600 text-sm">
                    Share your real thoughts and experiences. Authenticity creates lasting connections.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="text-blue-500" size={20} />
                </div>
                <div className="flex-1 min-h-[80px] flex flex-col justify-center">
                  <h3 className="font-medium text-gray-900 mb-1">Engage actively</h3>
                  <p className="text-gray-600 text-sm">
                    Comment, like, and participate in discussions. Engagement unlocks direct messaging.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-yellow-500" size={20} />
                </div>
                <div className="flex-1 min-h-[80px] flex flex-col justify-center">
                  <h3 className="font-medium text-gray-900 mb-1">Join local groups</h3>
                  <p className="text-gray-600 text-sm">
                    Find people in your city for real-world meetups and activities.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-green-500" size={20} />
                </div>
                <div className="flex-1 min-h-[80px] flex flex-col justify-center">
                  <h3 className="font-medium text-gray-900 mb-1">Stay consistent</h3>
                  <p className="text-gray-600 text-sm">
                    Regular participation keeps communities active and relationships growing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnonymousJourneyModal open={showAnonymousModal} onClose={handleCloseAnonymousModal} />
    </div>;
};

export default Dashboard;
