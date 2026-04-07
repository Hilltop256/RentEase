import { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  Wrench, 
  FileText,
  Menu,
  X,
  Bell,
  Search,
  UserCircle,
  LogOut,
  Settings,
  MessageSquare,
  DollarSign,
  UserCheck,
  Home,
  FileLock,
  BellRing
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/sections/Dashboard';
import Properties from '@/sections/Properties';
import Tenants from '@/sections/Tenants';
import Payments from '@/sections/Payments';
import Maintenance from '@/sections/Maintenance';
import Leases from '@/sections/Leases';
import Finance from '@/sections/Finance';
import Vendors from '@/sections/Vendors';
import Vacancies from '@/sections/Vacancies';
import Documents from '@/sections/Documents';
import Notifications from '@/sections/Notifications';

type LandlordView = 'dashboard' | 'properties' | 'tenants' | 'payments' | 'maintenance' | 'leases' | 'finance' | 'vendors' | 'vacancies' | 'documents' | 'notifications';

const LandlordDashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<LandlordView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { id: 'dashboard' as LandlordView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties' as LandlordView, label: 'Properties', icon: Building2 },
    { id: 'tenants' as LandlordView, label: 'Tenants', icon: Users },
    { id: 'payments' as LandlordView, label: 'Payments', icon: CreditCard },
    { id: 'maintenance' as LandlordView, label: 'Maintenance', icon: Wrench },
    { id: 'leases' as LandlordView, label: 'Leases', icon: FileText },
    { id: 'finance' as LandlordView, label: 'Finance', icon: DollarSign },
    { id: 'vendors' as LandlordView, label: 'Vendors', icon: UserCheck },
    { id: 'vacancies' as LandlordView, label: 'Vacancies', icon: Home },
    { id: 'documents' as LandlordView, label: 'Documents', icon: FileLock },
    { id: 'notifications' as LandlordView, label: 'Notifications', icon: BellRing },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <Properties />;
      case 'tenants':
        return <Tenants />;
      case 'payments':
        return <Payments />;
      case 'maintenance':
        return <Maintenance />;
      case 'leases':
        return <Leases />;
      case 'finance':
        return <Finance />;
      case 'vendors':
        return <Vendors />;
      case 'vacancies':
        return <Vacancies />;
      case 'documents':
        return <Documents />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-lg">RentEase</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="p-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-400">Property Manager</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1 text-slate-400 hover:text-white">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search properties, tenants, payments..." 
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                3
              </Badge>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default LandlordDashboard;
