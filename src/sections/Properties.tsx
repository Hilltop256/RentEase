import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Bed, 
  Bath, 
  Maximize, 
  MapPin,
  Home,
  Building,
  Hotel,
  Warehouse,
  Loader2,
  Trash2,
  Edit,
  Building2,
  Store
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import type { Property } from '@/types';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment', icon: Building },
  { value: 'house', label: 'House', icon: Home },
  { value: 'condo', label: 'Condominium', icon: Hotel },
  { value: 'townhouse', label: 'Townhouse', icon: Warehouse },
  { value: 'room', label: 'Room', icon: Building2 },
  { value: 'shop', label: 'Shop/Commercial', icon: Store },
  { value: 'plot', label: 'Plot/Land', icon: MapPin }
];

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    plotNumber: string;
    blockNumber: string;
    landMark: string;
    city: string;
    district: string;
    type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'room' | 'shop' | 'plot';
    bedrooms: string;
    bathrooms: string;
    squareFeet: string;
    monthlyRent: string;
    status: 'vacant' | 'occupied' | 'maintenance';
    imageUrl: string;
    description: string;
    isFurnished: boolean;
    isFitForHabitation: boolean;
  }>({
    name: '',
    plotNumber: '',
    blockNumber: '',
    landMark: '',
    city: '',
    district: '',
    type: 'apartment',
    bedrooms: '1',
    bathrooms: '1',
    squareFeet: '',
    monthlyRent: '',
    status: 'vacant',
    imageUrl: '',
    description: '',
    isFurnished: false,
    isFitForHabitation: true
  });

  useEffect(() => {
    loadProperties();
  }, [user?.id]);

  const loadProperties = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const data = await db.properties.getAll(user.id);
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.plotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.landMark?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      occupied: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      vacant: 'bg-amber-100 text-amber-700 border-amber-200',
      maintenance: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeIcon = (type: string) => {
    const found = PROPERTY_TYPES.find(t => t.value === type);
    const Icon = found?.icon || Home;
    return <Icon className="h-5 w-5" />;
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await db.properties.delete(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const propertyData = {
        name: formData.name,
        plotNumber: formData.plotNumber || undefined,
        blockNumber: formData.blockNumber || undefined,
        landMark: formData.landMark || undefined,
        city: formData.city,
        district: formData.district || undefined,
        type: formData.type,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        squareFeet: formData.squareFeet ? Number(formData.squareFeet) : 0,
        monthlyRent: formData.monthlyRent ? Number(formData.monthlyRent) : 0,
        status: formData.status,
        imageUrl: formData.imageUrl || undefined,
        description: formData.description || undefined,
        amenities: [],
        isFurnished: formData.isFurnished,
        isFitForHabitation: formData.isFitForHabitation
      };

      if (editingProperty) {
        await db.properties.update(editingProperty.id, propertyData);
      } else {
        await db.properties.create(propertyData, user.id);
      }

      setFormData({
        name: '',
        plotNumber: '',
        blockNumber: '',
        landMark: '',
        city: '',
        district: '',
        type: 'apartment',
        bedrooms: '1',
        bathrooms: '1',
        squareFeet: '',
        monthlyRent: '',
        status: 'vacant',
        imageUrl: '',
        description: '',
        isFurnished: false,
        isFitForHabitation: true
      });
      setEditingProperty(null);
      setIsDialogOpen(false);
      loadProperties();
    } catch (error) {
      console.error('Failed to save property:', error);
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name || '',
      plotNumber: property.plotNumber || '',
      blockNumber: property.blockNumber || '',
      landMark: property.landMark || '',
      city: property.city || '',
      district: property.district || '',
      type: (property.type || 'apartment') as 'apartment' | 'house' | 'condo' | 'townhouse' | 'room' | 'shop' | 'plot',
      bedrooms: String(property.bedrooms || 1),
      bathrooms: String(property.bathrooms || 1),
      squareFeet: String(property.squareFeet || ''),
      monthlyRent: String(property.monthlyRent || ''),
      status: (property.status || 'vacant') as 'vacant' | 'occupied' | 'maintenance',
      imageUrl: property.imageUrl || '',
      description: property.description || '',
      isFurnished: property.isFurnished || false,
      isFitForHabitation: property.isFitForHabitation !== false
    });
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0
    }).format(amount);
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
          <h2 className="text-2xl font-bold">Properties</h2>
          <p className="text-gray-500">Manage your rental properties in Uganda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingProperty(null);
            setFormData({
              name: '',
              plotNumber: '',
              blockNumber: '',
              landMark: '',
              city: '',
              district: '',
              type: 'apartment',
              bedrooms: '1',
              bathrooms: '1',
              squareFeet: '',
              monthlyRent: '',
              status: 'vacant',
              imageUrl: '',
              description: '',
              isFurnished: false,
              isFitForHabitation: true
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Kampala Apartments Unit 1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="plotNumber">Plot Number</Label>
                  <Input
                    id="plotNumber"
                    placeholder="e.g., Plot 123"
                    value={formData.plotNumber}
                    onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockNumber">Block Number</Label>
                  <Input
                    id="blockNumber"
                    placeholder="e.g., Block A"
                    value={formData.blockNumber}
                    onChange={(e) => setFormData({ ...formData, blockNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landMark">Landmark / Street</Label>
                <Input
                  id="landMark"
                  placeholder="e.g., Near Kampala Road, opposite factory"
                  value={formData.landMark}
                  onChange={(e) => setFormData({ ...formData, landMark: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Area/Town *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Kampala"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    placeholder="e.g., Wakiso"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Vacant</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select value={formData.bedrooms} onValueChange={(v) => setFormData({ ...formData, bedrooms: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Select value={formData.bathrooms} onValueChange={(v) => setFormData({ ...formData, bathrooms: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="2.5">2.5</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="squareFeet">Sq Ft</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    placeholder="800"
                    value={formData.squareFeet}
                    onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent (UGX) *</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  placeholder="500000"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-400">Enter amount in Ugandan Shillings</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Property description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFurnished"
                    checked={formData.isFurnished}
                    onChange={(e) => setFormData({ ...formData, isFurnished: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isFurnished" className="text-sm">Furnished</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFitForHabitation"
                    checked={formData.isFitForHabitation}
                    onChange={(e) => setFormData({ ...formData, isFitForHabitation: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isFitForHabitation" className="text-sm">Fit for Habitation</Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                {editingProperty ? 'Update' : 'Add'} Property
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, plot number, or landmark..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {PROPERTY_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="vacant">Vacant</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No properties found</h3>
          <p className="text-gray-400">Add your first property to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-gray-100">
                {property.imageUrl ? (
                  <img 
                    src={property.imageUrl} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getTypeIcon(property.type)}
                  </div>
                )}
                <Badge className={`absolute top-3 right-3 ${getStatusBadge(property.status)}`}>
                  {property.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditProperty(property)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {property.plotNumber && `Plot ${property.plotNumber}`}
                    {property.blockNumber && `, Block ${property.blockNumber}`}
                  </span>
                </div>
                {property.landMark && (
                  <div className="text-xs text-gray-400 mb-2">
                    {property.landMark}
                  </div>
                )}

                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{property.squareFeet} sqft</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-lg font-bold text-emerald-600">
                    {formatCurrency(property.monthlyRent)}/mo
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{property.type}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;
