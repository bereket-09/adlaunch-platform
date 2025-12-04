import { useState } from "react";
import { 
  LayoutDashboard, Users, Video, BarChart3, Settings, DollarSign,
  Save, Shield, Bell, Globe, Database, Mail, Key, Server
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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

const AdminSettings = () => {
  const [platformSettings, setPlatformSettings] = useState({
    platformName: "AdRewards Platform",
    supportEmail: "support@adrewards.com",
    maintenanceMode: false,
    debugMode: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: true,
    sessionTimeout: 30,
    ipWhitelisting: false,
    auditLogging: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    systemAlerts: true,
    fraudAlerts: true,
    budgetAlerts: true,
    dailyReports: true,
    weeklyReports: true,
  });

  const [apiSettings, setApiSettings] = useState({
    rateLimit: 1000,
    timeout: 30,
    retryAttempts: 3,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <DashboardLayout
      title="Platform Settings"
      sidebarItems={sidebarItems}
      userType="admin"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground">Configure global platform settings and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="general" className="gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Server className="h-4 w-4" />
              API Settings
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Database className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
                <CardDescription>Basic platform settings and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input 
                      id="platformName" 
                      value={platformSettings.platformName}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input 
                      id="supportEmail" 
                      type="email"
                      value={platformSettings.supportEmail}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable platform access</p>
                  </div>
                  <Switch 
                    checked={platformSettings.maintenanceMode}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, maintenanceMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed logging for troubleshooting</p>
                  </div>
                  <Switch 
                    checked={platformSettings.debugMode}
                    onCheckedChange={(checked) => setPlatformSettings({ ...platformSettings, debugMode: checked })}
                  />
                </div>

                <Button onClick={handleSave} className="btn-primary-gradient gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure platform security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">All admin users must enable 2FA</p>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactorRequired}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorRequired: checked })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input 
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    className="w-32"
                  />
                  <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">Restrict admin access to specific IPs</p>
                  </div>
                  <Switch 
                    checked={securitySettings.ipWhitelisting}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipWhitelisting: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all admin actions for compliance</p>
                  </div>
                  <Switch 
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                  />
                </div>

                <Button onClick={handleSave} className="btn-primary-gradient gap-2">
                  <Save className="h-4 w-4" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure system notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical system notifications</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, systemAlerts: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fraud Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications for detected fraud</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.fraudAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, fraudAlerts: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">Low budget and overspend warnings</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.budgetAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, budgetAlerts: checked })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive daily performance summaries</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.dailyReports}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, dailyReports: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly analytics reports</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklyReports: checked })}
                  />
                </div>

                <Button onClick={handleSave} className="btn-primary-gradient gap-2">
                  <Save className="h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure API settings and rate limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Rate Limit (requests/min)</Label>
                    <Input 
                      type="number"
                      value={apiSettings.rateLimit}
                      onChange={(e) => setApiSettings({ ...apiSettings, rateLimit: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Timeout (seconds)</Label>
                    <Input 
                      type="number"
                      value={apiSettings.timeout}
                      onChange={(e) => setApiSettings({ ...apiSettings, timeout: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Retry Attempts</Label>
                    <Input 
                      type="number"
                      value={apiSettings.retryAttempts}
                      onChange={(e) => setApiSettings({ ...apiSettings, retryAttempts: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-secondary/30 rounded-lg">
                  <h4 className="font-medium mb-2">API Endpoints</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <p><span className="text-primary">POST</span> /api/v1/depletion-event</p>
                    <p><span className="text-primary">POST</span> /api/v1/reward-fulfillment</p>
                    <p><span className="text-primary">POST</span> /api/v1/sms-gateway</p>
                    <p><span className="text-primary">GET</span> /api/v1/health</p>
                  </div>
                </div>

                <Button onClick={handleSave} className="btn-primary-gradient gap-2">
                  <Save className="h-4 w-4" />
                  Save API Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>Configure third-party service integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Database className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">MNO Integration (BSS/PCRF)</h4>
                        <p className="text-sm text-muted-foreground">Real-time depletion events</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">SMS Gateway</h4>
                        <p className="text-sm text-muted-foreground">Outbound SMS notifications</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Key className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Reward API</h4>
                        <p className="text-sm text-muted-foreground">Data/voice reward fulfillment</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
