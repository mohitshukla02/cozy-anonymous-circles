
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
        
        // If user just signed in with Reddit, fetch their subreddits
        if (event === 'SIGNED_IN' && session?.user?.app_metadata?.provider === 'reddit') {
          setTimeout(() => {
            fetchRedditData(session.user);
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

  const fetchRedditData = async (user: User) => {
    try {
      // Extract Reddit access token from user metadata
      const redditToken = user.user_metadata?.provider_token;
      if (!redditToken) return;

      // Fetch user's subreddits
      const subredditsResponse = await fetch('https://oauth.reddit.com/subreddits/mine/subscriber', {
        headers: {
          'Authorization': `Bearer ${redditToken}`,
          'User-Agent': 'CozyCircles/1.0'
        }
      });

      if (subredditsResponse.ok) {
        const subredditsData = await subredditsResponse.json();
        
        // Extract subreddit names and convert to tags
        const subredditTags = subredditsData.data?.children?.map((sub: any) => 
          sub.data.display_name.toLowerCase()
        ).slice(0, 20) || []; // Limit to first 20 subreddits

        // Fetch user info for karma
        const userResponse = await fetch('https://oauth.reddit.com/api/v1/me', {
          headers: {
            'Authorization': `Bearer ${redditToken}`,
            'User-Agent': 'CozyCircles/1.0'
          }
        });

        let karma = 0;
        if (userResponse.ok) {
          const userData = await userResponse.json();
          karma = (userData.link_karma || 0) + (userData.comment_karma || 0);
        }

        // Update user profile with Reddit data
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const profileData = {
          user_id: user.id,
          username: user.user_metadata?.user_name || user.user_metadata?.name || 'RedditUser',
          selected_tags: subredditTags,
          reddit_karma: karma,
          updated_at: new Date().toISOString()
        };

        if (existingProfile) {
          await supabase
            .from('user_profiles')
            .update(profileData)
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('user_profiles')
            .insert([profileData]);
        }

        console.log('Reddit data synced:', { subredditTags, karma });
      }
    } catch (error) {
      console.error('Error fetching Reddit data:', error);
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
