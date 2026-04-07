import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import Onboarding from '@/pages/Onboarding';
import LandlordDashboard from '@/pages/landlord/LandlordDashboard';
import TenantDashboard from '@/pages/tenant/TenantDashboard';

// Protected Route component
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: Array<'landlord' | 'tenant'>;
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs onboarding
  if (!user?.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  // Check role access
  if (allowedRoles && !allowedRoles.includes(user?.role as 'landlord' | 'tenant')) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'landlord') {
      return <Navigate to="/landlord" replace />;
    }
    if (user?.role === 'tenant') {
      return <Navigate to="/tenant" replace />;
    }
  }

  return <>{children}</>;
};

// Public Route - redirects to dashboard if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (!user?.isOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    // Redirect based on role
    if (user?.role === 'landlord') {
      return <Navigate to="/landlord" replace />;
    }
    if (user?.role === 'tenant') {
      return <Navigate to="/tenant" replace />;
    }
  }

  return <>{children}</>;
};

// Onboarding Route - only accessible to authenticated users who haven't completed onboarding
const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isOnboarded) {
    // Redirect to appropriate dashboard
    if (user?.role === 'landlord') {
      return <Navigate to="/landlord" replace />;
    }
    if (user?.role === 'tenant') {
      return <Navigate to="/tenant" replace />;
    }
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const getRedirect = () => {
    if (isLoading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!user?.isOnboarded) return <Navigate to="/onboarding" replace />;
    if (user?.role === 'landlord') return <Navigate to="/landlord" replace />;
    if (user?.role === 'tenant') return <Navigate to="/tenant" replace />;
    return <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />
      
      {/* Onboarding Route */}
      <Route 
        path="/onboarding" 
        element={
          <OnboardingRoute>
            <Onboarding />
          </OnboardingRoute>
        } 
      />

      {/* Landlord Routes */}
      <Route 
        path="/landlord/*" 
        element={
          <ProtectedRoute allowedRoles={['landlord']}>
            <LandlordDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Tenant Routes */}
      <Route 
        path="/tenant/*" 
        element={
          <ProtectedRoute allowedRoles={['tenant']}>
            <TenantDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route path="/" element={getRedirect()} />
      <Route path="*" element={getRedirect()} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
