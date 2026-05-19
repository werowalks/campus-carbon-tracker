import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'super_admin' | 'admin' | 'user';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: AppRole;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Fetch role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.error('Error fetching role:', roleError);
      }

      const userProfile: UserProfile = {
        id: profileData.id,
        user_id: profileData.user_id,
        email: profileData.email,
        name: profileData.name,
        role: (roleData?.role as AppRole) || 'user',
        avatar_url: profileData.avatar_url || null,
      };

      return userProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then((profile) => {
          setProfile(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setProfile(profile);
      }

      return { success: true };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('register-user', {
        body: {
          email: email.trim(),
          password,
          name: name.trim(),
        },
      });

      // When the edge function returns non-2xx, supabase-js wraps it in FunctionsHttpError
      // and the actual JSON body is on error.context. Parse it to surface real messages.
      if (error) {
        console.error('Registration error:', error);
        let serverMessage: string | undefined;
        try {
          const ctx: any = (error as any).context;
          if (ctx && typeof ctx.json === 'function') {
            const body = await ctx.json();
            serverMessage = body?.error;
          } else if (ctx && typeof ctx.text === 'function') {
            const text = await ctx.text();
            try { serverMessage = JSON.parse(text)?.error; } catch { serverMessage = text; }
          }
        } catch (e) {
          console.error('Failed to parse error body:', e);
        }
        return { success: false, error: serverMessage || error.message };
      }

      if (!data?.success) {
        return { success: false, error: data?.error || 'Registration failed' };
      }

      return { success: true, error: data.message || 'Please check your email to confirm your account.' };
    } catch (error) {
      console.error('Unexpected registration error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        profile,
        isAuthenticated: !!user, 
        isLoading, 
        isAdmin: profile?.role === 'admin',
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
