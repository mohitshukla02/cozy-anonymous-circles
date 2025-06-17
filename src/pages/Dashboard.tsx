import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Users, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import CreateGroupModal from '@/components/CreateGroupModal';
import { useGroupsData } from '@/hooks/useGroupsData';
import MeetupMap from '@/components/MeetupMap';
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const {
    profile
  } = useUserProfile();
  const {
    userGroups,
    handleGroupCreated
  } = useGroupsData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleGroupCreatedAndClose = async (groupData: {
    name: string;
    description: string;
    tags: string[];
    memberLimit: number;
    privacy: 'open' | 'invitation';
    type: 'interest' | 'local-meetup';
    location?: {
      city: string;
      region: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
  }) => {
    await handleGroupCreated(groupData);
    setShowCreateModal(false);
  };
  if (!user) return null;
  const username = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'User';

  // Featured Groups
  const featuredGroups = [{
    id: 1,
    name: "Local Photographers",
    image: "/lovable-uploads/512e664e-f0ea-41a9-8dcf-c6d80845a703.png",
    members: 127,
    location: "Hyderabad, Telangana"
  }, {
    id: 2,
    name: "Weekend Hikers",
    image: "/lovable-uploads/607699cd-7553-4f8d-ad9e-469b40624b13.png",
    members: 89,
    location: "Hyderabad, Telangana"
  }, {
    id: 3,
    name: "Chai & Conversations",
    image: "/lovable-uploads/f1943dbb-6789-48c9-bb11-8214c2c246b7.png",
    members: 203,
    location: "Hyderabad, Telangana"
  }, {
    id: 4,
    name: "Urban Gardeners",
    image: "/lovable-uploads/6e18371c-1606-4423-a38e-e1ca52624fa8.png",
    members: 142,
    location: "Hyderabad, Telangana"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-50/30 to-neutral-100/30 dark:bg-gradient-dark pt-20 py-0 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-neutral-900 text-3xl font-normal">
            Welcome back, {username}
          </h1>
          <p className="text-neutral-500">
            Discover groups and connect with people who share your interests
          </p>
        </div>

        {/* Local Meetups Section with Map */}
        <div className="mb-12">
          <MeetupMap />
        </div>

        {/* Featured Groups */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 py-[24px]">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Featured groups</h2>
              <p className="text-neutral-600 dark:text-neutral-400">Popular communities in your area</p>
            </div>
            <Link to="/groups">
              <Button variant="outline" className="dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700">
                Show all
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {featuredGroups.map(group => <div key={group.id} className="group bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md dark:hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">{group.name}</h3>
                  <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    <MapPin size={14} className="mr-1" />
                    {group.location}
                  </div>
                  <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                    <Users size={14} className="mr-1" />
                    {group.members} members
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Your Groups</h3>
              <Badge variant="secondary" className="dark:bg-neutral-700 dark:text-neutral-300">
                {userGroups.length}
              </Badge>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              {userGroups.length > 0 ? 'Manage your communities and stay connected' : 'Join your first community to get started'}
            </p>
            <Link to="/groups">
              <Button variant="outline" className="w-full dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700">
                <Users size={16} className="mr-2" />
                {userGroups.length > 0 ? 'View Groups' : 'Discover Groups'}
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Create Community</h3>
              <Plus size={20} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
              Start a new group and bring people together around shared interests
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-600 dark:hover:bg-neutral-500 text-white">
              <Plus size={16} className="mr-2" />
              Create Group
            </Button>
          </div>
        </div>

        {/* Create Group Modal */}
        {showCreateModal && <CreateGroupModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={handleGroupCreatedAndClose} userTags={profile?.selected_tags || []} userLocation={profile?.location_city && profile?.location_region ? {
        city: profile.location_city,
        region: profile.location_region,
        coordinates: profile.location_coordinates
      } : undefined} />}
      </div>
    </div>;
};
export default Dashboard;