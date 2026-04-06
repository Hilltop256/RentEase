import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CreditCard, 
  Banknote, 
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { payments } from '@/data/mockData';

import { format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesTab = activeTab === 'all' || payment.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = useMemo(() => {
    const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    const collectionRate = Math.round((totalPaid / (totalPaid + totalPending + totalOverdue)) * 100);
    
    return { totalPaid, totalPending, totalOverdue, collectionRate };
  }, []);

  const monthlyData = [
    { month: 'Jan', paid: 12500, pending: 3000, overdue: 1500 },
    { month: 'Feb', paid: 14200, pending: 2500, overdue: 800 },
    { month: 'Mar', paid: 13800, pending: 4200, overdue: 1200 },
    { month: 'Apr', paid: 15100, pending: 2800, overdue: 900 },
    { month: 'May', paid: 14800, pending: 3500, overdue: 1100 },
    { month: 'Jun', paid: 16200, pending: 2200, overdue: 600 },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      overdue: 'bg-red-100 text-red-700 border-red-200',
      partial: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'partial':
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Banknote className="h-4 w-4" />;
      case 'check':
        return <Download className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Track rent payments and manage collections.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tenant</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sarah Johnson</SelectItem>
                    <SelectItem value="2">David Chen</SelectItem>
                    <SelectItem value="3">Emily Rodriguez</SelectItem>
                    <SelectItem value="4">James Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="e.g., March 2024 Rent" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Record Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Collected</p>
                <p className="text-2xl font-bold text-emerald-600">${stats.totalPaid.toLocaleString()}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600">${stats.totalPending.toLocaleString()}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">${stats.totalOverdue.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Collection Rate</p>
                <p className="text-2xl font-bold text-violet-600">{stats.collectionRate}%</p>
              </div>
              <div className="bg-violet-100 p-3 rounded-lg">
                <TrendingUp className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Payment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                <Bar dataKey="paid" fill="#10b981" name="Paid" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdue" fill="#ef4444" name="Overdue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card className="border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Payment Records</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search payments..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
                All Payments
              </TabsTrigger>
              <TabsTrigger value="paid" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
                Paid
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
                Pending
              </TabsTrigger>
              <TabsTrigger value="overdue" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
                Overdue
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <span className="font-medium">{payment.tenantName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{payment.propertyName}</TableCell>
                      <TableCell className="text-sm">{payment.description}</TableCell>
                      <TableCell className="text-sm">
                        {format(parseISO(payment.dueDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">${payment.amount.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paymentMethod && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            {payment.status !== 'paid' && (
                              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
