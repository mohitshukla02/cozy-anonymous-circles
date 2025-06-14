
import React, { useState } from 'react';
import { User, Calendar, Settings, Shield, Trash2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Profile = () => {
  const { user, updatePreferences, logout } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const joinDate = new Date(user.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDeleteAccount = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.username}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar size={16} />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">0</div>
            <div className="text-gray-600">Groups Joined</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="text-gray-600">Connections Made</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-gray-600">Messages Sent</div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="text-amber-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <h3 className="font-semibold text-gray-800">Theme Preference</h3>
                <p className="text-sm text-gray-600">Choose your preferred theme</p>
              </div>
              <select
                value={user.preferences.theme}
                onChange={(e) => updatePreferences({ theme: e.target.value as 'light' | 'dark' })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
              <button className="px-4 py-2 text-amber-600 hover:text-amber-700 transition-colors">
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="text-green-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Privacy & Security</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-2xl">
              <h3 className="font-semibold text-green-800 mb-2">Your Privacy is Protected</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• No personal information stored</li>
                <li>• No photos or real name required</li>
                <li>• Anonymous by design</li>
                <li>• Data stays encrypted</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl">
              <h3 className="font-semibold text-amber-800 mb-2">Username: {user.username}</h3>
              <p className="text-sm text-amber-700">
                Your randomly generated username is your only identifier. Keep it safe!
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Trash2 className="text-red-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Danger Zone</h2>
          </div>

          <div className="p-6 border border-red-200 rounded-2xl">
            <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
            <p className="text-sm text-red-600 mb-4">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-red-700 font-medium">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete Forever
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
