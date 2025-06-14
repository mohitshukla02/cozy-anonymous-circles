
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  joinDate: string;
  selectedTags: string[];
  hasCompletedOnboarding: boolean;
  preferences: {
    theme: 'light' | 'dark';
  };
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  updateTags: (tags: string[]) => void;
  completeOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('cozyUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cozyUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cozyUser');
  };

  const updatePreferences = (newPreferences: Partial<User['preferences']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...newPreferences }
      };
      setUser(updatedUser);
      localStorage.setItem('cozyUser', JSON.stringify(updatedUser));
    }
  };

  const updateTags = (tags: string[]) => {
    if (user) {
      const updatedUser = {
        ...user,
        selectedTags: tags
      };
      setUser(updatedUser);
      localStorage.setItem('cozyUser', JSON.stringify(updatedUser));
    }
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = {
        ...user,
        hasCompletedOnboarding: true
      };
      setUser(updatedUser);
      localStorage.setItem('cozyUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updatePreferences, 
      updateTags, 
      completeOnboarding 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
