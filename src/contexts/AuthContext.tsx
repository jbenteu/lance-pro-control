
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  userRole: string | null;
  roleLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check user roles based on the database
  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      setRoleLoading(true);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        // Check if user is the hardcoded superadmin
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user?.email === 'joaobenteu@sistema.com') {
          console.log('Setting hardcoded superadmin role');
          setUserRole('superadmin');
        } else {
          setUserRole('user'); // Default role
        }
        setRoleLoading(false);
        return;
      }

      console.log('User role fetched:', data?.role);
      setUserRole(data?.role || 'user');
      setRoleLoading(false);
    } catch (err) {
      console.error('Exception fetching user role:', err);
      // Check if user is the hardcoded superadmin
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user?.email === 'joaobenteu@sistema.com') {
        console.log('Setting hardcoded superadmin role (exception case)');
        setUserRole('superadmin');
      } else {
        setUserRole('user'); // Default role
      }
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch role immediately when user logs in
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          setRoleLoading(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          setRoleLoading(false);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Exception getting initial session:', err);
        if (mounted) {
          setLoading(false);
          setRoleLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in with:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
      
      console.log('Sign in response:', { 
        user: data.user?.email || 'No user', 
        session: data.session ? 'Session exists' : 'No session',
        error: error?.message || 'No error' 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setLoading(false);
        return { error };
      }
      
      // Don't set loading to false here, let the auth state change handle it
      return { error: null };
    } catch (err) {
      console.error('Sign in exception:', err);
      setLoading(false);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('Signing out user');
    setUserRole(null);
    setRoleLoading(false);
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signIn,
    signOut,
    loading,
    isAdmin,
    isSuperAdmin,
    userRole,
    roleLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
