import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Star,
  Loader2,
  Trash2,
  Edit,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Home,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

const VENDOR_SPECIALTIES = [
  { value: 'plumbing', label: 'Plumbing', icon: Droplets },
  { value: 'electrical', label: 'Electrical', icon: Zap },
  { value: 'hvac', label: 'HVAC', icon: Wind },
  { value: 'appliance', label: 'Appliance Repair', icon: Wrench },
  { value: 'general', label: 'General Maintenance', icon: Home },
  { value: 'cleaning', label: 'Cleaning', icon: Home },
  { value: 'landscaping', label: 'Landscaping', icon: Home },
  { value: 'roofing', label: 'Roofing', icon: Home },
  { value: 'painting', label: 'Painting', icon: Home },
  { value: 'other', label: 'Other', icon: Briefcase }
];

const Vendors = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    specialty: 'general',
    hourlyRate: '',
    notes: '',
    isActive: true
  });

  useEffect(() => {
    loadVendors();
  }, [user?.id]);

  const loadVendors = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const data = await db.vendors.getAll(user.id);
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || vendor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getSpecialtyIcon = (specialty: string) => {
    const specialtyData = VENDOR_SPECIALTIES.find(s => s.value === specialty);
    return specialtyData ? specialtyData.icon : Briefcase;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const vendorData = {
        companyName: formData.companyName,
        contactName: formData.contactName || undefined,
        email: formData.email || undefined,
        phone: formData.phone,
        specialty: formData.specialty as 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general' | 'cleaning' | 'landscaping' | 'roofing' | 'painting' | 'other',
        hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        notes: formData.notes || undefined,
        isActive: formData.isActive,
        rating: editingVendor?.rating ?? 0
      };

      if (editingVendor) {
        await db.vendors.update(editingVendor.id, vendorData);
      } else {
        await db.vendors.create(vendorData, user.id);
      }

      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        specialty: 'general',
        hourlyRate: '',
        notes: '',
        isActive: true
      });
      setEditingVendor(null);
      setIsDialogOpen(false);
      loadVendors();
    } catch (error) {
      console.error('Failed to save vendor:', error);
    }
  };

  const handleEdit = (vendor: any) => {
    setEditingVendor(vendor);
    setFormData({
      companyName: vendor.companyName,
      contactName: vendor.contactName || '',
      email: vendor.email || '',
      phone: vendor.phone,
      specialty: vendor.specialty,
      hourlyRate: vendor.hourlyRate ? String(vendor.hourlyRate) : '',
      notes: vendor.notes || '',
      isActive: vendor.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await db.vendors.delete(id);
      loadVendors();
    } catch (error) {
      console.error('Failed to delete vendor:', error);
    }
  };

  const toggleActive = async (vendor: any) => {
    try {
      await db.vendors.update(vendor.id, { isActive: !vendor.isActive });
      loadVendors();
    } catch (error) {
      console.error('Failed to update vendor:', error);
    }
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
          <h2 className="text-2xl font-bold">Vendors</h2>
          <p className="text-gray-500">Manage your service providers and contractors</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingVendor(null);
            setFormData({
              companyName: '',
              contactName: '',
              email: '',
              phone: '',
              specialty: 'general',
              hourlyRate: '',
              notes: '',
              isActive: true
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="ABC Plumbing Services"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="John Smith"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select value={formData.specialty} onValueChange={(v) => setFormData({ ...formData, specialty: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VENDOR_SPECIALTIES.map(specialty => (
                      <SelectItem key={specialty.value} value={specialty.value}>{specialty.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="75.00"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this vendor..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="text-sm">Active vendor</Label>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                {editingVendor ? 'Update' : 'Add'} Vendor
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Vendors</div>
            <div className="text-2xl font-bold">{vendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Active Vendors</div>
            <div className="text-2xl font-bold text-emerald-600">
              {vendors.filter(v => v.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Specialties</div>
            <div className="text-2xl font-bold">
              {new Set(vendors.map(v => v.specialty)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Avg. Rating</div>
            <div className="text-2xl font-bold flex items-center gap-1">
              {vendors.length > 0 
                ? (vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)
                : '0.0'
              }
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vendors..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {VENDOR_SPECIALTIES.map(specialty => (
              <SelectItem key={specialty.value} value={specialty.value}>{specialty.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Vendors Table */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No vendors found</h3>
          <p className="text-gray-400">Add your first vendor to get started</p>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Hourly Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => {
                const Icon = getSpecialtyIcon(vendor.specialty);
                return (
                  <TableRow key={vendor.id} className={!vendor.isActive ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        {vendor.companyName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{vendor.contactName || '-'}</div>
                        {vendor.email && (
                          <div className="text-xs text-gray-400">{vendor.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {vendor.specialty}
                      </Badge>
                    </TableCell>
                    <TableCell>{vendor.phone}</TableCell>
                    <TableCell>
                      {vendor.hourlyRate ? `$${vendor.hourlyRate}/hr` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={vendor.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}>
                        {vendor.isActive ? 'Active' : 'Inactive'}
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
                          <DropdownMenuItem onClick={() => handleEdit(vendor)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(vendor)}>
                            {vendor.isActive ? 'Mark Inactive' : 'Mark Active'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(vendor.id)} className="text-red-600">
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

export default Vendors;
