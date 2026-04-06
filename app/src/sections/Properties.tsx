import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Bed, 
  Bath, 
  Maximize, 
  MapPin,
  Home,
  Building,
  Hotel,
  Warehouse
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { properties } from '@/data/mockData';
import type { Property } from '@/types';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
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
    switch (type) {
      case 'apartment':
        return <Building className="h-4 w-4" />;
      case 'house':
        return <Home className="h-4 w-4" />;
      case 'condo':
        return <Hotel className="h-4 w-4" />;
      case 'townhouse':
        return <Warehouse className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500">Manage your rental properties and track their status.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Name</label>
                <Input placeholder="e.g., Sunset Gardens" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input placeholder="Street address" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input placeholder="City" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input placeholder="State" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ZIP</label>
                  <Input placeholder="ZIP" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms</label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bathrooms</label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Square Feet</label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Monthly Rent</label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Save Property</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search properties..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden border-gray-200 group hover:shadow-lg transition-shadow">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={property.imageUrl} 
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge className={getStatusBadge(property.status)}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedProperty(property)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Property</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{property.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{property.city}, {property.state}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  {getTypeIcon(property.type)}
                  <span className="capitalize">{property.type}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms} bd</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms} ba</span>
                </div>
                <div className="flex items-center gap-1">
                  <Maximize className="h-4 w-4" />
                  <span>{property.squareFeet.toLocaleString()} sqft</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Monthly Rent</p>
                  <p className="font-semibold text-emerald-600">${property.monthlyRent.toLocaleString()}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProperty(property)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Detail Dialog */}
      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-3xl">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProperty.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedProperty.imageUrl} 
                    alt={selectedProperty.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-gray-500">Address</h4>
                    <p className="font-medium">{selectedProperty.address}</p>
                    <p className="font-medium">{selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-500">Type</h4>
                      <p className="font-medium capitalize">{selectedProperty.type}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Status</h4>
                      <Badge className={getStatusBadge(selectedProperty.status)}>
                        {selectedProperty.status.charAt(0).toUpperCase() + selectedProperty.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-500">Bedrooms</h4>
                      <p className="font-medium">{selectedProperty.bedrooms}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Bathrooms</h4>
                      <p className="font-medium">{selectedProperty.bathrooms}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500">Square Feet</h4>
                      <p className="font-medium">{selectedProperty.squareFeet.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Monthly Rent</h4>
                    <p className="text-2xl font-bold text-emerald-600">${selectedProperty.monthlyRent.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Description</h4>
                    <p className="text-sm text-gray-600">{selectedProperty.description}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Properties;
