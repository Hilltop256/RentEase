import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Home,
  Calendar,
  UserCircle,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { tenants } from '@/data/mockData';
import type { Tenant } from '@/types';
import { format, parseISO } from 'date-fns';

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getLeaseStatus = (leaseEnd: string) => {
    const endDate = parseISO(leaseEnd);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { label: 'Expired', color: 'bg-red-100 text-red-700' };
    if (daysUntilExpiry < 30) return { label: `Expires in ${daysUntilExpiry} days`, color: 'bg-amber-100 text-amber-700' };
    return { label: 'Active', color: 'bg-emerald-100 text-emerald-700' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-500">Manage your tenants and their lease information.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input placeholder="First name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input placeholder="Last name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="(555) 000-0000" />
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
                <label className="text-sm font-medium">Lease Start</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lease End</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Rent</label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Security Deposit</label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Save Tenant</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search tenants..." 
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
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Tenants Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => {
            const leaseStatus = getLeaseStatus(tenant.leaseEnd);
            return (
              <Card key={tenant.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <UserCircle className="h-7 w-7 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tenant.firstName} {tenant.lastName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(tenant.status)}
                          <Badge className={getStatusBadge(tenant.status)}>
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTenant(tenant)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Home className="h-4 w-4" />
                      <span>{tenant.propertyName}</span>
                      {tenant.unitNumber && <span className="text-gray-400">• Unit {tenant.unitNumber}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{tenant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{tenant.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Monthly Rent</p>
                        <p className="font-semibold text-emerald-600">${tenant.monthlyRent.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Lease Status</p>
                        <Badge className={leaseStatus.color}>
                          {leaseStatus.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tenants List View */}
      {viewMode === 'list' && (
        <Card className="border-gray-200">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id} className="cursor-pointer" onClick={() => setSelectedTenant(tenant)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <UserCircle className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium">{tenant.firstName} {tenant.lastName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Home className="h-4 w-4 text-gray-400" />
                          <span>{tenant.propertyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{tenant.email}</p>
                          <p className="text-gray-500">{tenant.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {format(parseISO(tenant.leaseStart), 'MMM d, yyyy')} - {format(parseISO(tenant.leaseEnd), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-emerald-600">${tenant.monthlyRent.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(tenant.status)}>
                          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
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
                            <DropdownMenuItem onClick={() => setSelectedTenant(tenant)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tenant Detail Dialog */}
      <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTenant && (
            <>
              <DialogHeader>
                <DialogTitle>Tenant Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedTenant.firstName} {selectedTenant.lastName}</h3>
                    <Badge className={getStatusBadge(selectedTenant.status)}>
                      {selectedTenant.status.charAt(0).toUpperCase() + selectedTenant.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedTenant.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedTenant.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Property</h4>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-400" />
                      <span>{selectedTenant.propertyName}</span>
                    </div>
                    {selectedTenant.unitNumber && (
                      <p className="text-sm text-gray-500 mt-1">Unit {selectedTenant.unitNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Lease Information</h4>
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Lease Start</p>
                      <p className="font-medium">{format(parseISO(selectedTenant.leaseStart), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lease End</p>
                      <p className="font-medium">{format(parseISO(selectedTenant.leaseEnd), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Monthly Rent</p>
                      <p className="font-medium text-emerald-600">${selectedTenant.monthlyRent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Emergency Contact</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedTenant.emergencyContact.name}</p>
                    <p className="text-sm text-gray-600">{selectedTenant.emergencyContact.relationship}</p>
                    <p className="text-sm text-gray-600">{selectedTenant.emergencyContact.phone}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Edit Tenant</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Contact Tenant</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tenants;
