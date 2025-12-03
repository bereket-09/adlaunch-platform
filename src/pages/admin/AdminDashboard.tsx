import {
  LayoutDashboard,
  Users,
  Video,
  BarChart3,
  Settings,
  Eye,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const viewsData = [
  { name: "Jan", views: 124000 },
  { name: "Feb", views: 145000 },
  { name: "Mar", views: 189000 },
  { name: "Apr", views: 210000 },
  { name: "May", views: 278000 },
  { name: "Jun", views: 312000 },
];

const topCampaigns = [
  { name: "Tech Launch 2024", marketer: "TechCorp Inc.", views: 89420, revenue: 4471 },
  { name: "Summer Fashion", marketer: "Style House", views: 72340, revenue: 3617 },
  { name: "Food Delivery Promo", marketer: "QuickEats", views: 65890, revenue: 3294 },
  { name: "Gaming Console Ad", marketer: "GameZone", views: 58210, revenue: 2910 },
  { name: "Travel Deals", marketer: "Wanderlust", views: 45670, revenue: 2283 },
];

const pieData = [
  { name: "Standard", value: 45, color: "hsl(27, 100%, 50%)" },
  { name: "Premium", value: 30, color: "hsl(27, 100%, 65%)" },
  { name: "Free", value: 25, color: "hsl(27, 100%, 85%)" },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout
      title="Admin Dashboard"
      sidebarItems={sidebarItems}
      userType="admin"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Platform Views"
            value="1.24M"
            change="+18.2%"
            changeType="positive"
            icon={Eye}
          />
          <StatCard
            title="Active Marketers"
            value="248"
            change="+12 this week"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Active Campaigns"
            value="892"
            change="+45 this week"
            changeType="positive"
            icon={Video}
          />
          <StatCard
            title="Total Revenue"
            value="$62.4K"
            change="+22.5%"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Engagement Rate"
            value="94.8%"
            change="+1.2%"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="System Health"
            value="99.9%"
            change="All systems operational"
            changeType="positive"
            icon={Activity}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Views Trend */}
          <Card className="card-elevated lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Global View Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(27, 100%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(27, 100%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Rate Distribution */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Rate Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Campaigns */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.map((campaign, index) => (
                <div
                  key={campaign.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.marketer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{campaign.views.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">${campaign.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">revenue</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
