
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Home, Users, Rss, Bell, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
  };

  // Get username from user metadata or email
  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center space-x-2 text-gray-800 hover:text-amber-600 transition-colors">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="font-semibold text-base">Circles</span>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  isActive('/dashboard') 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50/50'
                }`}
              >
                <Home size={16} />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/groups" 
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  isActive('/groups') 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50/50'
                }`}
              >
                <Users size={16} />
                <span>Groups</span>
              </Link>
              
              <Link 
                to="/feed" 
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  isActive('/feed') 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50/50'
                }`}
              >
                <Rss size={16} />
                <span>Feed</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 hidden sm:block mr-3">
              <span className="font-medium text-gray-700">{username}</span>
            </span>
            
            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg text-gray-500 hover:text-amber-700 hover:bg-amber-50/50 transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>
            
            {/* Messages */}
            <Link
              to="/messages"
              className={`relative p-2 rounded-lg transition-colors ${
                isActive('/messages')
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-gray-500 hover:text-amber-700 hover:bg-amber-50/50'
              }`}
              title="Messages"
            >
              <MessageCircle size={18} />
              {/* Message badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-xs"></span>
            </Link>
            
            <Link 
              to="/profile" 
              className="p-2 rounded-lg text-gray-500 hover:text-amber-700 hover:bg-amber-50/50 transition-colors"
              title="Profile"
            >
              <User size={18} />
            </Link>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <nav className="flex justify-around">
            <Link to="/dashboard" className={`p-2 rounded-lg transition-colors ${isActive('/dashboard') ? 'text-amber-700' : 'text-gray-500'}`}>
              <Home size={18} />
            </Link>
            <Link to="/groups" className={`p-2 rounded-lg transition-colors ${isActive('/groups') ? 'text-amber-700' : 'text-gray-500'}`}>
              <Users size={18} />
            </Link>
            <Link to="/feed" className={`p-2 rounded-lg transition-colors ${isActive('/feed') ? 'text-amber-700' : 'text-gray-500'}`}>
              <Rss size={18} />
            </Link>
            <button className="p-2 rounded-lg text-gray-500 relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/messages" className={`p-2 rounded-lg transition-colors relative ${isActive('/messages') ? 'text-amber-700' : 'text-gray-500'}`}>
              <MessageCircle size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
