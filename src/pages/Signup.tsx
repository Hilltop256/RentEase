import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Home, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/auth';

const steps = ['role', 'account', 'profile'] as const;
type Step = typeof steps[number];

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('role');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [formData, setFormData] = useState({
    role: '' as UserRole | '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleRoleSelect = (role: UserRole) => {
    setFormData({ ...formData, role });
    setCurrentStep('account');
  };

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role as UserRole,
        phone: formData.phone
      });
      setSignupSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuccessMessage = () => (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">Check Your Email!</h2>
      <p className="text-gray-500 mb-4">
        We've sent a confirmation link to <strong>{formData.email}</strong>
      </p>
      <p className="text-sm text-gray-400">
        Click the link in the email to activate your account, then come back to sign in.
      </p>
      <Link 
        to="/login" 
        className="inline-block mt-6 text-emerald-600 hover:text-emerald-700 font-medium"
      >
        Go to Login →
      </Link>
    </div>
  );

  const renderRoleStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">I am a...</h3>
        <p className="text-gray-500">Select your role to get started</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => handleRoleSelect('landlord')}
          className={`p-6 rounded-xl border-2 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50 ${
            formData.role === 'landlord' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Property Owner / Landlord</h4>
              <p className="text-gray-500 text-sm mt-1">
                Manage multiple properties, track rent payments, handle maintenance requests, and communicate with tenants.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('tenant')}
          className={`p-6 rounded-xl border-2 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50 ${
            formData.role === 'tenant' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Tenant / Renter</h4>
              <p className="text-gray-500 text-sm mt-1">
                Pay rent online, submit maintenance requests, view lease details, and communicate with your landlord.
              </p>
            </div>
          </div>
        </button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );

  const renderAccountStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        Back
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="pl-10"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10 pr-10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="pl-10"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>
      </div>

      <Button
        type="button"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        onClick={handleNext}
        disabled={!formData.email || !formData.password || !formData.confirmPassword}
      >
        Continue
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  const renderProfileStep = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              placeholder="John"
              className="pl-10"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              placeholder="Doe"
              className="pl-10"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 000-0000"
            className="pl-10"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-start gap-2 mt-4">
        <input type="checkbox" id="terms" className="mt-1 rounded border-gray-300" required />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{' '}
          <Link to="/terms" className="text-emerald-600 hover:text-emerald-700">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700">Privacy Policy</Link>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isLoading || !formData.firstName || !formData.lastName}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );

  const getStepNumber = () => steps.indexOf(currentStep) + 1;
  const getTotalSteps = () => steps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500 mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Join RentEase today</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {currentStep === 'role' && 'Select Your Role'}
                  {currentStep === 'account' && 'Account Details'}
                  {currentStep === 'profile' && 'Personal Information'}
                </CardTitle>
                <CardDescription>
                  Step {getStepNumber()} of {getTotalSteps()}
                </CardDescription>
              </div>
              <div className="flex gap-1">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`h-2 w-8 rounded-full ${
                      index <= steps.indexOf(currentStep) ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {signupSuccess ? (
              renderSuccessMessage()
            ) : (
              <>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {currentStep === 'role' && renderRoleStep()}
                {currentStep === 'account' && renderAccountStep()}
                {currentStep === 'profile' && renderProfileStep()}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
