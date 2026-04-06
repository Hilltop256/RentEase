import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Home, MapPin, Briefcase, User, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Landlord form state
  const [landlordData, setLandlordData] = useState({
    companyName: '',
    businessAddress: '',
    taxId: ''
  });

  // Tenant form state
  const [tenantData, setTenantData] = useState({
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: ''
  });

  const handleLandlordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await completeOnboarding({
        companyName: landlordData.companyName,
        businessAddress: landlordData.businessAddress
      });
      setIsComplete(true);
      setTimeout(() => navigate('/landlord'), 1500);
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await completeOnboarding({
        emergencyContact: {
          name: tenantData.emergencyContactName,
          phone: tenantData.emergencyContactPhone,
          relationship: tenantData.emergencyContactRelationship
        }
      });
      setIsComplete(true);
      setTimeout(() => navigate('/tenant'), 1500);
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
          <p className="text-gray-500">Redirecting to your dashboard...</p>
        </Card>
      </div>
    );
  }

  const renderLandlordOnboarding = () => (
    <form onSubmit={handleLandlordSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-100 mb-4">
          <Building2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <p className="text-gray-500">Tell us about your property business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name (Optional)</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="companyName"
              placeholder="e.g., Smith Properties LLC"
              className="pl-10"
              value={landlordData.companyName}
              onChange={(e) => setLandlordData({ ...landlordData, companyName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessAddress">Business Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="businessAddress"
              placeholder="Your business address"
              className="pl-10"
              value={landlordData.businessAddress}
              onChange={(e) => setLandlordData({ ...landlordData, businessAddress: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID / EIN (Optional)</Label>
          <Input
            id="taxId"
            placeholder="XX-XXXXXXX"
            value={landlordData.taxId}
            onChange={(e) => setLandlordData({ ...landlordData, taxId: e.target.value })}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Complete Setup'}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );

  const renderTenantOnboarding = () => (
    <form onSubmit={handleTenantSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-100 mb-4">
          <Home className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Complete Your Profile</h2>
        <p className="text-gray-500">Add your emergency contact information</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emergencyName">Emergency Contact Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="emergencyName"
              placeholder="Full name"
              className="pl-10"
              value={tenantData.emergencyContactName}
              onChange={(e) => setTenantData({ ...tenantData, emergencyContactName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="emergencyPhone"
              type="tel"
              placeholder="(555) 000-0000"
              className="pl-10"
              value={tenantData.emergencyContactPhone}
              onChange={(e) => setTenantData({ ...tenantData, emergencyContactPhone: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship</Label>
          <Input
            id="relationship"
            placeholder="e.g., Parent, Spouse, Sibling"
            value={tenantData.emergencyContactRelationship}
            onChange={(e) => setTenantData({ ...tenantData, emergencyContactRelationship: e.target.value })}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Complete Setup'}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardContent className="p-8">
          {user?.role === 'landlord' && renderLandlordOnboarding()}
          {user?.role === 'tenant' && renderTenantOnboarding()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
