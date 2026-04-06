import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  User,
  Home,
  DollarSign
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leases } from '@/data/mockData';
import type { Lease } from '@/types';
import { format, parseISO, differenceInDays } from 'date-fns';

const Leases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lease.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lease.status === filterStatus;
    const matchesTab = activeTab === 'all' || lease.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    active: leases.filter(l => l.status === 'active').length,
    expired: leases.filter(l => l.status === 'expired').length,
    pending: leases.filter(l => l.status === 'pending').length,
    terminating: leases.filter(l => l.status === 'terminated').length,
    expiringSoon: leases.filter(l => {
      if (l.status !== 'active') return false;
      const daysUntilExpiry = differenceInDays(parseISO(l.endDate), new Date());
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      expired: 'bg-gray-100 text-gray-700 border-gray-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      terminated: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'terminated':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getLeaseProgress = (startDate: string, endDate: string) => {
    const start = parseISO(startDate).getTime();
    const end = parseISO(endDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    return Math.round(progress);
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const days = differenceInDays(parseISO(endDate), new Date());
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    if (days === 1) return '1 day left';
    if (days <= 30) return `${days} days left`;
    return `${Math.floor(days / 30)} months left`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leases</h1>
          <p className="text-gray-500">Manage rental agreements and lease terms.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Lease
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Lease</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
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
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Property</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sunset Gardens Apartments</SelectItem>
                    <SelectItem value="2">Downtown Loft</SelectItem>
                    <SelectItem value="3">Family Home on Maple</SelectItem>
                    <SelectItem value="4">Beachside Condo</SelectItem>
                    <SelectItem value="5">Modern Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Rent</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Security Deposit</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pet Deposit (Optional)</label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Lease Terms</label>
                <Input placeholder="e.g., No smoking, No pets" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Create Lease</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Expiring Soon</p>
                <p className="text-xl font-bold">{stats.expiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Expired</p>
                <p className="text-xl font-bold">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 p-2 rounded-lg">
                <FileText className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Leases</p>
                <p className="text-xl font-bold">{leases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search leases..." 
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leases List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
            All Leases
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
            Active
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
            Pending
          </TabsTrigger>
          <TabsTrigger value="expired" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
            Expired
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="m-0 mt-6">
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Lease Period</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeases.map((lease) => {
                    const progress = getLeaseProgress(lease.startDate, lease.endDate);
                    const daysLeft = getDaysUntilExpiry(lease.endDate);
                    const isExpiringSoon = lease.status === 'active' && differenceInDays(parseISO(lease.endDate), new Date()) <= 30;
                    
                    return (
                      <TableRow key={lease.id} className="cursor-pointer" onClick={() => setSelectedLease(lease)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{lease.tenantName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{lease.propertyName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(parseISO(lease.startDate), 'MMM d, yyyy')}</p>
                            <p className="text-gray-500">to {format(parseISO(lease.endDate), 'MMM d, yyyy')}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-full">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{progress}%</span>
                              <span className={isExpiringSoon ? 'text-red-600' : 'text-gray-500'}>{daysLeft}</span>
                            </div>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isExpiringSoon ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold">{lease.monthlyRent.toLocaleString()}/mo</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(lease.status)}>
                            {getStatusIcon(lease.status)}
                            <span className="ml-1 capitalize">{lease.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedLease(lease)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Renew Lease
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lease Detail Dialog */}
      <Dialog open={!!selectedLease} onOpenChange={() => setSelectedLease(null)}>
        <DialogContent className="max-w-2xl">
          {selectedLease && (
            <>
              <DialogHeader>
                <DialogTitle>Lease Agreement Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Lease #{selectedLease.id}</p>
                      <p className="text-sm text-gray-500">Created on {format(parseISO(selectedLease.startDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(selectedLease.status)}>
                    {getStatusIcon(selectedLease.status)}
                    <span className="ml-1 capitalize">{selectedLease.status}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Tenant</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{selectedLease.tenantName}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Property</h4>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{selectedLease.propertyName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Lease Period</h4>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="font-medium">{format(parseISO(selectedLease.startDate), 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="font-medium">{format(parseISO(selectedLease.endDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Financial Terms</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-xs text-gray-500">Monthly Rent</p>
                      <p className="text-lg font-bold text-emerald-600">${selectedLease.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Security Deposit</p>
                      <p className="text-lg font-bold">${selectedLease.securityDeposit.toLocaleString()}</p>
                    </div>
                    {selectedLease.petDeposit && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Pet Deposit</p>
                        <p className="text-lg font-bold">${selectedLease.petDeposit.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedLease.terms && (
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Terms & Conditions</h4>
                    <p className="p-4 bg-gray-50 rounded-lg text-sm">{selectedLease.terms}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  {selectedLease.status === 'active' && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Renew Lease
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leases;
