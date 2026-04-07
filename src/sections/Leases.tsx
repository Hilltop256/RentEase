import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  FileText, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/db';
import { formatCurrency } from '@/lib/currency';
import { useAuth } from '@/contexts/AuthContext';
import { format, differenceInDays } from 'date-fns';

const Leases = () => {
  const { user } = useAuth();
  const [leases, setLeases] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLease, setEditingLease] = useState<any>(null);

  const [formData, setFormData] = useState({
    tenantId: '',
    propertyId: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    petDeposit: '',
    terms: '',
    status: 'pending'
  });

  useEffect(() => {
    loadLeases();
  }, [user?.id]);

  const loadLeases = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const [leasesData, tenantsData, propertiesData] = await Promise.all([
        db.leases.getAll(user.id),
        db.tenants.getAll(user.id),
        db.properties.getAll(user.id)
      ]);
      setLeases(leasesData);
      setTenants(tenantsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error('Failed to load leases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeases = leases.filter(lease => {
    const matchesSearch = lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lease.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || lease.status === filterStatus;
    const matchesTab = activeTab === 'all' || lease.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = useMemo(() => {
    const active = leases.filter(l => l.status === 'active').length;
    const expiring = leases.filter(l => {
      if (l.status !== 'active') return false;
      const daysLeft = differenceInDays(new Date(l.endDate), new Date());
      return daysLeft <= 30 && daysLeft > 0;
    }).length;
    const expired = leases.filter(l => l.status === 'expired').length;
    const totalRent = leases.filter(l => l.status === 'active').reduce((sum, l) => sum + Number(l.monthlyRent), 0);

    return { active, expiring, expired, totalRent };
  }, [leases]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      expired: 'bg-red-100 text-red-700 border-red-200',
      terminated: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getDaysRemaining = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    if (days < 0) return { text: 'Expired', color: 'text-red-600' };
    if (days <= 30) return { text: `${days} days left`, color: 'text-amber-600' };
    return { text: `${days} days left`, color: 'text-gray-600' };
  };

  const handleDeleteLease = async (id: string) => {
    try {
      await db.leases.delete(id);
      setLeases(leases.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete lease:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const leaseData = {
        tenantId: formData.tenantId,
        propertyId: formData.propertyId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthlyRent: Number(formData.monthlyRent),
        securityDeposit: formData.securityDeposit ? Number(formData.securityDeposit) : 0,
        petDeposit: formData.petDeposit ? Number(formData.petDeposit) : undefined,
        terms: formData.terms || undefined,
        status: formData.status as 'active' | 'pending' | 'expired' | 'terminated'
      };

      if (editingLease) {
        await db.leases.update(editingLease.id, leaseData);
      } else {
        await db.leases.create(leaseData, user.id);
      }

      setFormData({
        tenantId: '',
        propertyId: '',
        startDate: '',
        endDate: '',
        monthlyRent: '',
        securityDeposit: '',
        petDeposit: '',
        terms: '',
        status: 'pending'
      });
      setEditingLease(null);
      setIsDialogOpen(false);
      loadLeases();
    } catch (error) {
      console.error('Failed to save lease:', error);
    }
  };

  const handleEdit = (lease: any) => {
    setEditingLease(lease);
    setFormData({
      tenantId: lease.tenantId || '',
      propertyId: lease.propertyId || '',
      startDate: lease.startDate || '',
      endDate: lease.endDate || '',
      monthlyRent: String(lease.monthlyRent),
      securityDeposit: String(lease.securityDeposit),
      petDeposit: lease.petDeposit ? String(lease.petDeposit) : '',
      terms: lease.terms || '',
      status: lease.status
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Leases</h2>
          <p className="text-gray-500">Manage lease agreements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingLease(null);
            setFormData({
              tenantId: '',
              propertyId: '',
              startDate: '',
              endDate: '',
              monthlyRent: '',
              securityDeposit: '',
              petDeposit: '',
              terms: '',
              status: 'pending'
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Lease
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLease ? 'Edit Lease' : 'Create New Lease'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tenant *</Label>
                <Select value={formData.tenantId} onValueChange={(v) => setFormData({ ...formData, tenantId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property *</Label>
                <Select value={formData.propertyId} onValueChange={(v) => setFormData({ ...formData, propertyId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Monthly Rent ($) *</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="1500"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="securityDeposit">Security Deposit</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    placeholder="1500"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="petDeposit">Pet Deposit</Label>
                <Input
                  id="petDeposit"
                  type="number"
                  placeholder="300"
                  value={formData.petDeposit}
                  onChange={(e) => setFormData({ ...formData, petDeposit: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms</Label>
                <Textarea
                  id="terms"
                  placeholder="Additional lease terms..."
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                {editingLease ? 'Update' : 'Create'} Lease
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Leases</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-bold text-amber-600">{stats.expiring}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRent)}</p>
              </div>
              <FileText className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leases..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
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

      {/* Leases Table */}
      {filteredLeases.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No leases found</h3>
          <p className="text-gray-400">Create your first lease to get started</p>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeases.map((lease) => {
                const daysRemaining = getDaysRemaining(lease.endDate);
                return (
                  <TableRow key={lease.id}>
                    <TableCell className="font-medium">{lease.tenantName}</TableCell>
                    <TableCell>{lease.propertyName}</TableCell>
                    <TableCell>{format(new Date(lease.startDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div>{format(new Date(lease.endDate), 'MMM d, yyyy')}</div>
                      <div className={`text-xs ${daysRemaining.color}`}>
                        {daysRemaining.text}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(Number(lease.monthlyRent))}/mo</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(lease.status)}>
                        {lease.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(lease)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Renew Lease</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteLease(lease.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default Leases;
