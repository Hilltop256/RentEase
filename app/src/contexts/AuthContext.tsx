import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'landlord@demo.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'landlord',
    phone: '(555) 123-4567',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isOnboarded: true
  },
  {
    id: '2',
    email: 'tenant@demo.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'tenant',
    phone: '(555) 987-6543',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    isOnboarded: true
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('rentease_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === credentials.email);
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }
    
    setUser(foundUser);
    localStorage.setItem('rentease_user', JSON.stringify(foundUser));
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOnboarded: false
    };
    
    MOCK_USERS.push(newUser);
    setUser(newUser);
    localStorage.setItem('rentease_user', JSON.stringify(newUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('rentease_user');
  }, []);

  const completeOnboarding = useCallback(async (_data: OnboardingData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (user) {
      const updatedUser = { 
        ...user, 
        isOnboarded: true,
        updatedAt: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('rentease_user', JSON.stringify(updatedUser));
    }
    setIsLoading(false);
  }, [user]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (user) {
      const updatedUser = { 
        ...user, 
        ...data,
        updatedAt: new Date().toISOString()
      };
      setUser(updatedUser);
      localStorage.setItem('rentease_user', JSON.stringify(updatedUser));
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
      updateProfile
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
