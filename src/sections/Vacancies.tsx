import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Home, 
  Users, 
  Phone, 
  Mail,
  Calendar,
  DollarSign,
  Loader2,
  Trash2,
  Edit,
  UserPlus,
  TrendingUp
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
import { format } from 'date-fns';

const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'showing', label: 'Showing', color: 'bg-purple-100 text-purple-700' },
  { value: 'application', label: 'Application', color: 'bg-orange-100 text-orange-700' },
  { value: 'approved', label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
  { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' }
];

const Vacancies = () => {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'vacancies' | 'leads'>('vacancies');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<any>(null);
  const [editingLead, setEditingLead] = useState<any>(null);

  const [vacancyForm, setVacancyForm] = useState({
    unitNumber: '',
    status: 'available',
    availableDate: '',
    rentAmount: '',
    description: ''
  });

  const [leadForm, setLeadForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'new',
    source: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const [vacancyData, leadData] = await Promise.all([
        db.vacancies.getAll(user.id),
        db.leads.getAll(user.id)
      ]);
      setVacancies(vacancyData);
      setLeads(leadData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVacancies = vacancies.filter(v => 
    v.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    l.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vacancyStats = {
    total: vacancies.length,
    available: vacancies.filter(v => v.status === 'available').length,
    pending: vacancies.filter(v => v.status === 'pending').length,
    leads: leads.length
  };

  const handleVacancySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const data = {
        unitNumber: vacancyForm.unitNumber || null,
        status: vacancyForm.status,
        availableDate: vacancyForm.availableDate || null,
        rentAmount: vacancyForm.rentAmount ? Number(vacancyForm.rentAmount) : null,
        description: vacancyForm.description || null
      };

      if (editingVacancy) {
        await db.vacancies.update(editingVacancy.id, data);
      } else {
        await db.vacancies.create(data, user.id);
      }

      setVacancyForm({
        unitNumber: '',
        status: 'available',
        availableDate: '',
        rentAmount: '',
        description: ''
      });
      setEditingVacancy(null);
      setIsDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to save vacancy:', error);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const data = {
        firstName: leadForm.firstName,
        lastName: leadForm.lastName || null,
        email: leadForm.email || null,
        phone: leadForm.phone || null,
        status: leadForm.status,
        source: leadForm.source || null,
        notes: leadForm.notes || null
      };

      if (editingLead) {
        await db.leads.update(editingLead.id, data);
      } else {
        await db.leads.create(data, user.id);
      }

      setLeadForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'new',
        source: '',
        notes: ''
      });
      setEditingLead(null);
      setIsLeadDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to save lead:', error);
    }
  };

  const handleDeleteVacancy = async (id: string) => {
    try {
      await db.vacancies.delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete vacancy:', error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await db.leads.delete(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusData = LEAD_STATUSES.find(s => s.value === status);
    return statusData ? statusData.color : 'bg-gray-100 text-gray-700';
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
          <h2 className="text-2xl font-bold">Vacancies & Leads</h2>
          <p className="text-gray-500">Manage vacant units and prospective tenants</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isLeadDialogOpen} onOpenChange={(open) => {
            setIsLeadDialogOpen(open);
            if (!open) {
              setEditingLead(null);
              setLeadForm({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                status: 'new',
                source: '',
                notes: ''
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={leadForm.firstName}
                      onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={leadForm.lastName}
                      onChange={(e) => setLeadForm({ ...leadForm, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={leadForm.status} onValueChange={(v) => setLeadForm({ ...leadForm, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUSES.map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Zillow, Referral, Website"
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    value={leadForm.notes}
                    onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {editingLead ? 'Update' : 'Add'} Lead
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingVacancy(null);
              setVacancyForm({
                unitNumber: '',
                status: 'available',
                availableDate: '',
                rentAmount: '',
                description: ''
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Vacancy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingVacancy ? 'Edit Vacancy' : 'Add New Vacancy'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleVacancySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unitNumber">Unit/Property</Label>
                  <Input
                    id="unitNumber"
                    placeholder="e.g., Unit 101 or 123 Main St"
                    value={vacancyForm.unitNumber}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, unitNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentAmount">Monthly Rent ($)</Label>
                  <Input
                    id="rentAmount"
                    type="number"
                    min="0"
                    placeholder="1500"
                    value={vacancyForm.rentAmount}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, rentAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableDate">Available Date</Label>
                  <Input
                    id="availableDate"
                    type="date"
                    value={vacancyForm.availableDate}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, availableDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Unit description..."
                    value={vacancyForm.description}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {editingVacancy ? 'Update' : 'Add'} Vacancy
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Vacancies</p>
                <p className="text-2xl font-bold">{vacancyStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600">{vacancyStats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{vacancyStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold">{vacancyStats.leads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('vacancies')}
          className={`pb-2 px-1 font-medium ${activeTab === 'vacancies' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}
        >
          Vacancies ({filteredVacancies.length})
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-2 px-1 font-medium ${activeTab === 'leads' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}
        >
          Leads ({filteredLeads.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={`Search ${activeTab}...`}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content */}
      {activeTab === 'vacancies' ? (
        filteredVacancies.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No vacancies found</h3>
            <p className="text-gray-400">Add your first vacancy to start tracking</p>
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Available Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVacancies.map((vacancy) => (
                  <TableRow key={vacancy.id}>
                    <TableCell className="font-medium">{vacancy.unitNumber || '-'}</TableCell>
                    <TableCell>
                      <Badge className={
                        vacancy.status === 'available' ? 'bg-green-100 text-green-700' :
                        vacancy.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {vacancy.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vacancy.rentAmount ? `$${Number(vacancy.rentAmount).toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>
                      {vacancy.availableDate ? format(new Date(vacancy.availableDate), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{vacancy.description || '-'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setEditingVacancy(vacancy);
                            setVacancyForm({
                              unitNumber: vacancy.unitNumber || '',
                              status: vacancy.status,
                              availableDate: vacancy.availableDate || '',
                              rentAmount: vacancy.rentAmount ? String(vacancy.rentAmount) : '',
                              description: vacancy.description || ''
                            });
                            setIsDialogOpen(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteVacancy(vacancy.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      ) : (
        filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No leads found</h3>
            <p className="text-gray-400">Add your first lead to start tracking</p>
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.firstName} {lead.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {lead.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</div>}
                        {lead.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.source || '-'}</TableCell>
                    <TableCell>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setEditingLead(lead);
                            setLeadForm({
                              firstName: lead.firstName,
                              lastName: lead.lastName || '',
                              email: lead.email || '',
                              phone: lead.phone || '',
                              status: lead.status,
                              source: lead.source || '',
                              notes: lead.notes || ''
                            });
                            setIsLeadDialogOpen(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      )}
    </div>
  );
};

export default Vacancies;
