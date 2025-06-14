
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
    for (const category of TAG_CATEGORIES) {
      const tag = category.tags.find(t => t.id === tagId);
      if (tag) return tag.name;
    }
    return tagId;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-200 h-24 rounded-lg"></div>
            <div className="bg-gray-200 h-32 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const username = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-8">
          <UserAvatar size="xl" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{username}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              <Calendar size={14} />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Groups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">0</div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Interests Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Your Interests</h2>
              <Button variant="outline" size="sm" onClick={handleEditTags}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            {profile?.selected_tags && profile.selected_tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.selected_tags.map((tagId) => {
                  const tagName = getTagName(tagId);
                  return (
                    <Badge key={tagId} variant="secondary" className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {tagName}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <Tag className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No interests selected yet</p>
                <Button onClick={handleEditTags} size="sm">
                  Choose Your Interests
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Account Settings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-6">Account Settings</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Get notified about new messages and activities</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Public Profile</h3>
                  <p className="text-sm text-gray-500">Allow others to see your profile and interests</p>
                </div>
                <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Theme</h3>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500">Change your account password</p>
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
                <div className="ml-6 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
            <h2 className="text-lg font-medium text-gray-900 mb-6">Privacy & Security</h2>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-3 flex items-center text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Your Privacy is Protected
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• No personal information stored</li>
                  <li>• No photos or real name required</li>
                  <li>• Anonymous by design</li>
                  <li>• Data stays encrypted</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center text-sm">
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
            <h2 className="text-lg font-medium text-gray-900 mb-6">Danger Zone</h2>

            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h3 className="font-medium text-red-800 mb-2 text-sm">Delete Account</h3>
              <p className="text-sm text-red-600 mb-4">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-700 font-medium">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                      Yes, Delete Forever
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
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
