import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, username: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signInWithReddit: () => Promise<{ error?: any }>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // If user just signed in with Reddit, trigger backend sync
        if (event === 'SIGNED_IN' && session?.user?.app_metadata?.provider === 'reddit') {
          setTimeout(() => {
            syncRedditBackend(session.user);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Replace frontend Reddit API with edge function
  const syncRedditBackend = async (user: User) => {
    try {
      const redditToken = user.user_metadata?.provider_token;
      if (!redditToken) return;
      // Call secure edge function
      const response = await fetch('https://sbvcdbbdstnlzycbkjxh.supabase.co/functions/v1/sync-reddit-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          reddit_token: redditToken,
          user_metadata: user.user_metadata
        }),
      });
      if (!response.ok) throw new Error('Failed to sync Reddit data');
      const data = await response.json();
      console.log('Reddit data synced via edge:', data);
    } catch (err: any) {
      console.error('syncReddit error', err);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signInWithReddit = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'reddit' as any,
      options: {
        scopes: 'identity read mysubreddits',
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signUp, 
      signIn, 
      signInWithReddit,
      signInWithGoogle,
      signOut, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
