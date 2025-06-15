
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import MessagingInterface from '../components/messaging/MessagingInterface';

const Messages = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Sign in to view messages</h2>
          <p className="text-muted-foreground">You need to be signed in to access your messages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Chat with other group members you've interacted with
          </p>
        </div>
        
        <MessagingInterface />
      </div>
    </div>
  );
};

export default Messages;
