import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import NotificationBell from './meetup/NotificationBell';
const Header = () => {
  const {
    user,
    signOut
  } = useAuth();
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    profile
  } = useUserProfile();
  return <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/lovable-uploads/ef93a52d-7a19-46ab-9703-c60bf1cfdcd7.png" alt="Convene Logo" className="w-6 h-6 object-scale-down" />
          </div>
          <span className="text-lg font-semibold text-inherit">Convene</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/groups" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            Groups
          </Link>
          <Link to="/feed" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            Feed
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Link to="/messages">
                <MessageSquare size={18} />
              </Link>
            </Button>
            
            <NotificationBell />
          </div>
          
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light mode
                    </> : <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark mode
                    </>}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <>
              <Link to="/login" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Log In
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-10 px-4 py-2">
                Register
              </Link>
            </>}
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90" /> : <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;