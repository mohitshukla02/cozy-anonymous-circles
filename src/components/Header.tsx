
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Home, Users, Rss, Bell, MessageCircle, UserPlus, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import UserAvatar from '@/components/UserAvatar';
import InviteUserModal from '@/components/InviteUserModal';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useInvitations } from '@/hooks/useInvitations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { remainingInvites } = useInvitations();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Mock notification and message states - replace with real data later
  const [hasNewNotifications] = useState(true);
  const [hasNewMessages] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  
  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
  };

  // Get username from profile or user metadata
  const username = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'User';

  // Mock notifications - replace with real data later
  const notifications = [{
    id: 1,
    title: 'New group invitation',
    message: 'You were invited to join "Book Lovers"',
    time: '2 min ago'
  }, {
    id: 2,
    title: 'Post liked',
    message: 'Someone liked your post about hiking',
    time: '1 hour ago'
  }, {
    id: 3,
    title: 'Group activity',
    message: 'New posts in "Photography Circle"',
    time: '3 hours ago'
  }];

  // Mock messages - replace with real data later
  const messages = [{
    id: 1,
    sender: 'Sarah',
    message: 'Hey, are you coming to the meetup?',
    time: '30 min ago'
  }, {
    id: 2,
    sender: 'Mike',
    message: 'Thanks for the book recommendation!',
    time: '2 hours ago'
  }];

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={16} />;
      case 'dark':
        return <Moon size={16} />;
      case 'system':
        return <Monitor size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  const NotificationsContent = () => (
    <div className="p-4">
      <h3 className="font-semibold text-sm mb-3">Notifications</h3>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
            <div className="font-medium text-sm">{notification.title}</div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">{notification.message}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );

  const MessagesContent = () => (
    <div className="p-4">
      <h3 className="font-semibold text-sm mb-3">Messages</h3>
      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
              <div className="font-medium text-sm">{message.sender}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{message.message}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{message.time}</div>
            </div>
          ))
        ) : (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">No new messages</div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Link to="/messages" className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium">
          View all messages
        </Link>
      </div>
    </div>
  );

  const ProfileContent = () => (
    <div className="p-4">
      <div className="flex items-center space-x-3 mb-4">
        <UserAvatar size="lg" />
        <div>
          <div className="font-medium text-sm">{username}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full">
          <User size={16} />
          <span>View Profile</span>
        </Link>
        
        <InviteUserModal 
          remainingInvites={remainingInvites}
          trigger={
            <button className="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full">
              <UserPlus size={16} />
              <span>Invite Friends</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {remainingInvites}
              </Badge>
            </button>
          }
        />

        {/* Theme Selector */}
        <div className="px-2 py-3">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Theme</div>
          <div className="flex items-center space-x-1">
            <Button
              variant={theme === 'light' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex-1 justify-center"
            >
              <Sun size={14} />
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex-1 justify-center"
            >
              <Moon size={14} />
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme('system')}
              className="flex-1 justify-center"
            >
              <Monitor size={14} />
            </Button>
          </div>
        </div>
        
        <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-3 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                <img src="/lovable-uploads/ef93a52d-7a19-46ab-9703-c60bf1cfdcd7.png" alt="Convene Logo" className="w-6 h-6" />
              </div>
              <span className="font-medium text-xl">Convene</span>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              <Link to="/dashboard" className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                isActive('/dashboard') 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}>
                <Home size={16} />
                <span>Home</span>
              </Link>
              
              <Link to="/groups" className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                isActive('/groups') 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}>
                <Users size={16} />
                <span>Groups</span>
              </Link>
              
              <Link to="/feed" className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                isActive('/feed') 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}>
                <Rss size={16} />
                <span>Feed</span>
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {/* Notifications */}
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <button className="relative p-3 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Notifications">
                  <Bell size={18} />
                  {hasNewNotifications && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                <NotificationsContent />
              </HoverCardContent>
            </HoverCard>
            
            {/* Messages */}
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Link to="/messages" className={`relative p-3 rounded-full transition-colors ${
                  isActive('/messages') 
                    ? 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`} title="Messages">
                  <MessageCircle size={18} />
                  {hasNewMessages && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                <MessagesContent />
              </HoverCardContent>
            </HoverCard>
            
            {/* User Profile */}
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <UserAvatar size="md" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                <ProfileContent />
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-3">
          <nav className="flex justify-around items-center">
            <Link to="/dashboard" className={`p-3 rounded-full transition-colors ${
              isActive('/dashboard') ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <Home size={20} />
            </Link>
            <Link to="/groups" className={`p-3 rounded-full transition-colors ${
              isActive('/groups') ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <Users size={20} />
            </Link>
            <Link to="/feed" className={`p-3 rounded-full transition-colors ${
              isActive('/feed') ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <Rss size={20} />
            </Link>
            
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-3 rounded-full text-gray-500 dark:text-gray-400 relative">
                  <Bell size={20} />
                  {hasNewNotifications && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="center" side="top" sideOffset={12} className="w-[calc(100vw-2rem)] max-w-sm p-0 mb-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl">
                <NotificationsContent />
              </PopoverContent>
            </Popover>

            <Link to="/messages" className={`p-3 rounded-full transition-colors relative ${
              isActive('/messages') ? 'text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <MessageCircle size={20} />
              {hasNewMessages && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </Link>

            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1 rounded-full">
                  <UserAvatar size="md" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" side="top" sideOffset={12} className="w-[calc(100vw-2rem)] max-w-xs p-0 mb-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl">
                <ProfileContent />
              </PopoverContent>
            </Popover>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
