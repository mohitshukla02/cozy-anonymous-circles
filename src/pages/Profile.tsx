import React, { useState } from 'react';
import { User, Calendar, Settings, Shield, Trash2, Tag, Edit3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TAG_CATEGORIES } from '../types/tags';
import { Badge } from '../components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useUserProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  console.log('User data in Profile:', user);
  console.log('Profile data:', profile);
  console.log('Selected tags:', profile?.selected_tags);

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDeleteAccount = () => {
    signOut();
  };

  const handleEditTags = () => {
    navigate('/tag-onboarding');
  };

  const getTagName = (tagId: string) => {
    console.log('Looking for tag ID:', tagId);
    for (const category of TAG_CATEGORIES) {
      const tag = category.tags.find(t => t.id === tagId);
      if (tag) {
        console.log('Found tag:', tag.name);
        return tag.name;
      }
    }
    console.log('Tag not found for ID:', tagId);
    return tagId;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-gray-800 mb-1">
                {profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous'}
              </h1>
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar size={14} />
                <span className="text-xs">Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Tag className="text-blue-600" size={18} />
              <h2 className="text-lg font-heading font-bold text-gray-800">Your Interests</h2>
            </div>
            <button
              onClick={handleEditTags}
              className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-xs"
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          </div>

          {profile?.selected_tags && profile.selected_tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.selected_tags.map((tagId) => {
                const tagName = getTagName(tagId);
                return (
                  <Badge key={tagId} variant="secondary" className="px-2 py-1 text-xs">
                    {tagName}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-3 text-xs">No interests selected yet</p>
              <button
                onClick={handleEditTags}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
              >
                Choose Your Interests
              </button>
            </div>
          )}
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 mb-1">0</div>
            <div className="text-gray-500 text-xs">Groups Joined</div>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">0</div>
            <div className="text-gray-500 text-xs">Connections Made</div>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
            <div className="text-gray-500 text-xs">Messages Sent</div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="text-blue-600" size={18} />
            <h2 className="text-lg font-heading font-bold text-gray-800">Account Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Theme Preference</h3>
                <p className="text-xs text-gray-500">Choose your preferred theme</p>
              </div>
              <select
                value="light"
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                <p className="text-xs text-gray-500">Manage your notification preferences</p>
              </div>
              <button className="px-3 py-1.5 text-blue-600 hover:text-blue-700 transition-colors text-xs">
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="text-green-600" size={18} />
            <h2 className="text-lg font-heading font-bold text-gray-800">Privacy & Security</h2>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <h3 className="font-semibold text-green-800 mb-2 text-sm">Your Privacy is Protected</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• No personal information stored</li>
                <li>• No photos or real name required</li>
                <li>• Anonymous by design</li>
                <li>• Data stays encrypted</li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 rounded-xl">
              <h3 className="font-semibold text-yellow-800 mb-1 text-sm">
                Username: {profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous'}
              </h3>
              <p className="text-xs text-yellow-700">
                Your username is your only identifier. Keep it safe!
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Trash2 className="text-red-600" size={18} />
            <h2 className="text-lg font-heading font-bold text-gray-800">Danger Zone</h2>
          </div>

          <div className="p-4 border border-red-200 rounded-xl">
            <h3 className="font-semibold text-red-800 mb-2 text-sm">Delete Account</h3>
            <p className="text-xs text-red-600 mb-3">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-red-700 font-medium">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
                  >
                    Yes, Delete Forever
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
