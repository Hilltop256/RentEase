import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, UserRole, LoginCredentials, SignupData, OnboardingData } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUserToUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    firstName: supabaseUser.user_metadata?.first_name || '',
    lastName: supabaseUser.user_metadata?.last_name || '',
    role: supabaseUser.user_metadata?.role || 'tenant',
    phone: supabaseUser.user_metadata?.phone || '',
    createdAt: supabaseUser.created_at,
    updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
    isOnboarded: supabaseUser.user_metadata?.is_onboarded || false
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      }
      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed');
      if (session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    console.log('Attempting login with:', credentials.email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    console.log('Login response:', { data, error });

    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    
    if (data?.user) {
      console.log('Login successful, user:', data.user.id);
    }
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          phone: data.phone,
          is_onboarded: false
        }
      }
    });

    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    setIsLoading(false);
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    setIsLoading(false);
  }, []);

  const completeOnboarding = useCallback(async (_data: OnboardingData) => {
    setIsLoading(true);
    
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: {
          is_onboarded: true
        }
      });

      if (error) {
        setIsLoading(false);
        throw new Error(error.message);
      }

      const updatedUser = { 
        ...user, 
        isOnboarded: true,
        updatedAt: new Date().toISOString()
      };
      setUser(updatedUser);
    }
    setIsLoading(false);
  }, [user]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone
        }
      });

      if (error) {
        setIsLoading(false);
        throw new Error(error.message);
      }

      const updatedUser = { 
        ...user, 
        ...data,
        updatedAt: new Date().toISOString()
      };
      setUser(updatedUser);
    }
    setIsLoading(false);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      completeOnboarding,
      updateProfile,
      resetPassword,
      updatePassword
    }}>
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

export function useRequireAuth(role?: UserRole) {
  const auth = useAuth();
  
  if (!auth.isAuthenticated) {
    return { allowed: false, redirectTo: '/login' };
  }
  
  if (role && auth.user?.role !== role) {
    return { allowed: false, redirectTo: auth.user?.role === 'landlord' ? '/landlord' : '/tenant' };
  }
  
  if (auth.user && !auth.user.isOnboarded) {
    return { allowed: false, redirectTo: '/onboarding' };
  }
  
  return { allowed: true, user: auth.user };
}