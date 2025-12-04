import { 
  LayoutDashboard, Video, Upload, Settings, Eye, Users, TrendingUp, DollarSign,
  Target, Zap, BarChart3, PieChart, Activity, FileText, ArrowUpRight, ArrowDownRight, Clock
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/analytics/KPICard";
import FunnelChart from "@/components/analytics/FunnelChart";
import HeatmapChart from "@/components/analytics/HeatmapChart";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import MSISDNTable from "@/components/analytics/MSISDNTable";
import CampaignComparison from "@/components/analytics/CampaignComparison";
import ExportButton from "@/components/analytics/ExportButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, Legend,
  ComposedChart
} from "recharts";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Campaigns", href: "/marketer/campaigns" },
  { icon: Upload, label: "Upload Video", href: "/marketer/upload" },
  { icon: BarChart3, label: "Analytics", href: "/marketer/analytics" },
  { icon: FileText, label: "Reports", href: "/marketer/reports" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

// Mock data
const viewsData = [
  { name: "Mon", views: 12000, completions: 10800, spend: 1620 },
  { name: "Tue", views: 18000, completions: 16200, spend: 2430 },
  { name: "Wed", views: 24000, completions: 22080, spend: 3312 },
  { name: "Thu", views: 19000, completions: 17480, spend: 2622 },
  { name: "Fri", views: 28000, completions: 25760, spend: 3864 },
  { name: "Sat", views: 32000, completions: 29440, spend: 4416 },
  { name: "Sun", views: 26000, completions: 23920, spend: 3588 },
];

const funnelData = [
  { label: "SMS Sent", value: 150000 },
  { label: "Link Clicked", value: 89000 },
  { label: "Video Started", value: 72000 },
  { label: "Video Completed", value: 65000 },
];

const heatmapData = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [];
  for (const day of days) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        day,
        hour,
        value: Math.floor(Math.random() * 500) + (hour >= 9 && hour <= 21 ? 300 : 50),
      });
    }
  }
  return data;
})();

const deviceData = [
  { name: "Mobile", value: 72, color: "hsl(var(--primary))" },
  { name: "Tablet", value: 18, color: "hsl(var(--orange-600))" },
  { name: "Desktop", value: 10, color: "hsl(var(--gray-400))" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  views: Math.floor(Math.random() * 3000) + (i >= 9 && i <= 21 ? 2000 : 500),
  completions: Math.floor(Math.random() * 2700) + (i >= 9 && i <= 21 ? 1800 : 400),
}));

const MarketerDashboard = () => {
  return (
    <DashboardLayout
      title="Analytics Dashboard"
      sidebarItems={sidebarItems}
      userType="marketer"
    >
      <div className="space-y-6">
        {/* Header with Real-time indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Campaign Analytics</h1>
            <p className="text-muted-foreground">Real-time performance insights across all campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <RealTimeIndicator />
            <ExportButton filename="dashboard-report" />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Impressions"
            value={1248320}
            change={12.5}
            changeLabel="vs last week"
            icon={Eye}
            trend="up"
          />
          <KPICard
            title="Total Completions"
            value={1123488}
            change={8.2}
            changeLabel="vs last week"
            icon={Target}
            trend="up"
          />
          <KPICard
            title="Completion Rate"
            value="90.0%"
            change={2.1}
            changeLabel="vs last week"
            icon={TrendingUp}
            trend="up"
          />
          <KPICard
            title="Total Spend"
            value="$168,523"
            change={-3.4}
            changeLabel="vs last week"
            icon={DollarSign}
            trend="down"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Average CPC"
            value="$0.15"
            icon={Zap}
            trend="neutral"
            size="sm"
          />
          <KPICard
            title="Unique Users"
            value={452910}
            change={5.8}
            icon={Users}
            trend="up"
            size="sm"
          />
          <KPICard
            title="Reward Success Rate"
            value="98.2%"
            change={0.5}
            icon={Activity}
            trend="up"
            size="sm"
          />
          <KPICard
            title="Avg. Watch Time"
            value="28.4s"
            icon={Clock}
            trend="neutral"
            size="sm"
          />
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
            <TabsTrigger value="msisdn">MSISDN Insights</TabsTrigger>
            <TabsTrigger value="comparison">Campaign Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Trend Chart */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Daily Performance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                        <Area yAxisId="left" type="monotone" dataKey="views" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" name="Views" />
                        <Line yAxisId="left" type="monotone" dataKey="completions" stroke="hsl(var(--orange-600))" strokeWidth={2} name="Completions" />
                        <Bar yAxisId="right" dataKey="spend" fill="hsl(var(--gray-300))" name="Spend ($)" radius={[4, 4, 0, 0]} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Device Distribution */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Device Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Heatmap */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Engagement Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <HeatmapChart data={heatmapData} title="Completions by Day & Hour" />
              </CardContent>
            </Card>

            {/* Hourly Performance */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Hourly Performance (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={2} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area type="monotone" dataKey="views" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.3)" name="Views" />
                      <Area type="monotone" dataKey="completions" stackId="2" stroke="hsl(var(--orange-600))" fill="hsl(var(--orange-600) / 0.3)" name="Completions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Completion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <FunnelChart data={funnelData} />
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Funnel Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">SMS → Click Rate</p>
                      <p className="text-2xl font-bold text-foreground">59.3%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Click → Start Rate</p>
                      <p className="text-2xl font-bold text-foreground">80.9%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Start → Complete Rate</p>
                      <p className="text-2xl font-bold text-foreground">90.3%</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary">Overall Conversion</p>
                      <p className="text-2xl font-bold text-primary">43.3%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="msisdn" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Per-MSISDN Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <MSISDNTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <CampaignComparison />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MarketerDashboard;
