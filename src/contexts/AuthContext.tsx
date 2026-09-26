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
      setProfile({
        id: 'demo-profile',
        userId,
        email: 'admin@swapp.ai',
        fullName: 'Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        setProfile({
          id: 'demo-profile',
          userId,
          email: 'admin@swapp.ai',
          fullName: 'Admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
        return;
      }

      setProfile({
        id: data.id,
        userId: data.user_id,
        email: data.email || '',
        fullName: data.full_name || '',
        avatarUrl: data.avatar_url,
        role: (data.role || 'user') as UserRole,
        createdAt: data.created_at,
      });
    } catch {
      setProfile({
        id: 'demo-profile',
        userId,
        email: 'admin@swapp.ai',
        fullName: 'Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check saved demo user or default to demo admin
      const saved = localStorage.getItem('swapp_demo_user');
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch {
          setProfile({
            id: 'demo-profile',
            userId: 'demo-admin-id',
            email: 'admin@swapp.ai',
            fullName: 'Demo Admin',
            role: 'admin',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setProfile({
          id: 'demo-profile',
          userId: 'demo-admin-id',
          email: 'admin@swapp.ai',
          fullName: 'Demo Admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
      }
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

  const signInAsDemo = (role: 'admin' | 'user' = 'admin') => {
    const demoProfile: UserProfile = {
      id: 'demo-profile-' + role,
      userId: 'demo-' + role + '-id',
      email: `${role}@swapp.ai`,
      fullName: role === 'admin' ? 'Demo Admin' : 'Demo Creator',
      role: role,
      createdAt: new Date().toISOString(),
    };
    setProfile(demoProfile);
    localStorage.setItem('swapp_demo_user', JSON.stringify(demoProfile));
  };

  const signOut = async () => {
    localStorage.removeItem('swapp_demo_user');
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
        signInAsDemo,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
