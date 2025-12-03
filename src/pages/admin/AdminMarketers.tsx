import { useState } from "react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const marketers = [
  {
    id: "1",
    name: "TechCorp Inc.",
    email: "marketing@techcorp.com",
    createdAt: "2024-01-15",
    campaigns: 12,
    status: "active",
    totalSpent: 24500,
  },
  {
    id: "2",
    name: "Style House",
    email: "ads@stylehouse.com",
    createdAt: "2024-02-20",
    campaigns: 8,
    status: "active",
    totalSpent: 18200,
  },
  {
    id: "3",
    name: "QuickEats",
    email: "growth@quickeats.io",
    createdAt: "2024-03-05",
    campaigns: 15,
    status: "active",
    totalSpent: 31400,
  },
  {
    id: "4",
    name: "GameZone",
    email: "marketing@gamezone.com",
    createdAt: "2024-03-18",
    campaigns: 6,
    status: "inactive",
    totalSpent: 12800,
  },
  {
    id: "5",
    name: "Wanderlust Travel",
    email: "ads@wanderlust.com",
    createdAt: "2024-04-01",
    campaigns: 4,
    status: "active",
    totalSpent: 8900,
  },
];

const AdminMarketers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newMarketer, setNewMarketer] = useState({ name: "", email: "", password: "" });
  const { toast } = useToast();

  const filteredMarketers = marketers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMarketer = () => {
    toast({
      title: "Marketer created",
      description: `${newMarketer.name} has been added successfully.`,
    });
    setIsCreateOpen(false);
    setNewMarketer({ name: "", email: "", password: "" });
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
                    <TableHead className="text-center">Campaigns</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarketers.map((marketer) => (
                    <TableRow key={marketer.id} className="table-row">
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
                          {new Date(marketer.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{marketer.campaigns}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${marketer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            marketer.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }
                        >
                          {marketer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Campaigns
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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
                  ))}
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
                  {marketers.reduce((acc, m) => acc + m.campaigns, 0)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total Campaigns</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  ${marketers.reduce((acc, m) => acc + m.totalSpent, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Platform Revenue</p>
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
      </div>
    </DashboardLayout>
  );
};

export default AdminMarketers;
