import { useState } from 'react';
import { 
  Home, 
  CreditCard, 
  Wrench, 
  FileText, 
  Bell, 
  User, 
  LogOut,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, differenceInDays } from 'date-fns';

// Mock tenant data - in real app, this would come from API
const mockTenantData = {
  currentLease: {
    propertyName: 'Sunset Gardens Apartments',
    unitNumber: '4B',
    address: '123 Sunset Boulevard, Los Angeles, CA 90028',
    leaseStart: '2024-01-01',
    leaseEnd: '2024-12-31',
    monthlyRent: 2800,
    securityDeposit: 5600,
    nextPaymentDue: '2024-04-01'
  },
  paymentHistory: [
    { id: '1', date: '2024-03-01', amount: 2800, status: 'paid', method: 'Bank Transfer' },
    { id: '2', date: '2024-02-01', amount: 2800, status: 'paid', method: 'Bank Transfer' },
    { id: '3', date: '2024-01-01', amount: 2800, status: 'paid', method: 'Bank Transfer' },
  ],
  maintenanceRequests: [
    { id: '1', title: 'Leaky Faucet', status: 'completed', date: '2024-02-10', priority: 'low' },
    { id: '2', title: 'Clogged Drain', status: 'in_progress', date: '2024-03-12', priority: 'medium' },
  ],
  announcements: [
    { id: '1', title: 'Pool Maintenance Scheduled', date: '2024-03-20', content: 'The pool will be closed for maintenance on March 25th.' },
    { id: '2', title: 'Rent Increase Notice', date: '2024-03-15', content: 'Please review the attached notice regarding upcoming rent changes.' },
  ]
};

type TenantView = 'overview' | 'payments' | 'maintenance' | 'documents' | 'profile';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<TenantView>('overview');

  const lease = mockTenantData.currentLease;
  const daysUntilNextPayment = differenceInDays(parseISO(lease.nextPaymentDue), new Date());
  const leaseProgress = Math.round(
    ((new Date().getTime() - parseISO(lease.leaseStart).getTime()) / 
    (parseISO(lease.leaseEnd).getTime() - parseISO(lease.leaseStart).getTime())) * 100
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h2>
        <p className="text-emerald-100 mt-1">Here's what's happening with your rental</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Next Payment</p>
                <p className="text-2xl font-bold text-gray-900">${lease.monthlyRent.toLocaleString()}</p>
                <p className={`text-sm ${daysUntilNextPayment <= 5 ? 'text-red-600' : 'text-gray-500'}`}>
                  Due in {daysUntilNextPayment} days
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Lease Status</p>
                <p className="text-2xl font-bold text-gray-900">{leaseProgress}%</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockTenantData.maintenanceRequests.filter(r => r.status !== 'completed').length}
                </p>
                <p className="text-sm text-gray-500">Maintenance items</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Wrench className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Property */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Home</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800" 
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{lease.propertyName}</h3>
                <p className="text-gray-500">Unit {lease.unitNumber}</p>
                <p className="text-gray-500 text-sm">{lease.address}</p>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Lease Period</span>
                  <span>{format(parseISO(lease.leaseStart), 'MMM d, yyyy')} - {format(parseISO(lease.leaseEnd), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Monthly Rent</span>
                  <span className="font-semibold">${lease.monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Security Deposit</span>
                  <span>${lease.securityDeposit.toLocaleString()}</span>
                </div>
              </div>
              <Progress value={leaseProgress} className="h-2" />
              <p className="text-xs text-gray-500 text-center">{leaseProgress}% of lease completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Payment History</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('payments')}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTenantData.paymentHistory.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">${payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{payment.method}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(parseISO(payment.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTenantData.announcements.map((announcement) => (
                  <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">New</Badge>
                      <span className="text-xs text-gray-500">
                        {format(parseISO(announcement.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payments</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <CreditCard className="h-4 w-4 mr-2" />
          Pay Rent
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Current Balance</p>
              <p className="text-3xl font-bold">${lease.monthlyRent.toLocaleString()}</p>
              <p className="text-emerald-100 text-sm mt-1">Due {format(parseISO(lease.nextPaymentDue), 'MMMM d, yyyy')}</p>
            </div>
            <Button variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
              Pay Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTenantData.paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Rent Payment</p>
                    <p className="text-sm text-gray-500">{payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(payment.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Maintenance Requests</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Wrench className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="space-y-4">
        {mockTenantData.maintenanceRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    request.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}>
                    {request.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{request.title}</p>
                    <p className="text-sm text-gray-500">
                      Submitted {format(parseISO(request.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Badge className={
                  request.status === 'completed' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }>
                  {request.status === 'completed' ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'payments':
        return renderPayments();
      case 'maintenance':
        return renderMaintenance();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-lg">RentEase</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setCurrentView('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'overview' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setCurrentView('payments')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'payments' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Payments</span>
          </button>
          <button
            onClick={() => setCurrentView('maintenance')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'maintenance' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Wrench className="h-5 w-5" />
            <span>Maintenance</span>
          </button>
          <button
            onClick={() => setCurrentView('documents')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === 'documents' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Documents</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">Tenant</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold capitalize">{currentView}</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  2
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TenantDashboard;
