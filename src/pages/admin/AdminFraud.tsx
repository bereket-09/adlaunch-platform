import { 
  LayoutDashboard, Users, Video, BarChart3, Settings, DollarSign,
  Shield, AlertTriangle, Ban, CheckCircle2, Eye, Clock, Bot,
  Smartphone, Globe, XCircle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/analytics/KPICard";
import ExportButton from "@/components/analytics/ExportButton";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Shield, label: "Fraud Monitor", href: "/admin/fraud" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const fraudTrend = [
  { date: "Jan 10", legitimate: 12000, suspicious: 45, blocked: 12 },
  { date: "Jan 12", legitimate: 14500, suspicious: 62, blocked: 18 },
  { date: "Jan 14", legitimate: 13200, suspicious: 38, blocked: 8 },
  { date: "Jan 16", legitimate: 15800, suspicious: 85, blocked: 25 },
  { date: "Jan 18", legitimate: 16200, suspicious: 52, blocked: 14 },
  { date: "Jan 20", legitimate: 18000, suspicious: 48, blocked: 11 },
];

const fraudTypes = [
  { name: "Bot Traffic", value: 45, color: "hsl(0, 84%, 60%)" },
  { name: "Rapid Replays", value: 25, color: "hsl(27, 100%, 50%)" },
  { name: "VPN/Proxy", value: 18, color: "hsl(45, 100%, 50%)" },
  { name: "Incomplete Views", value: 12, color: "hsl(var(--gray-400))" },
];

const suspiciousActivity = [
  { id: 1, msisdn: "+234801****234", type: "Bot Traffic", confidence: 92, timestamp: "2024-01-16 14:32:05", campaign: "Summer Sale", status: "blocked" },
  { id: 2, msisdn: "+234802****567", type: "Rapid Replays", confidence: 78, timestamp: "2024-01-16 14:28:12", campaign: "Data Bundle", status: "flagged" },
  { id: 3, msisdn: "+234803****890", type: "VPN/Proxy", confidence: 85, timestamp: "2024-01-16 14:25:33", campaign: "Voice Pack", status: "blocked" },
  { id: 4, msisdn: "+234804****123", type: "Bot Traffic", confidence: 95, timestamp: "2024-01-16 14:22:44", campaign: "Summer Sale", status: "blocked" },
  { id: 5, msisdn: "+234805****456", type: "Incomplete Views", confidence: 65, timestamp: "2024-01-16 14:18:55", campaign: "Holiday Special", status: "flagged" },
  { id: 6, msisdn: "+234806****789", type: "Rapid Replays", confidence: 72, timestamp: "2024-01-16 14:15:22", campaign: "Data Bundle", status: "reviewing" },
];

const blockedIPs = [
  { ip: "192.168.1.***", country: "Unknown", reason: "Bot Activity", blockedAt: "2024-01-16 12:00:00", attempts: 1234 },
  { ip: "10.0.0.***", country: "VPN", reason: "Proxy Detected", blockedAt: "2024-01-15 18:30:00", attempts: 567 },
  { ip: "172.16.0.***", country: "Nigeria", reason: "Suspicious Patterns", blockedAt: "2024-01-15 09:15:00", attempts: 892 },
];

const AdminFraud = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "blocked":
        return <Badge className="bg-red-100 text-red-700"><Ban className="h-3 w-3 mr-1" />Blocked</Badge>;
      case "flagged":
        return <Badge className="bg-yellow-100 text-yellow-700"><AlertTriangle className="h-3 w-3 mr-1" />Flagged</Badge>;
      case "reviewing":
        return <Badge className="bg-blue-100 text-blue-700"><Eye className="h-3 w-3 mr-1" />Reviewing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Fraud Monitoring"
      sidebarItems={sidebarItems}
      userType="admin"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Fraud Detection Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage suspicious activity across the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <RealTimeIndicator label="Monitoring Active" />
            <ExportButton filename="fraud-report" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Fraud Detection Rate"
            value="99.7%"
            icon={Shield}
            trend="up"
            change={0.3}
          />
          <KPICard
            title="Suspicious Activities"
            value={248}
            icon={AlertTriangle}
            trend="down"
            change={-12}
            changeLabel="today"
          />
          <KPICard
            title="Blocked Attempts"
            value={88}
            icon={Ban}
            trend="neutral"
          />
          <KPICard
            title="False Positive Rate"
            value="0.8%"
            icon={CheckCircle2}
            trend="up"
            change={-0.2}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suspicious">Suspicious Activity</TabsTrigger>
            <TabsTrigger value="blocked">Blocked IPs</TabsTrigger>
            <TabsTrigger value="rules">Detection Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fraud Trend */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Traffic Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fraudTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="legitimate" stroke="hsl(var(--primary))" strokeWidth={2} name="Legitimate" />
                        <Line type="monotone" dataKey="suspicious" stroke="hsl(45, 100%, 50%)" strokeWidth={2} name="Suspicious" />
                        <Line type="monotone" dataKey="blocked" stroke="hsl(0, 84%, 60%)" strokeWidth={2} name="Blocked" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Fraud Types */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Fraud Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fraudTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {fraudTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-red-100">
                      <Bot className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bot Detection</p>
                      <p className="text-2xl font-bold">1,234</p>
                      <p className="text-sm text-red-600">Blocked this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-yellow-100">
                      <Globe className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">VPN/Proxy Blocked</p>
                      <p className="text-2xl font-bold">567</p>
                      <p className="text-sm text-yellow-600">This week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue Protected</p>
                      <p className="text-2xl font-bold">$4,521</p>
                      <p className="text-sm text-green-600">Fraud prevented</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suspicious" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Suspicious Activity Log</CardTitle>
                  <CardDescription>Recent flagged and blocked activities</CardDescription>
                </div>
                <ExportButton filename="suspicious-activity" />
              </CardHeader>
              <CardContent>
                <AnalyticsFilters config={{ msisdn: true, status: true, dateRange: true }} />
                
                <div className="mt-4 rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>MSISDN</TableHead>
                        <TableHead>Fraud Type</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suspiciousActivity.map((activity) => (
                        <TableRow key={activity.id} className="hover:bg-secondary/30">
                          <TableCell className="font-mono">{activity.msisdn}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{activity.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${activity.confidence >= 80 ? 'bg-red-500' : 'bg-yellow-500'}`}
                                  style={{ width: `${activity.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm">{activity.confidence}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{activity.campaign}</TableCell>
                          <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                          <TableCell>{getStatusBadge(activity.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm">Review</Button>
                              {activity.status !== "blocked" && (
                                <Button variant="ghost" size="sm" className="text-destructive">Block</Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocked" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Blocked IP Addresses</CardTitle>
                <CardDescription>IPs blocked due to suspicious activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>IP Address</TableHead>
                        <TableHead>Country/Type</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Blocked At</TableHead>
                        <TableHead className="text-right">Attempts</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blockedIPs.map((ip, index) => (
                        <TableRow key={index} className="hover:bg-secondary/30">
                          <TableCell className="font-mono">{ip.ip}</TableCell>
                          <TableCell>{ip.country}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50">{ip.reason}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{ip.blockedAt}</TableCell>
                          <TableCell className="text-right font-medium">{ip.attempts.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Unblock</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Detection Rules</CardTitle>
                <CardDescription>Configure fraud detection parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Bot Detection</h4>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Detects automated traffic patterns and browser fingerprint anomalies</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Rapid Replay Detection</h4>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Flags users attempting to replay ads multiple times quickly</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">VPN/Proxy Detection</h4>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Identifies traffic from known VPN and proxy services</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Device Fingerprinting</h4>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Tracks device characteristics to identify repeat offenders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminFraud;
