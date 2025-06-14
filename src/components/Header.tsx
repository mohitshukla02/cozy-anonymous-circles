
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Home, Users, MessageCircle, Rss } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Header = () => {
  const { user, logout } = useUser();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-amber-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2 text-amber-800 hover:text-amber-900 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-lg">Cozy Circles</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-amber-50 text-amber-800' 
                    : 'text-gray-600 hover:text-amber-800 hover:bg-amber-50'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/groups" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/groups') 
                    ? 'bg-amber-50 text-amber-800' 
                    : 'text-gray-600 hover:text-amber-800 hover:bg-amber-50'
                }`}
              >
                <Users size={18} />
                <span>Groups</span>
              </Link>
              
              <Link 
                to="/feed" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/feed') 
                    ? 'bg-amber-50 text-amber-800' 
                    : 'text-gray-600 hover:text-amber-800 hover:bg-amber-50'
                }`}
              >
                <Rss size={18} />
                <span>Feed</span>
              </Link>
              
              <Link 
                to="/messages" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/messages') 
                    ? 'bg-amber-50 text-amber-800' 
                    : 'text-gray-600 hover:text-amber-800 hover:bg-amber-50'
                }`}
              >
                <MessageCircle size={18} />
                <span>Messages</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Welcome, <span className="font-medium text-amber-800">{user.username}</span>
            </span>
            
            <Link 
              to="/profile" 
              className="p-2 rounded-lg text-gray-600 hover:text-amber-800 hover:bg-amber-50 transition-colors"
            >
              <User size={20} />
            </Link>
            
            <button
              onClick={logout}
              className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-amber-100 py-2">
          <nav className="flex justify-around">
            <Link to="/dashboard" className={`p-2 rounded-lg ${isActive('/dashboard') ? 'text-amber-800' : 'text-gray-600'}`}>
              <Home size={20} />
            </Link>
            <Link to="/groups" className={`p-2 rounded-lg ${isActive('/groups') ? 'text-amber-800' : 'text-gray-600'}`}>
              <Users size={20} />
            </Link>
            <Link to="/feed" className={`p-2 rounded-lg ${isActive('/feed') ? 'text-amber-800' : 'text-gray-600'}`}>
              <Rss size={20} />
            </Link>
            <Link to="/messages" className={`p-2 rounded-lg ${isActive('/messages') ? 'text-amber-800' : 'text-gray-600'}`}>
              <MessageCircle size={20} />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
