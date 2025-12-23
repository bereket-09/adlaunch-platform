import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Video,
  BarChart3,
  Settings,
  DollarSign,
  Shield,
  AlertTriangle,
  Ban,
  CheckCircle2,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/analytics/KPICard";
import ExportButton from "@/components/analytics/ExportButton";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  { icon: Shield, label: "Fraud Monitor", href: "/admin/fraud" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const COLORS = ["#ef4444", "#f59e0b", "#6366f1", "#9ca3af"];

const AdminFraud = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any>(null);
  const [fraudTrend, setFraudTrend] = useState<any[]>([]);
  const [fraudTypes, setFraudTypes] = useState<any[]>([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState<any[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.ANALYTICS.ADMIN_FRAUD);
      const data = await res.json();

      if (!data?.status) return;

      setKpis(data.kpis);
      setFraudTrend(data.fraud_trend ?? []);
      setFraudTypes(data.fraud_types ?? []);
      setSuspiciousActivity(data.suspicious_activity ?? []);
      setBlockedIPs(data.blocked_ips ?? []);
    } catch (err) {
      console.error("Failed to load fraud dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => (
    <Badge className="bg-red-100 text-red-700">
      <Ban className="h-3 w-3 mr-1" />
      {status.toUpperCase()}
    </Badge>
  );

  if (loading) {
    return (
      <AdminLayout
        title="Fraud Monitoring"
      >
        <p className="text-muted-foreground">Loading fraud analytics…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Fraud Monitoring"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Fraud Detection Dashboard
            </h1>
            <p className="text-muted-foreground">
              Live fraud monitoring and enforcement
            </p>
          </div>
          <div className="flex gap-3">
            <RealTimeIndicator label="Monitoring Active" />
            <ExportButton filename="fraud-report" />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Fraud Traffic Rate"
            value={`${kpis.fraud_detection_rate}%`}
            icon={Shield}
          />
          <KPICard
            title="Suspicious Activities"
            value={kpis.suspicious_activities}
            icon={AlertTriangle}
          />
          <KPICard
            title="Blocked Attempts"
            value={kpis.blocked_attempts}
            icon={Ban}
          />
          <KPICard
            title="False Positive Rate"
            value={`${kpis.false_positive_rate}%`}
            icon={CheckCircle2}
          />
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suspicious">Suspicious Activity</TabsTrigger>
            <TabsTrigger value="blocked">Blocked IPs</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Analysis</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fraudTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line dataKey="legitimate" stroke="#22c55e" />
                      <Line dataKey="suspicious" stroke="#f59e0b" />
                      <Line dataKey="blocked" stroke="#ef4444" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fraud Type Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {fraudTypes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No fraud types recorded
                    </p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={fraudTypes} dataKey="value" nameKey="name">
                          {fraudTypes.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Suspicious */}
          <TabsContent value="suspicious">
            <Card>
              <CardHeader>
                <CardTitle>Suspicious Activity Log</CardTitle>
                <CardDescription>Blocked fraud attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsFilters config={{ msisdn: true, dateRange: true }} />
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>MSISDN</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suspiciousActivity.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono">{a.msisdn}</TableCell>
                        <TableCell>{a.type}</TableCell>
                        <TableCell>{a.confidence}%</TableCell>
                        <TableCell>{a.campaign}</TableCell>
                        <TableCell>
                          {new Date(a.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(a.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocked IPs */}
          <TabsContent value="blocked">
            <Card>
              <CardHeader>
                <CardTitle>Blocked IP Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Blocked At</TableHead>
                      <TableHead className="text-right">Attempts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedIPs.map((ip, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono">{ip.ip}</TableCell>
                        <TableCell>{ip.reason}</TableCell>
                        <TableCell>
                          {new Date(ip.blockedAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {ip.attempts}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminFraud;
