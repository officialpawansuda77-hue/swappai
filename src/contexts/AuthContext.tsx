import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInAsDemo: (role?: 'admin' | 'user') => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  loading: true,
  isConfigured: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signInAsDemo: () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        setProfile({
          id: data.id,
          userId: data.user_id,
          email: data.email || '',
          fullName: data.full_name || '',
          avatarUrl: data.avatar_url,
          role: (data.role || 'user') as UserRole,
          createdAt: data.created_at,
        });
        return;
      }

      // If profile row not in database yet (e.g. freshly signed in via Google OAuth)
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      if (currentUser && currentUser.id === userId) {
        const fullName =
          currentUser.user_metadata?.full_name ||
          currentUser.user_metadata?.name ||
          currentUser.email?.split('@')[0] ||
          'Creator';
        const avatarUrl =
          currentUser.user_metadata?.avatar_url ||
          currentUser.user_metadata?.picture ||
          undefined;

        // Try upserting into profiles table
        try {
          await supabase.from('profiles').upsert(
            {
              user_id: currentUser.id,
              email: currentUser.email,
              full_name: fullName,
              avatar_url: avatarUrl,
              role: 'user',
            },
            { onConflict: 'user_id' }
          );
        } catch {
          // ignore if table error
        }

        setProfile({
          id: currentUser.id,
          userId: currentUser.id,
          email: currentUser.email || '',
          fullName,
          avatarUrl,
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    // Purge any legacy demo user from browser storage
    try {
      localStorage.removeItem('swapp_demo_user');
    } catch {
      // ignore
    }

    if (!isSupabaseConfigured) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Get initial session with Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    }).catch(() => {
      setProfile(null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error(
          'Supabase .env file configured nahi hai. Kripya root directory me .env file banayein aur VITE_SUPABASE_URL aur VITE_SUPABASE_ANON_KEY dalein, ya "Demo Mode" use karein.'
        ),
      };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: (error as Error) || null };
    } catch (err: unknown) {
      return { error: (err as Error) || new Error('Network error') };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error(
          'Supabase .env file configured nahi hai. Kripya .env me VITE_SUPABASE_URL aur VITE_SUPABASE_ANON_KEY dalein.'
        ),
      };
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName || '' } },
      });
      return { error: (error as Error) || null };
    } catch (err: unknown) {
      return { error: (err as Error) || new Error('Registration failed') };
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error(
          'Supabase .env file configured nahi hai. Kripya root directory me .env file banayein aur VITE_SUPABASE_URL aur VITE_SUPABASE_ANON_KEY dalein.'
        ),
      };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });
      return { error: (error as Error) || null };
    } catch (err: unknown) {
      return { error: (err as Error) || new Error('Google sign-in initiation failed') };
    }
  };

  const signInAsDemo = () => {
    // Disabled in production
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('swapp_demo_user');
    } catch {
      // ignore
    }
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        signInAsDemo,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
