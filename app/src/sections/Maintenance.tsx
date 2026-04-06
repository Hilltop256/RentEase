import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Wrench, 
  Droplets, 
  Zap, 
  Wind,
  Refrigerator,
  Home,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { maintenanceRequests } from '@/data/mockData';
import type { MaintenanceRequest } from '@/types';
import { format, parseISO } from 'date-fns';

const Maintenance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    return matchesSearch && matchesPriority && matchesTab;
  });

  const stats = {
    open: maintenanceRequests.filter(r => r.status === 'open').length,
    inProgress: maintenanceRequests.filter(r => r.status === 'in_progress').length,
    completed: maintenanceRequests.filter(r => r.status === 'completed').length,
    urgent: maintenanceRequests.filter(r => r.priority === 'urgent').length,
    totalCost: maintenanceRequests.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0)
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plumbing':
        return <Droplets className="h-4 w-4" />;
      case 'electrical':
        return <Zap className="h-4 w-4" />;
      case 'hvac':
        return <Wind className="h-4 w-4" />;
      case 'appliance':
        return <Refrigerator className="h-4 w-4" />;
      case 'structural':
        return <Home className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-gray-100 text-gray-700 border-gray-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      high: 'bg-red-100 text-red-700 border-red-200',
      urgent: 'bg-red-500 text-white'
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: 'bg-red-100 text-red-700 border-red-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-500">Track and manage property maintenance issues.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Maintenance Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
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
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="appliance">Appliance</SelectItem>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Brief description of the issue" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Detailed description of the problem..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Create Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Open</p>
                <p className="text-xl font-bold">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">In Progress</p>
                <p className="text-xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Urgent</p>
                <p className="text-xl font-bold">{stats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-violet-100 p-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Cost</p>
                <p className="text-xl font-bold">${stats.totalCost.toLocaleString()}</p>
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
            placeholder="Search requests..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
            All Requests
          </TabsTrigger>
          <TabsTrigger value="open" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
            Open
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="m-0 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="border-gray-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedRequest(request)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        request.priority === 'urgent' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {getCategoryIcon(request.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.title}</h3>
                        <p className="text-sm text-gray-500">{request.propertyName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityBadge(request.priority)}>
                        {request.priority}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Assign Contractor</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">{request.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{request.tenantName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(request.createdAt), 'MMM d')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusBadge(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </div>

                  {(request.estimatedCost || request.actualCost) && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {request.actualCost ? `Actual: $${request.actualCost}` : `Est: $${request.estimatedCost}`}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Request Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Maintenance Request Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      selectedRequest.priority === 'urgent' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {getCategoryIcon(selectedRequest.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedRequest.title}</h3>
                      <p className="text-gray-500">{selectedRequest.propertyName}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityBadge(selectedRequest.priority)}>
                    {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)} Priority
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Requested By</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.tenantName}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Date Submitted</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{format(parseISO(selectedRequest.createdAt), 'MMMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Category</h4>
                    <Badge variant="outline" className="capitalize">
                      {selectedRequest.category}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Status</h4>
                    <Badge className={getStatusBadge(selectedRequest.status)}>
                      {getStatusIcon(selectedRequest.status)}
                      <span className="ml-1 capitalize">{selectedRequest.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </div>

                {selectedRequest.assignedTo && (
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Assigned To</h4>
                    <p className="font-medium">{selectedRequest.assignedTo}</p>
                  </div>
                )}

                {(selectedRequest.estimatedCost || selectedRequest.actualCost) && (
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Cost</h4>
                    <div className="flex gap-4">
                      {selectedRequest.estimatedCost && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Estimated</p>
                          <p className="font-medium">${selectedRequest.estimatedCost.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedRequest.actualCost && (
                        <div className="p-3 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-gray-500">Actual</p>
                          <p className="font-medium text-emerald-600">${selectedRequest.actualCost.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedRequest.completedAt && (
                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">Completed On</h4>
                    <p>{format(parseISO(selectedRequest.completedAt), 'MMMM d, yyyy')}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Close Request</Button>
                  {selectedRequest.status !== 'completed' && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Mark as Complete
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

export default Maintenance;
