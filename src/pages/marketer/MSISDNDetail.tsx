import { useParams, Link } from "react-router-dom";
import { 
  LayoutDashboard, Video, Upload, Settings, ArrowLeft, Eye, 
  TrendingUp, Gift, Smartphone, Clock, CheckCircle2, XCircle,
  Star, Activity, Calendar, BarChart3
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

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Campaigns", href: "/marketer/campaigns" },
  { icon: Upload, label: "Upload Video", href: "/marketer/upload" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

// Mock MSISDN data
const msisdnData = {
  msisdn: "+234801****234",
  firstSeen: "2024-01-10 09:15:22",
  lastSeen: "2024-01-16 14:32:05",
  totalAdsWatched: 12,
  totalRewards: 8,
  completionRate: 91.7,
  isHighValue: true,
  totalDataEarned: "600MB",
  totalVoiceEarned: "30 mins",
  deviceType: "Mobile",
  browser: "Chrome Mobile",
  os: "Android 13",
};

const activityHistory = [
  { date: "2024-01-16 14:32:05", campaign: "Summer Sale 2024", completion: 100, reward: "success", earned: "50MB Data" },
  { date: "2024-01-16 10:15:22", campaign: "Data Bundle Offer", completion: 100, reward: "success", earned: "100MB Data" },
  { date: "2024-01-15 18:45:33", campaign: "Voice Pack Deal", completion: 78, reward: "failed", earned: "-" },
  { date: "2024-01-15 12:20:44", campaign: "Summer Sale 2024", completion: 100, reward: "success", earned: "50MB Data" },
  { date: "2024-01-14 09:30:55", campaign: "Holiday Special", completion: 100, reward: "success", earned: "75MB Data" },
  { date: "2024-01-13 16:22:11", campaign: "Data Bundle Offer", completion: 100, reward: "success", earned: "100MB Data" },
  { date: "2024-01-12 11:45:33", campaign: "Summer Sale 2024", completion: 45, reward: "failed", earned: "-" },
  { date: "2024-01-11 14:10:22", campaign: "Voice Pack Deal", completion: 100, reward: "success", earned: "10 mins Voice" },
];

const engagementData = [
  { date: "Jan 10", ads: 1 },
  { date: "Jan 11", ads: 1 },
  { date: "Jan 12", ads: 1 },
  { date: "Jan 13", ads: 2 },
  { date: "Jan 14", ads: 1 },
  { date: "Jan 15", ads: 3 },
  { date: "Jan 16", ads: 3 },
];

const MSISDNDetail = () => {
  const { msisdn } = useParams();

  const getRewardBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Success</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
                <h1 className="text-2xl font-bold font-mono text-foreground">{msisdn || msisdnData.msisdn}</h1>
                {msisdnData.isHighValue && (
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
                  <p className="text-sm text-muted-foreground">First Seen</p>
                  <p className="font-semibold">{msisdnData.firstSeen.split(' ')[0]}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Last Seen</p>
                  <p className="font-semibold">{msisdnData.lastSeen.split(' ')[0]}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Device</p>
                  <p className="font-semibold">{msisdnData.deviceType}</p>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Browser</p>
                  <p className="font-semibold">{msisdnData.browser}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Summary */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Rewards Earned</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-muted-foreground">Total Data</span>
                <span className="font-bold text-primary">{msisdnData.totalDataEarned}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-muted-foreground">Total Voice</span>
                <span className="font-bold text-primary">{msisdnData.totalVoiceEarned}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Ads Watched"
            value={msisdnData.totalAdsWatched}
            icon={Eye}
            trend="neutral"
          />
          <KPICard
            title="Rewards Claimed"
            value={msisdnData.totalRewards}
            icon={Gift}
            trend="neutral"
          />
          <KPICard
            title="Completion Rate"
            value={`${msisdnData.completionRate}%`}
            icon={TrendingUp}
            trend="up"
          />
          <KPICard
            title="Active Days"
            value={7}
            icon={Calendar}
            trend="neutral"
          />
        </div>

        {/* Engagement Chart */}
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

        {/* Activity History */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Activity History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Reward Status</TableHead>
                    <TableHead>Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityHistory.map((activity, index) => (
                    <TableRow key={index} className="hover:bg-secondary/30">
                      <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                      <TableCell>
                        <Link to={`/marketer/campaigns/1`} className="hover:text-primary font-medium">
                          {activity.campaign}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${activity.completion === 100 ? 'bg-green-500' : 'bg-primary'}`}
                              style={{ width: `${activity.completion}%` }}
                            />
                          </div>
                          <span className="text-sm">{activity.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRewardBadge(activity.reward)}</TableCell>
                      <TableCell className={activity.earned !== "-" ? "text-primary font-medium" : "text-muted-foreground"}>
                        {activity.earned}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MSISDNDetail;
