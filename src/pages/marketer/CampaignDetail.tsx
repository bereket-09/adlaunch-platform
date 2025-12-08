import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Video, Upload, Settings, ArrowLeft, Eye, Users, 
  TrendingUp, DollarSign, Play, Pause, Download, Calendar, Target,
  Clock, Smartphone, Globe, CheckCircle2, XCircle, RefreshCw
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import KPICard from "@/components/analytics/KPICard";
import FunnelChart from "@/components/analytics/FunnelChart";
import HeatmapChart from "@/components/analytics/HeatmapChart";
import ExportButton from "@/components/analytics/ExportButton";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { analyticsAPI, adAPI, Ad, AdUser } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Campaigns", href: "/marketer/campaigns" },
  { icon: Upload, label: "Upload Video", href: "/marketer/upload" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

// Static data for visualizations (will be bound to analytics endpoints later)
const dailyData = [
  { date: "Jan 10", views: 1200, completions: 1080, spend: 162 },
  { date: "Jan 11", views: 1450, completions: 1305, spend: 195.75 },
  { date: "Jan 12", views: 1680, completions: 1512, spend: 226.8 },
  { date: "Jan 13", views: 1320, completions: 1188, spend: 178.2 },
  { date: "Jan 14", views: 1890, completions: 1701, spend: 255.15 },
  { date: "Jan 15", views: 2100, completions: 1890, spend: 283.5 },
  { date: "Jan 16", views: 1760, completions: 1584, spend: 237.6 },
];

const funnelData = [
  { label: "SMS Sent", value: 25000 },
  { label: "Link Clicked", value: 15800 },
  { label: "Video Started", value: 12400 },
  { label: "Video Completed", value: 11260 },
];

const heatmapData = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [];
  for (const day of days) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        day,
        hour,
        value: Math.floor(Math.random() * 200) + (hour >= 9 && hour <= 21 ? 100 : 20),
      });
    }
  }
  return data;
})();

