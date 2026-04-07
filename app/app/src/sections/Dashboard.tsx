import { useMemo } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Wrench, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { getDashboardStats, getMonthlyRevenueData, getOccupancyData, payments, maintenanceRequests } from '@/data/mockData';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const stats = useMemo(() => getDashboardStats(), []);
  const revenueData = useMemo(() => getMonthlyRevenueData(), []);
  const occupancyData = useMemo(() => getOccupancyData(), []);

  const recentPayments = payments
    .filter(p => p.status === 'paid')
    .slice(0, 5);

  const urgentMaintenance = maintenanceRequests
    .filter(m => m.priority === 'urgent' || m.priority === 'high')
    .slice(0, 5);

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      subtitle: `${stats.occupiedUnits} occupied, ${stats.vacantUnits} vacant`,
      icon: Building2,
      color: 'bg-blue-500',
      trend: null
    },
    {
      title: 'Active Tenants',
      value: stats.totalTenants,
      subtitle: 'Currently renting',
      icon: Users,
      color: 'bg-emerald-500',
      trend: null
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      subtitle: 'This month collected',
      icon: DollarSign,
      color: 'bg-violet-500',
      trend: { value: 12, positive: true }
    },
    {
      title: 'Pending Payments',
      value: `$${stats.pendingPayments.toLocaleString()}`,
      subtitle: `${stats.overduePayments > 0 ? `$${stats.overduePayments.toLocaleString()} overdue` : 'No overdue payments'}`,
      icon: AlertCircle,
      color: stats.overduePayments > 0 ? 'bg-red-500' : 'bg-amber-500',
      trend: null
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      overdue: 'bg-red-100 text-red-700 border-red-200',
      open: 'bg-red-100 text-red-700 border-red-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      high: 'bg-red-100 text-red-700 border-red-200',
      urgent: 'bg-red-500 text-white',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Occupancy Rate:</span>
          <div className="flex items-center gap-2">
            <Progress value={stats.occupancyRate} className="w-32 h-2" />
            <span className="font-semibold text-emerald-600">{stats.occupancyRate}%</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                    {card.trend && (
                      <div className={`flex items-center gap-1 mt-2 text-xs ${card.trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                        {card.trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{card.trend.positive ? '+' : ''}{card.trend.value}% from last month</span>
                      </div>
                    )}
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Chart */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Property Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {occupancyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Payments</CardTitle>
            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              On Track
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{payment.tenantName}</p>
                      <p className="text-xs text-gray-500">{payment.propertyName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">${payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      {payment.paidDate && format(parseISO(payment.paidDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Alerts */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Priority Maintenance</CardTitle>
            <Badge variant="outline" className="text-red-600 border-red-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              {stats.openMaintenanceRequests} Open
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentMaintenance.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      request.priority === 'urgent' ? 'bg-red-100' : 'bg-amber-100'
                    }`}>
                      <Wrench className={`h-5 w-5 ${
                        request.priority === 'urgent' ? 'text-red-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{request.title}</p>
                      <p className="text-xs text-gray-500">{request.propertyName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusBadge(request.priority)}>
                      {request.priority}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(parseISO(request.createdAt), 'MMM d')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
