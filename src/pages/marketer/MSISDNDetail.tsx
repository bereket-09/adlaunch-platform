import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Video, Upload, Settings, ArrowLeft, Eye, 
  TrendingUp, Gift, Smartphone, Clock, CheckCircle2, XCircle,
  Star, Activity, Calendar, BarChart3, AlertTriangle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/analytics/KPICard";
import ExportButton from "@/components/analytics/ExportButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { analyticsAPI, UserAnalytics, AuditLog } from "@/services/api";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Campaigns", href: "/marketer/campaigns" },
  { icon: Upload, label: "Upload Video", href: "/marketer/upload" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

const MSISDNDetail = () => {
  const { msisdn } = useParams();
  const [userData, setUserData] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (msisdn) {
      fetchUserData();
    }
  }, [msisdn]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getUserDetail(msisdn!);
      if (response.status) {
        setUserData(response);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Demo fallback
      setUserData({
        status: true,
        msisdn: msisdn || "+234801****234",
        total_ads_watched: 12,
        total_rewards: 8,
        ads: [
          { ad_id: "1", status: "completed", completed_at: "2024-01-16T14:32:05Z", reward_granted: true },
          { ad_id: "2", status: "completed", completed_at: "2024-01-16T10:15:22Z", reward_granted: true },
        ],
        audit_logs: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getRewardBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case "started":
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "opened":
        return <Badge className="bg-blue-100 text-blue-700"><Eye className="h-3 w-3 mr-1" />Opened</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEventTypeBadge = (type: string) => {
    const typeConfig: Record<string, { color: string; label: string }> = {
      'link_created': { color: 'bg-blue-100 text-blue-700', label: 'Link Created' },
      'opened': { color: 'bg-cyan-100 text-cyan-700', label: 'Opened' },
      'started_at': { color: 'bg-yellow-100 text-yellow-700', label: 'Started' },
      'completed_at': { color: 'bg-green-100 text-green-700', label: 'Completed' },
      'fraud_attempt_completion_without_start': { color: 'bg-red-100 text-red-700', label: 'Fraud Attempt' },
    };
    const config = typeConfig[type] || { color: 'bg-gray-100 text-gray-700', label: type };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Generate engagement data from ads history
  const engagementData = userData?.ads.reduce((acc: any[], ad) => {
    if (ad.completed_at) {
      const date = new Date(ad.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.ads += 1;
      } else {
        acc.push({ date, ads: 1 });
      }
    }
    return acc;
  }, []) || [];

  const completionRate = userData ? (userData.total_rewards / userData.total_ads_watched * 100) : 0;
  const isHighValue = userData && userData.total_ads_watched >= 10 && completionRate >= 80;

  if (loading) {
    return (
      <DashboardLayout title="MSISDN Details" sidebarItems={sidebarItems} userType="marketer">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading user data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="MSISDN Details"
      sidebarItems={sidebarItems}
      userType="marketer"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/marketer/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-mono text-foreground">{userData?.msisdn}</h1>
                {isHighValue && (
                  <Badge className="bg-yellow-100 text-yellow-700">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                    High Value
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">User engagement profile</p>
            </div>
          </div>
          <ExportButton filename={`msisdn-${msisdn}-report`} />
        </div>

        {/* User Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="card-elevated lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">MSISDN</p>
                  <p className="font-semibold font-mono">{userData?.msisdn}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Ads</p>
                  <p className="font-semibold">{userData?.total_ads_watched}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Rewards</p>
                  <p className="font-semibold">{userData?.total_rewards}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="font-semibold">{completionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Summary */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Rewards Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-muted-foreground">Total Rewards</span>
                <span className="font-bold text-primary">{userData?.total_rewards}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-bold text-green-600">{completionRate.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Ads Watched"
            value={userData?.total_ads_watched || 0}
            icon={Eye}
            trend="neutral"
          />
          <KPICard
            title="Rewards Claimed"
            value={userData?.total_rewards || 0}
            icon={Gift}
            trend="neutral"
          />
          <KPICard
            title="Completion Rate"
            value={`${completionRate.toFixed(1)}%`}
            icon={TrendingUp}
            trend={completionRate >= 80 ? "up" : "neutral"}
          />
          <KPICard
            title="Active Days"
            value={new Set(userData?.ads.map(a => a.completed_at?.split('T')[0])).size || 0}
            icon={Calendar}
            trend="neutral"
          />
        </div>

        {/* Engagement Chart */}
        {engagementData.length > 0 && (
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Engagement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
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
                    <Line type="monotone" dataKey="ads" stroke="hsl(var(--primary))" strokeWidth={3} name="Ads Watched" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ads History */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Ads Watched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>Ad ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead>Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData?.ads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No ad history available
                      </TableCell>
                    </TableRow>
                  ) : (
                    userData?.ads.map((ad, index) => (
                      <TableRow key={index} className="hover:bg-secondary/30">
                        <TableCell className="font-mono text-sm">{ad.ad_id}</TableCell>
                        <TableCell>{getRewardBadge(ad.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {ad.completed_at ? new Date(ad.completed_at).toLocaleString() : '-'}
                        </TableCell>
                        <TableCell>
                          {ad.reward_granted ? (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Granted
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        {userData?.audit_logs && userData.audit_logs.length > 0 && (
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Activity Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead>Event Type</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Fraud Flag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.audit_logs.map((log: AuditLog, index: number) => (
                      <TableRow key={index} className="hover:bg-secondary/30">
                        <TableCell>{getEventTypeBadge(log.type)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{log.token.slice(0, 12)}...</TableCell>
                        <TableCell>{log.ip || '-'}</TableCell>
                        <TableCell>
                          {log.fraud_detected ? (
                            <Badge className="bg-red-100 text-red-700">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Detected
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700">Clean</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MSISDNDetail;
