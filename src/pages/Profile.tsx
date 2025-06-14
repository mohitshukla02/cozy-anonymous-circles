
import React, { useState } from 'react';
import { User, Calendar, Settings, Shield, Trash2, Tag, Edit3, Users, MessageCircle, UserPlus, Key, Bell, Globe, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TAG_CATEGORIES } from '../types/tags';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import UserAvatar from '../components/UserAvatar';
import { useUserProfile } from '@/hooks/useUserProfile';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useUserProfile();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  console.log('User data in Profile:', user);
  console.log('Profile data:', profile);

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDeleteAccount = () => {
    signOut();
  };

  const handleEditTags = () => {
    navigate('/tag-onboarding', { state: { from: 'profile' } });
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

  const username = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <UserAvatar size="xl" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{username}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar size={16} />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Groups Joined</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Connections Made</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">Messages Sent</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Interests Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Your Interests</h2>
              </div>
              <Button variant="outline" size="sm" onClick={handleEditTags}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            {profile?.selected_tags && profile.selected_tags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {profile.selected_tags.map((tagId) => {
                  const tagName = getTagName(tagId);
                  return (
                    <Badge key={tagId} variant="secondary" className="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {tagName}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
                <Tag className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No interests selected yet</p>
                <Button onClick={handleEditTags}>
                  Choose Your Interests
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Account Settings */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified about new messages and group activities</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Public Profile</h3>
                    <p className="text-sm text-gray-500">Allow others to see your profile and interests</p>
                  </div>
                </div>
                <Switch 
                  checked={publicProfile} 
                  onCheckedChange={setPublicProfile}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Theme</h3>
                    <p className="text-sm text-gray-500">Choose your preferred theme</p>
                  </div>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-500">Change your account password</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                  Change Password
                </Button>
              </div>

              {showPasswordChange && (
                <div className="ml-8 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div className="flex space-x-3">
                    <Button size="sm">Update Password</Button>
                    <Button variant="outline" size="sm" onClick={() => setShowPasswordChange(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Privacy & Security */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Your Privacy is Protected
                </h3>
                <ul className="text-sm text-green-700 space-y-2">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-3"></div>
                    No personal information stored
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-3"></div>
                    No photos or real name required
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-3"></div>
                    Anonymous by design
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-3"></div>
                    Data stays encrypted
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Your Username: {username}
                </h3>
                <p className="text-sm text-blue-700">
                  Your username is your only identifier. Keep it safe and memorable!
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Danger Zone</h2>
            </div>

            <div className="p-6 border border-red-200 rounded-lg bg-red-50">
              <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
              <p className="text-sm text-red-600 mb-4">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-red-700 font-medium">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Yes, Delete Forever
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
