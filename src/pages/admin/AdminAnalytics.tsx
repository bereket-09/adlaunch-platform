import { 
  LayoutDashboard, Users, Video, BarChart3, Settings, DollarSign,
  Eye, TrendingUp, Activity, Target, Zap, Globe, Clock, AlertTriangle,
  CheckCircle2, XCircle, Shield
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/analytics/KPICard";
import FunnelChart from "@/components/analytics/FunnelChart";
import HeatmapChart from "@/components/analytics/HeatmapChart";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import ExportButton from "@/components/analytics/ExportButton";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend,
  ScatterChart, Scatter, ZAxis
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

const platformTrend = [
  { date: "Jan 1", views: 42000, completions: 38000, revenue: 5700 },
  { date: "Jan 5", views: 48000, completions: 43500, revenue: 6525 },
  { date: "Jan 10", views: 52000, completions: 47000, revenue: 7050 },
  { date: "Jan 15", views: 58000, completions: 52500, revenue: 7875 },
  { date: "Jan 20", views: 61000, completions: 55200, revenue: 8280 },
  { date: "Jan 25", views: 67000, completions: 60800, revenue: 9120 },
  { date: "Jan 30", views: 72000, completions: 65500, revenue: 9825 },
];

const marketerPerformance = [
  { name: "TechCorp Inc.", campaigns: 12, spend: 45000, views: 320000, efficiency: 92 },
  { name: "Style House", campaigns: 8, spend: 32000, views: 245000, efficiency: 88 },
  { name: "QuickEats", campaigns: 15, spend: 58000, views: 420000, efficiency: 95 },
  { name: "GameZone", campaigns: 6, spend: 22000, views: 165000, efficiency: 85 },
  { name: "Wanderlust", campaigns: 10, spend: 38000, views: 290000, efficiency: 90 },
];

const regionData = [
  { name: "Lagos", value: 35, color: "hsl(var(--primary))" },
  { name: "Abuja", value: 25, color: "hsl(var(--orange-600))" },
  { name: "Port Harcourt", value: 18, color: "hsl(27, 100%, 70%)" },
  { name: "Kano", value: 12, color: "hsl(27, 100%, 80%)" },
  { name: "Others", value: 10, color: "hsl(var(--gray-400))" },
];

const hourlyLoad = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  concurrent: Math.floor(Math.random() * 8000) + (i >= 9 && i <= 21 ? 5000 : 1000),
  latency: Math.floor(Math.random() * 50) + 80,
}));

const heatmapData = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [];
  for (const day of days) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        day,
        hour,
        value: Math.floor(Math.random() * 2000) + (hour >= 9 && hour <= 21 ? 1500 : 300),
      });
    }
  }
  return data;
})();

const funnelData = [
  { label: "Total SMS Sent", value: 1500000 },
  { label: "Links Clicked", value: 890000 },
  { label: "Videos Started", value: 720000 },
  { label: "Videos Completed", value: 650000 },
  { label: "Rewards Issued", value: 638000 },
];

const AdminAnalytics = () => {
  return (
    <DashboardLayout
      title="Platform Analytics"
      sidebarItems={sidebarItems}
      userType="admin"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Deep Platform Analytics</h1>
            <p className="text-muted-foreground">Comprehensive platform-wide performance insights</p>
          </div>
          <div className="flex items-center gap-3">
            <RealTimeIndicator />
            <ExportButton filename="platform-analytics" />
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <KPICard title="Total Platform Views" value="12.4M" change={18.2} icon={Eye} trend="up" size="sm" />
          <KPICard title="Daily Active Users" value="245K" change={12.5} icon={Users} trend="up" size="sm" />
          <KPICard title="Completion Rate" value="90.5%" change={2.1} icon={Target} trend="up" size="sm" />
          <KPICard title="Total Revenue" value="$624K" change={22.5} icon={DollarSign} trend="up" size="sm" />
          <KPICard title="Avg Latency" value="92ms" change={-5.2} icon={Zap} trend="up" size="sm" />
          <KPICard title="System Uptime" value="99.97%" icon={Activity} trend="neutral" size="sm" />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
            <TabsTrigger value="marketers">Marketer Performance</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Trend */}
              <Card className="card-elevated lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Platform Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={platformTrend}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#colorViews)" name="Views" />
                        <Line yAxisId="left" type="monotone" dataKey="completions" stroke="hsl(var(--orange-600))" strokeWidth={2} name="Completions" />
                        <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--gray-300))" name="Revenue ($)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Distribution */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Regional Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={regionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {regionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Heatmap */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Activity Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <HeatmapChart data={heatmapData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Platform-Wide Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <FunnelChart data={funnelData} />
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Conversion Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">SMS → Click Rate</p>
                      <p className="text-2xl font-bold">59.3%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Click → Start Rate</p>
                      <p className="text-2xl font-bold">80.9%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Video Completion Rate</p>
                      <p className="text-2xl font-bold">90.3%</p>
                    </div>
                    <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600">Reward Success Rate</p>
                      <p className="text-2xl font-bold text-green-700">98.2%</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-primary">Overall Platform Conversion</p>
                    <p className="text-3xl font-bold text-primary">42.5%</p>
                    <p className="text-sm text-muted-foreground mt-1">From SMS sent to reward issued</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketers" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Top Marketer Performance</CardTitle>
                <ExportButton filename="marketer-performance" />
              </CardHeader>
              <CardContent>
                <AnalyticsFilters config={{ dateRange: true }} />
                
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Marketer</th>
                        <th className="text-right py-3 px-4 font-semibold">Campaigns</th>
                        <th className="text-right py-3 px-4 font-semibold">Total Spend</th>
                        <th className="text-right py-3 px-4 font-semibold">Total Views</th>
                        <th className="text-right py-3 px-4 font-semibold">Efficiency Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketerPerformance.map((marketer) => (
                        <tr key={marketer.name} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-3 px-4 font-medium">{marketer.name}</td>
                          <td className="py-3 px-4 text-right">{marketer.campaigns}</td>
                          <td className="py-3 px-4 text-right">${marketer.spend.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">{marketer.views.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${marketer.efficiency >= 90 ? 'bg-green-500' : 'bg-primary'}`}
                                  style={{ width: `${marketer.efficiency}%` }}
                                />
                              </div>
                              <span className="font-medium">{marketer.efficiency}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-100">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">API Status</p>
                      <p className="font-semibold text-green-600">Operational</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-100">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Database</p>
                      <p className="font-semibold text-green-600">Healthy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-100">
                      <Globe className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CDN Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-100">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                      <p className="font-semibold">92ms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Concurrent Users & Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyLoad}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={2} />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="concurrent" stroke="hsl(var(--primary))" strokeWidth={2} name="Concurrent Users" />
                      <Line yAxisId="right" type="monotone" dataKey="latency" stroke="hsl(var(--orange-600))" strokeWidth={2} name="Latency (ms)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
