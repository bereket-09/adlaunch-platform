import { useState } from "react";
import { 
  LayoutDashboard, Users, Video, BarChart3, Settings, DollarSign,
  Save, Plus, Trash2, Edit2, Shield
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Shield, label: "Fraud Monitor", href: "/admin/fraud" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const rateTiers = [
  { id: 1, name: "Free", rate: 0.00, description: "Basic tier for new advertisers", campaigns: 145 },
  { id: 2, name: "Standard", rate: 0.10, description: "Default rate for most campaigns", campaigns: 523 },
  { id: 3, name: "Premium", rate: 0.15, description: "Priority placement and better targeting", campaigns: 224 },
  { id: 4, name: "Enterprise", rate: 0.20, description: "Custom solutions for large advertisers", campaigns: 45 },
];

const marketerLimits = [
  { id: 1, marketer: "TechCorp Inc.", maxBudget: 100000, currentSpend: 45000, monthlyLimit: 50000, status: "active" },
  { id: 2, marketer: "Style House", maxBudget: 75000, currentSpend: 32000, monthlyLimit: 40000, status: "active" },
  { id: 3, marketer: "QuickEats", maxBudget: 150000, currentSpend: 58000, monthlyLimit: 60000, status: "warning" },
  { id: 4, marketer: "GameZone", maxBudget: 50000, currentSpend: 22000, monthlyLimit: 25000, status: "active" },
  { id: 5, marketer: "Wanderlust", maxBudget: 80000, currentSpend: 38000, monthlyLimit: 45000, status: "active" },
];

const AdminBudget = () => {
  const [globalSettings, setGlobalSettings] = useState({
    autoDeduction: true,
    budgetAlertThreshold: 75,
    pauseCampaignsAtZero: true,
    allowNegativeBalance: false,
  });

  const handleSave = () => {
    toast.success("Budget settings saved successfully");
  };

  return (
    <DashboardLayout
      title="Budget Controls"
      sidebarItems={sidebarItems}
      userType="admin"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget & Rate Controls</h1>
          <p className="text-muted-foreground">Manage platform-wide budget settings and rate tiers</p>
        </div>

        <Tabs defaultValue="rates" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="rates">Rate Tiers</TabsTrigger>
            <TabsTrigger value="limits">Marketer Limits</TabsTrigger>
            <TabsTrigger value="settings">Global Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="rates" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>CPC Rate Tiers</CardTitle>
                  <CardDescription>Configure cost-per-completion rates for different tiers</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="btn-primary-gradient gap-2">
                      <Plus className="h-4 w-4" />
                      Add Tier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Rate Tier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Tier Name</Label>
                        <Input placeholder="e.g., Premium Plus" />
                      </div>
                      <div className="space-y-2">
                        <Label>Rate ($ per completion)</Label>
                        <Input type="number" step="0.01" placeholder="0.15" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input placeholder="Description of this tier" />
                      </div>
                      <Button className="w-full btn-primary-gradient">Create Tier</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Tier Name</TableHead>
                        <TableHead>Rate (CPC)</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Active Campaigns</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rateTiers.map((tier) => (
                        <TableRow key={tier.id} className="hover:bg-secondary/30">
                          <TableCell className="font-medium">{tier.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              ${tier.rate.toFixed(2)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{tier.description}</TableCell>
                          <TableCell className="text-right">{tier.campaigns}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Total Revenue (This Month)</p>
                  <p className="text-3xl font-bold text-primary">$62,450</p>
                  <p className="text-sm text-green-600 mt-1">+22.5% vs last month</p>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Average CPC</p>
                  <p className="text-3xl font-bold">$0.12</p>
                  <p className="text-sm text-muted-foreground mt-1">Across all campaigns</p>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">Pending Deductions</p>
                  <p className="text-3xl font-bold">$1,234</p>
                  <p className="text-sm text-muted-foreground mt-1">Processing in next cycle</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="limits" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Marketer Budget Limits</CardTitle>
                <CardDescription>Set individual budget limits for each marketer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Marketer</TableHead>
                        <TableHead className="text-right">Max Budget</TableHead>
                        <TableHead className="text-right">Current Spend</TableHead>
                        <TableHead className="text-right">Monthly Limit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marketerLimits.map((marketer) => (
                        <TableRow key={marketer.id} className="hover:bg-secondary/30">
                          <TableCell className="font-medium">{marketer.marketer}</TableCell>
                          <TableCell className="text-right">${marketer.maxBudget.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${(marketer.currentSpend / marketer.monthlyLimit) > 0.9 ? 'bg-red-500' : 'bg-primary'}`}
                                  style={{ width: `${(marketer.currentSpend / marketer.monthlyLimit) * 100}%` }}
                                />
                              </div>
                              ${marketer.currentSpend.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${marketer.monthlyLimit.toLocaleString()}</TableCell>
                          <TableCell>
                            {marketer.status === "active" ? (
                              <Badge className="bg-green-100 text-green-700">Active</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit Limits</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Global Budget Settings</CardTitle>
                <CardDescription>Configure platform-wide budget behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Budget Deduction</Label>
                    <p className="text-sm text-muted-foreground">Automatically deduct from marketer budget per completion</p>
                  </div>
                  <Switch 
                    checked={globalSettings.autoDeduction}
                    onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, autoDeduction: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Budget Alert Threshold (%)</Label>
                  <Input 
                    type="number" 
                    value={globalSettings.budgetAlertThreshold}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, budgetAlertThreshold: parseInt(e.target.value) })}
                    className="w-32"
                  />
                  <p className="text-sm text-muted-foreground">Send alert when budget usage reaches this percentage</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Pause at Zero Budget</Label>
                    <p className="text-sm text-muted-foreground">Automatically pause campaigns when budget is exhausted</p>
                  </div>
                  <Switch 
                    checked={globalSettings.pauseCampaignsAtZero}
                    onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, pauseCampaignsAtZero: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Negative Balance</Label>
                    <p className="text-sm text-muted-foreground">Allow campaigns to run with negative budget (not recommended)</p>
                  </div>
                  <Switch 
                    checked={globalSettings.allowNegativeBalance}
                    onCheckedChange={(checked) => setGlobalSettings({ ...globalSettings, allowNegativeBalance: checked })}
                  />
                </div>

                <Button onClick={handleSave} className="btn-primary-gradient gap-2">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminBudget;