const deviceData = [
  { name: "Mobile", value: 78, color: "hsl(var(--primary))" },
  { name: "Tablet", value: 14, color: "hsl(var(--orange-600))" },
  { name: "Desktop", value: 8, color: "hsl(var(--gray-400))" },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, '0')}:00`,
  views: Math.floor(Math.random() * 150) + (i >= 9 && i <= 21 ? 100 : 20),
}));

const CampaignDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<Ad | null>(null);
  const [adDetail, setAdDetail] = useState<any>(null);
  const [viewers, setViewers] = useState<AdUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCampaignData();
    }
  }, [id]);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      
      // Fetch ad list to get basic info
      const adsRes = await adAPI.list();
      if (adsRes.status) {
        const ad = adsRes.ads.find(a => a._id === id);
        if (ad) setCampaign(ad);
      }

      // Fetch ad analytics detail
      const detailRes = await analyticsAPI.getAdDetail(id!);
      if (detailRes.status) {
        setAdDetail(detailRes);
      }

      // Fetch ad users/viewers
      const usersRes = await analyticsAPI.getAdUsers(id!);
      if (usersRes.status) {
        setViewers(usersRes.users);
      }
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      // Set demo data
      setCampaign({
        _id: id || "1",
        marketer_id: "m1",
        campaign_name: "Summer Sale 2024",
        title: "Summer Promo Ad",
        cost_per_view: 0.15,
        budget_allocation: 5000,
        remaining_budget: 2660,
        video_file_path: "ads/video.mp4",
        start_date: "2024-01-01",
        end_date: "2024-12-31",
        status: "active",
        created_at: "2024-01-15",
      });
      setAdDetail({
        total_views: 45280,
        opened_views: 48000,
        completed_views: 41102,
        pending_views: 120,
        completion_rate: 0.908,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!campaign) return;
    const newStatus = campaign.status === "active" ? "paused" : "active";
    try {
      await adAPI.update(campaign._id, { status: newStatus });
      toast({ title: newStatus === "active" ? "Campaign activated" : "Campaign paused" });
      fetchCampaignData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
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

  if (loading) {
    return (
      <DashboardLayout title="Campaign Details" sidebarItems={sidebarItems} userType="marketer">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading campaign data...</div>
        </div>
      </DashboardLayout>
    );
  }

  const spent = campaign ? campaign.budget_allocation - campaign.remaining_budget : 0;

  return (
    <DashboardLayout
      title="Campaign Details"
      sidebarItems={sidebarItems}
      userType="marketer"
    >
      <div className="space-y-6">
        {/* Back Button & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/marketer/campaigns">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{campaign?.title}</h1>
                <Badge className={campaign?.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  {campaign?.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{campaign?.campaign_name} • ID: {id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handleToggleStatus}>
              {campaign?.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {campaign?.status === "active" ? "Pause Campaign" : "Activate Campaign"}
            </Button>
            <ExportButton filename={`campaign-${id}-report`} />
          </div>
        </div>

        {/* Campaign Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="card-elevated lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Video Preview */}
                <div className="w-full md:w-64 flex-shrink-0">
                  <div className="aspect-video bg-secondary rounded-lg overflow-hidden relative">
                    <img 
                      src="/placeholder.svg" 
                      alt="Campaign thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                      <div className="p-3 rounded-full bg-primary">
                        <Play className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Campaign Details */}
                <div className="flex-1 space-y-4">
                  <p className="text-muted-foreground">Video: {campaign?.video_file_path}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cost Per Completion</p>
                      <p className="font-semibold">${campaign?.cost_per_view?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-semibold">{new Date(campaign?.created_at || '').toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-semibold">{new Date(campaign?.start_date || '').toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-semibold">{new Date(campaign?.end_date || '').toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Card */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">${spent.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(spent / (campaign?.budget_allocation || 1)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium text-primary">${campaign?.remaining_budget?.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-bold">${campaign?.budget_allocation?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-bold text-primary">{((spent / (campaign?.budget_allocation || 1)) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Views"
            value={adDetail?.total_views || 0}
            change={12.5}
            changeLabel="vs last week"
            icon={Eye}
            trend="up"
          />
          <KPICard
            title="Completions"
            value={adDetail?.completed_views || 0}
            change={8.2}
            changeLabel="vs last week"
            icon={Target}
            trend="up"
          />
          <KPICard
            title="Completion Rate"
            value={`${((adDetail?.completion_rate || 0) * 100).toFixed(1)}%`}
            change={2.1}
            icon={TrendingUp}
            trend="up"
          />
          <KPICard
            title="Unique Users"
            value={viewers.length || adDetail?.opened_views || 0}
            change={5.8}
            icon={Users}
            trend="up"
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="viewers">Viewer Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Performance */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyData}>
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
                        <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Views" />
                        <Area type="monotone" dataKey="completions" stroke="hsl(var(--orange-600))" fill="hsl(var(--orange-600) / 0.2)" name="Completions" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Spend Over Time */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [`$${value}`, 'Spend']}
                        />
                        <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hourly Breakdown */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Hourly Performance (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData}>
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
                      <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Completion Funnel</CardTitle>
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
                      <p className="text-sm text-muted-foreground">SMS → Click</p>
                      <p className="text-2xl font-bold">63.2%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Click → Start</p>
                      <p className="text-2xl font-bold">78.5%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Start → Complete</p>
                      <p className="text-2xl font-bold">90.8%</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary">Overall Rate</p>
                      <p className="text-2xl font-bold text-primary">45.0%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Heatmap */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Engagement Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <HeatmapChart data={heatmapData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Distribution */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Device Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
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
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Audience Stats */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Audience Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Mobile Users</p>
                      <p className="text-2xl font-bold">78%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">New Users</p>
                      <p className="text-2xl font-bold">62%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Returning</p>
                      <p className="text-2xl font-bold">38%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">High Value</p>
                      <p className="text-2xl font-bold">15%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="viewers" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Viewers</CardTitle>
                <ExportButton filename={`campaign-${id}-viewers`} />
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>MSISDN</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Started At</TableHead>
                        <TableHead>Completed At</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No viewer data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        viewers.map((viewer, index) => (
                          <TableRow key={index} className="hover:bg-secondary/30">
                            <TableCell className="font-mono">
                              <Link to={`/marketer/msisdn/${viewer.msisdn}`} className="hover:text-primary">
                                {viewer.msisdn}
                              </Link>
                            </TableCell>
                            <TableCell>{getRewardBadge(viewer.status)}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {viewer.started_at ? new Date(viewer.started_at).toLocaleString() : '-'}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {viewer.completed_at ? new Date(viewer.completed_at).toLocaleString() : '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                {viewer.device_info ? `${viewer.device_info.brand} ${viewer.device_info.model}` : 'Unknown'}
                              </div>
                            </TableCell>
                            <TableCell>
                              {viewer.location?.category || 'Unknown'}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;
