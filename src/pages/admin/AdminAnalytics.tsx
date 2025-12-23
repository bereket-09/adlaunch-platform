import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Video, BarChart3, Settings, DollarSign,
  Eye, Activity, Target, Zap, Shield, Globe, CheckCircle2
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

import {
  AreaChart, Area, Line, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

import { API_ENDPOINTS } from "@/config/api";
import AdminLayout from "@/components/AdminLayout";

/* ---------------------------------- */
/* Sidebar */
/* ---------------------------------- */
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Shield, label: "Fraud Monitor", href: "/admin/fraud" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
type AdminDashboardResponse = {
  status: boolean;
  platform: {
    total_views: number;
    daily_active_users: number;
    completion_rate: number;
    total_revenue: number;
    avg_latency: number;
    system_uptime: number;
  };
  trends: {
    name: string;
    views: number;
    completions: number;
  }[];
  funnel: {
    label: string;
    value: number;
  }[];
  marketer_performance: {
    name: string;
    campaigns: number;
    views: number;
    spend: number;
    efficiency: number;
  }[];
};

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
const AdminAnalytics = () => {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.ANALYTICS.ADMIN_ANALYTICS);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load admin analytics", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Platform Analytics">
        <div className="p-6">Loading analytics…</div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout title="Platform Analytics">
        <div className="p-6 text-red-600">Failed to load analytics</div>
      </AdminLayout>
    );
  }

  const { platform, trends, funnel, marketer_performance } = data;

  const platformTrend = trends.map(t => ({
    date: t.name,
    views: t.views,
    completions: t.completions,
    revenue: platform.total_revenue
  }));

  return (
    <AdminLayout
      title="Platform Analytics"
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Deep Platform Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive platform-wide performance insights
            </p>
          </div>
          <div className="flex gap-3">
            <RealTimeIndicator />
            <ExportButton filename="platform-analytics" />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <KPICard title="Total Views" value={platform.total_views} icon={Eye} />
          <KPICard title="Daily Active Users" value={platform.daily_active_users} icon={Users} />
          <KPICard title="Completion Rate" value={`${platform.completion_rate}%`} icon={Target} />
          <KPICard title="Total Revenue" value={`${platform.total_revenue} Br.`} icon={DollarSign} />
          <KPICard title="Avg Latency" value={`${platform.avg_latency}ms`} icon={Zap} />
          <KPICard title="System Uptime" value={`${platform.system_uptime}%`} icon={Activity} />
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="funnel">Funnel</TabsTrigger>
            <TabsTrigger value="marketers">Marketers</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platformTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area dataKey="views" stroke="var(--primary)" fill="var(--primary)" />
                    <Line dataKey="completions" stroke="orange" />
                    <Bar dataKey="revenue" fill="#ccc" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funnel */}
          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle>Platform Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <FunnelChart data={funnel} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketers */}
          <TabsContent value="marketers">
            <Card>
              <CardHeader>
                <CardTitle>Marketer Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsFilters config={{ dateRange: true }} />
                <table className="w-full mt-4 text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-right p-2">Campaigns</th>
                      <th className="text-right p-2">Views</th>
                      <th className="text-right p-2">Spend</th>
                      <th className="text-right p-2">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketer_performance.map(m => (
                      <tr key={m.name} className="border-b">
                        <td className="p-2">{m.name}</td>
                        <td className="p-2 text-right">{m.campaigns}</td>
                        <td className="p-2 text-right">{m.views}</td>
                        <td className="p-2 text-right">{m.spend} Br.</td>
                        <td className="p-2 text-right">{m.efficiency}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health – UNCHANGED */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 flex gap-3">
                  <CheckCircle2 className="text-green-600" />
                  <div>
                    <p className="text-sm">API Status</p>
                    <p className="font-semibold text-green-600">Operational</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex gap-3">
                  <Activity className="text-green-600" />
                  <div>
                    <p className="text-sm">Database</p>
                    <p className="font-semibold text-green-600">Healthy</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex gap-3">
                  <Globe className="text-green-600" />
                  <div>
                    <p className="text-sm">CDN</p>
                    <p className="font-semibold text-green-600">Active</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 flex gap-3">
                  <Zap />
                  <div>
                    <p className="text-sm">Avg Response</p>
                    <p className="font-semibold">92ms</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
