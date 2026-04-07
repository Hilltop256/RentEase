import { useState, useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  Wrench, 
  FileText, 
  Bell, 
  User, 
  LogOut,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  MessageSquare,
  ChevronRight,
  Plus,
  Search,
  Loader2,
  Send,
  Paperclip,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/db';
import { format, differenceInDays } from 'date-fns';

type TenantView = 'overview' | 'payments' | 'maintenance' | 'documents' | 'messages' | 'profile';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<TenantView>('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [payments, setPayments] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [landlord, setLandlord] = useState<any>(null);
  
  // Form states
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium'
  });
  const [messageForm, setMessageForm] = useState({
    content: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadTenantData();
    }
  }, [user?.id]);

  const loadTenantData = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      
      // Load tenant's payments, maintenance, documents
      const [paymentsData, maintenanceData, documentsData, messagesData] = await Promise.all([
        db.payments.getAll(user.id),
        db.maintenance.getAll(user.id),
        db.documents.getAll(user.id),
        db.messages.getAll(user.id)
      ]);
      
      setPayments(paymentsData);
      setMaintenanceRequests(maintenanceData);
      setDocuments(documentsData.filter(d => d.category === 'tenant' || d.tenantId === user.id));
      setMessages(messagesData);
      
    } catch (error) {
      console.error('Failed to load tenant data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await db.maintenance.create({
        title: maintenanceForm.title,
        description: maintenanceForm.description,
        category: maintenanceForm.category as any,
        priority: maintenanceForm.priority as any,
        status: 'open',
        propertyId: '', // Would need to link to tenant's property
        tenantId: user.id
      }, user.id);
      
      setMaintenanceForm({ title: '', description: '', category: 'other', priority: 'medium' });
      setIsMaintenanceDialogOpen(false);
      loadTenantData();
    } catch (error) {
      console.error('Failed to submit maintenance request:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !landlord?.id) return;

    try {
      await db.messages.send({
        senderId: user.id,
        receiverId: landlord.id,
        content: messageForm.content
      });
      
      setMessageForm({ content: '' });
      setIsMessageDialogOpen(false);
      loadTenantData();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Calculate stats from real data
  const paidPayments = payments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'overdue');
  const openMaintenance = maintenanceRequests.filter(m => m.status === 'open' || m.status === 'in_progress');
  const unreadMessages = messages.filter(m => !m.isRead && m.receiverId === user?.id);

  const nextPayment = pendingPayments[0];
  const totalPaid = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const renderOverview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h2>
          <p className="text-emerald-100 mt-1">Here's what's happening with your rental</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {nextPayment ? `Due ${format(new Date(nextPayment.dueDate), 'MMM d')}` : 'All Paid!'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {nextPayment ? `$${Number(nextPayment.amount).toLocaleString()}` : '$0'}
                  </p>
                  {nextPayment && (
                    <p className="text-sm text-red-600">
                      {differenceInDays(new Date(nextPayment.dueDate), new Date()) <= 0 
                        ? 'Overdue!' 
                        : `Due in ${differenceInDays(new Date(nextPayment.dueDate), new Date())} days`}
                    </p>
                  )}
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Paid This Year</p>
                  <p className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{paidPayments.length} payments</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Open Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{openMaintenance.length}</p>
                  <p className="text-sm text-gray-500">Maintenance items</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Wrench className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('payments')}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {paidPayments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No payment history yet</p>
              ) : (
                <div className="space-y-3">
                  {paidPayments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium">${Number(payment.amount).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{payment.paymentMethod || 'Bank Transfer'}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(payment.paidDate || payment.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Maintenance Requests</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('maintenance')}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {maintenanceRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No maintenance requests</p>
              ) : (
                <div className="space-y-3">
                  {maintenanceRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          request.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'
                        }`}>
                          {request.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{request.title}</p>
                          <p className="text-xs text-gray-500 capitalize">{request.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <Badge className={
                        request.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }>
                        {request.status === 'completed' ? 'Done' : 'In Progress'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payments</h2>
      </div>

      {nextPayment && (
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100">Current Balance</p>
                <p className="text-3xl font-bold">${Number(nextPayment.amount).toLocaleString()}</p>
                <p className="text-emerald-100 text-sm mt-1">Due {format(new Date(nextPayment.dueDate), 'MMMM d, yyyy')}</p>
              </div>
              <Button variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100" disabled>
                Pay Now (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No payment history</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      payment.status === 'paid' ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}>
                      {payment.status === 'paid' ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      ) : (
                        <Clock className="h-6 w-6 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">Rent Payment</p>
                      <p className="text-sm text-gray-500">{payment.paymentMethod || 'Bank Transfer'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(payment.amount).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(payment.paidDate || payment.dueDate), 'MMM d, yyyy')}
                    </p>
                    <Badge className={
                      payment.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                      payment.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Maintenance Requests</h2>
        <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Maintenance Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Leaky faucet in kitchen"
                  value={maintenanceForm.title}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={maintenanceForm.category} onValueChange={(v) => setMaintenanceForm({ ...maintenanceForm, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="appliance">Appliance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={maintenanceForm.priority} onValueChange={(v) => setMaintenanceForm({ ...maintenanceForm, priority: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Submit Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {maintenanceRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No maintenance requests</p>
              <p className="text-sm text-gray-400">Submit a new request using the button above</p>
            </CardContent>
          </Card>
        ) : (
          maintenanceRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      request.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}>
                      {request.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{request.title}</p>
                      <p className="text-sm text-gray-500">{request.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted {format(new Date(request.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={
                      request.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }>
                      {request.status === 'open' ? 'Open' : 
                       request.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {request.priority}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Documents</h2>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents available</p>
            <p className="text-sm text-gray-400">Your landlord will add your lease and other documents here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{doc.type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Added {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => window.open(doc.fileUrl, '_blank')}>
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Send className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to Landlord</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Type your message here..."
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Send Message
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400">Send a message to your landlord using the button above</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isFromMe = message.senderId === user?.id;
            return (
              <Card key={message.id} className={isFromMe ? 'bg-emerald-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isFromMe ? 'bg-emerald-200' : 'bg-gray-200'
                    }`}>
                      <MessageSquare className={`h-5 w-5 ${isFromMe ? 'text-emerald-700' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{isFromMe ? 'You' : 'Landlord'}</p>
                        {!message.isRead && !isFromMe && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'payments':
        return renderPayments();
      case 'maintenance':
        return renderMaintenance();
      case 'documents':
        return renderDocuments();
      case 'messages':
        return renderMessages();
      default:
        return renderOverview();
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-emerald-600" />
            <span className="font-bold text-lg">RentEase</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessages.length }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as TenantView)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  currentView === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge ? (
                  <Badge className="ml-auto bg-red-500 text-white text-xs">{item.badge}</Badge>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">Tenant</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold capitalize">{currentView}</h1>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {unreadMessages.length}
                </span>
              )}
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-6xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default TenantDashboard;
