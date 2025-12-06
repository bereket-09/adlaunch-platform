import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Video,
  BarChart3,
  Settings,
  DollarSign,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Calendar,
  Eye,
  Ban,
  CheckCircle,
  Shield,
  Edit2,
  Wallet,
  History,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { marketerAPI, budgetAPI, Marketer, Transaction } from "@/services/api";
import { Link } from "react-router-dom";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Shield, label: "Fraud Monitor", href: "/admin/fraud" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminMarketers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Marketer Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newMarketer, setNewMarketer] = useState({
    name: "",
    email: "",
    password: "",
    total_budget: "",
    contact_info: "",
  });
  
  // Edit Marketer Dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMarketer, setEditingMarketer] = useState<Marketer | null>(null);
  
  // Top-up Dialog
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [topupData, setTopupData] = useState({
    marketerId: "",
    amount: "",
    payment_method: "credit_card",
    description: "",
  });
  
  // Transactions Dialog
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMarketerName, setSelectedMarketerName] = useState("");
  
  const { toast } = useToast();

  // Fetch marketers on mount
  useEffect(() => {
    fetchMarketers();
  }, []);

  const fetchMarketers = async () => {
    try {
      setLoading(true);
      const response = await marketerAPI.list();
      if (response.status) {
        setMarketers(response.marketers);
      }
    } catch (error) {
      console.error('Error fetching marketers:', error);
      // Use demo data for fallback
      setMarketers([
        {
          _id: "1",
          name: "TechCorp Inc.",
          email: "marketing@techcorp.com",
          total_budget: 100000,
          remaining_budget: 75000,
          contact_info: "marketing@techcorp.com",
          status: "active",
          created_at: "2024-01-15T00:00:00.000Z",
        },
        {
          _id: "2",
          name: "Style House",
          email: "ads@stylehouse.com",
          total_budget: 75000,
          remaining_budget: 52000,
          contact_info: "ads@stylehouse.com",
          status: "active",
          created_at: "2024-02-20T00:00:00.000Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMarketers = marketers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMarketer = async () => {
    try {
      const response = await marketerAPI.create({
        name: newMarketer.name,
        email: newMarketer.email,
        password: newMarketer.password,
        total_budget: parseFloat(newMarketer.total_budget) || 0,
        contact_info: newMarketer.contact_info || newMarketer.email,
        status: "pendingPassChange",
      });

      if (response.status) {
        toast({
          title: "Marketer created",
          description: `${newMarketer.name} has been added successfully.`,
        });
        setIsCreateOpen(false);
        setNewMarketer({ name: "", email: "", password: "", total_budget: "", contact_info: "" });
        fetchMarketers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create marketer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMarketer = async () => {
    if (!editingMarketer) return;

    try {
      const response = await marketerAPI.update(editingMarketer._id, {
        name: editingMarketer.name,
        email: editingMarketer.email,
        total_budget: editingMarketer.total_budget,
        contact_info: editingMarketer.contact_info,
        status: editingMarketer.status,
      });

      if (response.status) {
        toast({
          title: "Marketer updated",
          description: "Changes saved successfully.",
        });
        setIsEditOpen(false);
        setEditingMarketer(null);
        fetchMarketers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update marketer.",
        variant: "destructive",
      });
    }
  };

  const handleTopup = async () => {
    try {
      const response = await budgetAPI.topup({
        marketerId: topupData.marketerId,
        amount: parseFloat(topupData.amount),
        payment_method: topupData.payment_method,
        description: topupData.description,
      });

      if (response.status) {
        toast({
          title: "Top-up successful",
          description: `$${topupData.amount} added to marketer's budget.`,
        });
        setIsTopupOpen(false);
        setTopupData({ marketerId: "", amount: "", payment_method: "credit_card", description: "" });
        fetchMarketers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process top-up.",
        variant: "destructive",
      });
    }
  };

  const handleViewTransactions = async (marketer: Marketer) => {
    setSelectedMarketerName(marketer.name);
    try {
      const response = await budgetAPI.getTransactions(marketer._id);
      if (response.status) {
        setTransactions(response.transactions);
      }
    } catch (error) {
      setTransactions([]);
    }
    setIsTransactionsOpen(true);
  };

  const handleToggleStatus = async (marketer: Marketer) => {
    const newStatus = marketer.status === "active" ? "inactive" : "active";
    try {
      await marketerAPI.update(marketer._id, { status: newStatus });
      toast({
        title: newStatus === "active" ? "Marketer reactivated" : "Marketer suspended",
        description: `${marketer.name} is now ${newStatus}.`,
      });
      fetchMarketers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>;
      case "pendingPassChange":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Manage Marketers"
      sidebarItems={sidebarItems}
      userType="admin"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search marketers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="gradient" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Marketer
          </Button>
        </div>

        {/* Marketers Table */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Marketers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Marketer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Total Budget</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Loading marketers...
                      </TableCell>
                    </TableRow>
                  ) : filteredMarketers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No marketers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMarketers.map((marketer) => (
                      <TableRow key={marketer._id} className="table-row">
                        <TableCell className="font-medium">{marketer.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {marketer.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(marketer.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${marketer.total_budget.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium text-primary">
                          ${marketer.remaining_budget.toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(marketer.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingMarketer(marketer);
                                  setIsEditOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setTopupData({ ...topupData, marketerId: marketer._id });
                                  setIsTopupOpen(true);
                                }}
                              >
                                <Wallet className="h-4 w-4 mr-2" />
                                Top-up Budget
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewTransactions(marketer)}>
                                <History className="h-4 w-4 mr-2" />
                                View Transactions
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleStatus(marketer)}>
                                {marketer.status === "active" ? (
                                  <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Reactivate
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{marketers.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Marketers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {marketers.filter((m) => m.status === "active").length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">
                  ${marketers.reduce((acc, m) => acc + m.total_budget, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total Budget</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  ${marketers.reduce((acc, m) => acc + m.remaining_budget, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Available Balance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Marketer Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Marketer</DialogTitle>
              <DialogDescription>
                Create a new marketer account for the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={newMarketer.name}
                  onChange={(e) => setNewMarketer({ ...newMarketer, name: e.target.value })}
                  placeholder="e.g., Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMarketer.email}
                  onChange={(e) => setNewMarketer({ ...newMarketer, email: e.target.value })}
                  placeholder="marketing@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Initial Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newMarketer.password}
                  onChange={(e) => setNewMarketer({ ...newMarketer, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_budget">Initial Budget ($)</Label>
                <Input
                  id="total_budget"
                  type="number"
                  value={newMarketer.total_budget}
                  onChange={(e) => setNewMarketer({ ...newMarketer, total_budget: e.target.value })}
                  placeholder="e.g., 10000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_info">Contact Info</Label>
                <Input
                  id="contact_info"
                  value={newMarketer.contact_info}
                  onChange={(e) => setNewMarketer({ ...newMarketer, contact_info: e.target.value })}
                  placeholder="Phone or email"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleCreateMarketer}>
                Create Marketer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Marketer Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Marketer</DialogTitle>
              <DialogDescription>
                Update marketer details.
              </DialogDescription>
            </DialogHeader>
            {editingMarketer && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={editingMarketer.name}
                    onChange={(e) => setEditingMarketer({ ...editingMarketer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={editingMarketer.email}
                    onChange={(e) => setEditingMarketer({ ...editingMarketer, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Info</Label>
                  <Input
                    value={editingMarketer.contact_info}
                    onChange={(e) => setEditingMarketer({ ...editingMarketer, contact_info: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleUpdateMarketer}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Top-up Dialog */}
        <Dialog open={isTopupOpen} onOpenChange={setIsTopupOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Top-up Budget</DialogTitle>
              <DialogDescription>
                Add funds to marketer's budget.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  value={topupData.amount}
                  onChange={(e) => setTopupData({ ...topupData, amount: e.target.value })}
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Input
                  value={topupData.payment_method}
                  onChange={(e) => setTopupData({ ...topupData, payment_method: e.target.value })}
                  placeholder="credit_card, bank_transfer, etc."
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={topupData.description}
                  onChange={(e) => setTopupData({ ...topupData, description: e.target.value })}
                  placeholder="Optional note"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTopupOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleTopup}>
                Process Top-up
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Transactions Dialog */}
        <Dialog open={isTransactionsOpen} onOpenChange={setIsTransactionsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction History - {selectedMarketerName}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No transactions found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx._id}>
                        <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={tx.type === 'topup' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${tx.type === 'topup' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'topup' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {tx.description || tx.reason || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminMarketers;
