import { useEffect, useState } from "react";
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
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { API_ENDPOINTS } from "@/config/api";
import AdminLayout from "@/components/AdminLayout";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const RATE_COLORS = {
  Premium: "hsl(27, 100%, 50%)",
  Standard: "hsl(27, 100%, 65%)",
  Free: "hsl(27, 100%, 85%)",
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.ANALYTICS.ADMIN_DASHBOARD);
        const json = await res.json();

        if (json.status) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout
        title="Admin Dashboard"
        sidebarItems={sidebarItems}
        userType="admin"
      >
        <div className="p-6 text-muted-foreground">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  const platform = data?.platform || {};
  const viewsData = data?.trends?.monthly_views || [];
  const pieData =
    data?.rate_distribution?.map((r) => ({
      ...r,
      color: RATE_COLORS[r.name] || "hsl(0, 0%, 70%)",
    })) || [];
  const topCampaigns = data?.top_campaigns || [];

  return (
    <AdminLayout
      title="Admin Dashboard"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Platform Views"
            value={platform.views?.toLocaleString() || "0"}
            icon={Eye}
          />
          <StatCard
            title="Active Marketers"
            value={platform.active_marketers || 0}
            icon={Users}
          />
          <StatCard
            title="Active Campaigns"
            value={platform.active_campaigns || 0}
            icon={Video}
          />
          <StatCard
            title="Total Revenue"
            value={`${platform.total_revenue?.toLocaleString() || 0} Br.`}
            icon={DollarSign}
          />
          <StatCard
            title="Engagement Rate"
            value={`${platform.engagement_rate || 0}%`}
            icon={TrendingUp}
          />
          <StatCard
            title="System Health"
            value={`${platform.system_health || 99.9}%`}
            icon={Activity}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Views */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Global View Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData}>
                    <defs>
                      <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopOpacity={0.3} />
                        <stop offset="95%" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      fill="url(#views)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Rate Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rate Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={100}
                    >
                      {pieData.map((p, i) => (
                        <Cell key={i} fill={p.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-sm">{p.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between p-4 rounded-lg bg-secondary/50"
                >
                  <div className="flex gap-4">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {c.marketer}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="font-semibold">
                        {c.views.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">
                        ${c.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">revenue</p>
                    </div>
                  </div>
                </div>
              ))}

              {topCampaigns.length === 0 && (
                <div className="text-muted-foreground text-sm">
                  No campaign data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
