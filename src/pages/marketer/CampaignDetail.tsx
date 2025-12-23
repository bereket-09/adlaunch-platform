import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Video,
  Upload,
  Settings,
  ArrowLeft,
  Eye,
  Users,
  TrendingUp,
  DollarSign,
  Play,
  Pause,
  Download,
  Calendar,
  Target,
  Clock,
  Smartphone,
  Globe,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileText,
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { analyticsAPI, adAPI, Ad, AdUser, fetchMedia } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import MarketerLayout from "@/components/MarketerLayout";
import { API_ENDPOINTS } from "@/config/api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import VideoThumbnail from "./VideoThumbnail ";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Campaigns", href: "/marketer/campaigns" },
  // { icon: Upload, label: "Upload Video", href: "/marketer/upload" },
  { icon: FileText, label: "Reports", href: "/marketer/reports" },
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
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = [];
  for (const day of days) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        day,
        hour,
        value:
          Math.floor(Math.random() * 200) +
          (hour >= 9 && hour <= 21 ? 100 : 20),
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
  hour: `${i.toString().padStart(2, "0")}:00`,
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
      // const adsRes = await adAPI.list();
      // if (adsRes.status) {
      //   const ad = adsRes.ads.find((a) => a._id === id);
      //   if (ad) setCampaign(ad);
      // }

      // Fetch ad analytics detail
      const detailRes = await analyticsAPI.getAdDetail(id!);
      // console.log("🚀 ~ fetchCampaignData ~ detailRes:", detailRes);
      if (detailRes.status) {
        setAdDetail(detailRes);
        setCampaign(detailRes.adInfo);
      }

      // Fetch ad users/viewers
      const usersRes = await analyticsAPI.getAdUsers(id!);
      if (usersRes.status) {
        setViewers(usersRes.users);
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
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

  // const handleToggleStatus = async () => {
  //   if (!campaign) return;
  //   const newStatus = campaign.status === "active" ? "paused" : "active";
  //   try {
  //     await adAPI.update(campaign._id, { status: newStatus });
  //     toast({
  //       title:
  //         newStatus === "active" ? "Campaign activated" : "Campaign paused",
  //     });
  //     fetchCampaignData();
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update status.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const getRewardBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "started":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "opened":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Eye className="h-3 w-3 mr-1" />
            Opened
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handlePlay = (adID: string) => {
    const videoUrl = API_ENDPOINTS.AD.VIDEO(adID); // streaming URL
    setVideoSrc(videoUrl); // set the <video> src
    setPreviewOpen(true); // open preview modal/dialog
  };

  if (loading) {
    return (
      <MarketerLayout title="Campaign Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading campaign data...</div>
        </div>
      </MarketerLayout>
    );
  }

  const spent = campaign
    ? campaign.budget_allocation - campaign.remaining_budget
    : 0;

  interface ExportSheets {
    [sheetName: string]: any[];
  }

  const formatExportData = (
    adListRes: any,
    adDetailRes: any,
    adUsersRes: any
  ): ExportSheets => {
    // console.log("🚀 ~ formatExportData ~ adUsersRes:", adUsersRes)
    // console.log("🚀 ~ formatExportData ~ adDetailRes:", adDetailRes)
    // console.log("🚀 ~ formatExportData ~ adListRes:", adListRes)
    const sheets: ExportSheets = {};

    // ----------- 1. Campaign Info -----------
    if (adListRes.status && adDetailRes.status) {
      const ad = adListRes;
      if (ad) {
        sheets["Campaign Info"] = [
          {
            Campaign_Name: ad.campaign_name,
            Title: ad.title,
            Cost_Per_View: ad.cost_per_view,
            Budget_Allocated: ad.budget_allocation,
            Remaining_Budget: ad.remaining_budget,
            Start_Date: ad.start_date,
            End_Date: ad.end_date,
            Status: ad.status,
            Created_At: ad.created_at,
          },
        ];
      }
    }

    // ----------- 2. Daily Analytics -----------
    sheets["Daily Analytics"] =
      adDetailRes.analytics.dailyData?.map((day: any) => ({
        Date: day.date,
        Views: day.views,
        Completions: day.completions,
        Spend: day.spend,
        SMS_Sent: adDetailRes.analytics.sms_sent || 0,
      })) || [];

    // ----------- 3. Funnel Data -----------
    // Convert funnel to "remaining/not done" counts if desired
    const funnelStages = adDetailRes.analytics.funnelData || [];
    const remainingCounts: any[] = [];
    for (let i = 0; i < funnelStages.length; i++) {
      const current = funnelStages[i];
      const prevValue = i === 0 ? 0 : funnelStages[i - 1].value;
      remainingCounts.push({
        Stage: `${current.label} (remaining)`,
        Count: Math.max(current.value - prevValue, 0),
      });
    }
    sheets["Funnel"] = remainingCounts;

    // ----------- 4. Device Stats (non-zero only) -----------
    sheets["Device Stats"] =
      adDetailRes.analytics.deviceData
        ?.filter((d: any) => d.value > 0)
        .map((d: any) => ({
          Device: d.name,
          Percentage: d.value + "%",
        })) || [];

    // ----------- 5. Hourly Data -----------
    sheets["Hourly Views"] =
      adDetailRes.analytics.hourlyData?.map((hour: any) => ({
        Hour: hour.hour,
        Views: hour.views,
      })) || [];

    // ----------- 6. Budget -----------
    sheets["Budget"] = [
      {
        Spent: adDetailRes.budget.spent,
        Remaining: adDetailRes.budget.remaining_budget,
        Total: adDetailRes.budget.budget_allocation,
        UsagePercent: adDetailRes.budget.usage_percent.toFixed(1) + "%",
      },
    ];

    // ----------- 7. Users -----------
    sheets["Users"] =
      adUsersRes.users?.map((u: any) => ({
        MSISDN: u.msisdn,
        Status: u.status,
        Opened_At: u.opened_at || "",
        Started_At: u.started_at || "",
        Completed_At: u.completed_at || "",
        Device_Model: u.device_info?.model || "",
        Device_Brand: u.device_info?.brand || "",
        IP: u.ip,
        Location: u.location?.category || "",
      })) || [];

    return sheets;
  };

  // const sheets = ;

  return (
    <MarketerLayout
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
                <h1 className="text-2xl font-bold text-foreground">
                  {campaign?.title}
                </h1>
                <Badge
                  className={
                    campaign?.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }
                >
                  {campaign?.status?.toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {campaign?.campaign_name} • ID: {id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <Button
              variant="outline"
              className="gap-2"
              onClick={handleToggleStatus}
            >
              {campaign?.status === "active" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {campaign?.status === "active"
                ? "Pause Campaign"
                : "Activate Campaign"}
            </Button> */}
            {/* <ExportButton
              data={formatExportData(campaign, adDetail, viewers)}
              filename={`campaign_${id}_analytics`}
            /> */}
          </div>
        </div>

        {/* Campaign Info & Budget Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign Info */}
          <Card className="card-elevated lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Video Preview */}
                {/* <div className="w-full md:w-64 flex-shrink-0"> */}
                {/* <div className="aspect-video bg-secondary rounded-xl overflow-hidden relative group cursor-pointer">
                    <img
                      src= "/placeholder.svg"
                      
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-3 rounded-full bg-primary shadow-lg">
                        <Play className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  </div> */}
                {/* </div> */}
                <div className="w-full md:w-64 flex-shrink-0">
                  <div
                    className="aspect-video bg-secondary rounded-lg overflow-hidden relative cursor-pointer"
                    onClick={() => handlePlay(campaign._id)}
                  >
                    <VideoThumbnail videoSrc={videoSrc || "/placeholder.svg"} />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="p-3 rounded-full bg-primary">
                        <Play className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="flex-1 space-y-4">
                  <h2 className="text-lg font-semibold">{campaign?.title}</h2>
                  <p className="text-muted-foreground">
                    {campaign?.campaign_name}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cost Per Completion
                      </p>
                      <p className="font-semibold">
                        {campaign?.cost_per_view?.toFixed(2)} Br.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-semibold">
                        {new Date(
                          campaign?.created_at || ""
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Start Date
                      </p>
                      <p className="font-semibold">
                        {new Date(
                          campaign?.start_date || ""
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-semibold">
                        {new Date(
                          campaign?.end_date || ""
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Marketer</p>
                      <p className="font-semibold">
                        {adDetail.marketerInfo?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        className={`${
                          campaign?.status === "active"
                            ? "bg-green-100 text-green-700"
                            : campaign?.status === "paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {adDetail.adInfo?.status.toUpperCase()}
                      </Badge>
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
              {/* Spent / Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-medium">
                    {adDetail?.budget?.spent?.toLocaleString()} Br.
                  </span>
                </div>

                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((adDetail?.budget?.spent || 0) /
                          (adDetail?.budget?.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium text-primary">
                    {adDetail?.budget?.remaining_budget?.toLocaleString()} Br.
                  </span>
                </div>
              </div>

              {/* Total Budget / Usage */}
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-bold">
                    {adDetail?.budget?.budget_allocation?.toLocaleString()} Br.
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-bold text-primary">
                    {(
                      ((adDetail?.budget?.spent || 0) /
                        (adDetail?.budget?.budget_allocation || 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
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
                      <AreaChart data={adDetail.analytics.dailyData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
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
                          fill="hsl(var(--primary) / 0.2)"
                          name="Views"
                        />
                        <Area
                          type="monotone"
                          dataKey="completions"
                          stroke="hsl(var(--orange-600))"
                          fill="hsl(var(--orange-600) / 0.2)"
                          name="Completions"
                        />
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
                      <BarChart data={adDetail.analytics.dailyData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(v) => `${v} Br.`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => [`${value} Br`, "Spend"]}
                        />
                        <Bar
                          dataKey="spend"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hourly Breakdown */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">
                  Hourly Performance (Today)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={adDetail.analytics.hourlyData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="hour"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        interval={2}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
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
                  <FunnelChart data={adDetail.analytics.funnelData} />
                </CardContent>
              </Card>

              {/* Conversion Metrics */}
              {/* Conversion Drop-offs */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Drop-offs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* SMS → Click Drop-off */}
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        SMS → Click
                      </p>
                      <p className="text-2xl font-bold">
                        {(adDetail.analytics.funnelData.find(
                          (f) => f.label === "SMS Sent"
                        )?.value || 0) -
                          (adDetail.analytics.funnelData.find(
                            (f) => f.label === "Link Clicked"
                          )?.value || 0)}
                      </p>
                    </div>

                    {/* Click → Start Drop-off */}
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Click → Start
                      </p>
                      <p className="text-2xl font-bold">
                        {(adDetail.analytics.funnelData.find(
                          (f) => f.label === "Link Clicked"
                        )?.value || 0) -
                          (adDetail.analytics.funnelData.find(
                            (f) => f.label === "Video Started"
                          )?.value || 0)}
                      </p>
                    </div>

                    {/* Start → Complete Drop-off */}
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Start → Complete
                      </p>
                      <p className="text-2xl font-bold">
                        {(adDetail.analytics.funnelData.find(
                          (f) => f.label === "Video Started"
                        )?.value || 0) -
                          (adDetail.analytics.funnelData.find(
                            (f) => f.label === "Video Completed"
                          )?.value || 0)}
                      </p>
                    </div>

                    {/* Overall Remaining */}
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary">Overall Completed</p>
                      <p className="text-2xl font-bold text-primary">
                        {adDetail.analytics.funnelData.find(
                          (f) => f.label === "Video Completed"
                        )?.value || 0}
                      </p>
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
                <HeatmapChart data={adDetail.analytics.heatmapData} />
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
                          data={adDetail.analytics.deviceData}
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
              {/* Audience Stats */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Audience Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {adDetail.analytics.deviceData.map((device) => (
                      <div
                        key={device.name}
                        className="p-4 bg-secondary/30 rounded-lg"
                      >
                        <p className="text-sm text-muted-foreground">
                          {device.name} Users
                        </p>
                        <p className="text-2xl font-bold">{device.value}%</p>
                      </div>
                    ))}
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
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No viewer data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        viewers.map((viewer, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-secondary/30"
                          >
                            <TableCell className="font-mono">
                              {/* <Link
                                to={`/marketer/msisdn/${viewer.msisdn}`}
                                className="hover:text-primary"
                              > */}
                                {viewer.msisdn}
                              {/* </Link> */}
                            </TableCell>
                            <TableCell>
                              {getRewardBadge(viewer.status)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {viewer.started_at
                                ? new Date(viewer.started_at).toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {viewer.completed_at
                                ? new Date(viewer.completed_at).toLocaleString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                {viewer.device_info
                                  ? `${viewer.device_info.brand} ${viewer.device_info.model}`
                                  : "Unknown"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {viewer.location?.category || "Unknown"}
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
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-[999]" />

          <DialogContent
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
               max-w-6xl w-full max-h-[90vh] p-6 bg-white rounded-2xl shadow-xl
               overflow-hidden z-[1000]"
          >
            {/* Close Button */}
            <DialogClose asChild>
              <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl">
                ✕
              </button>
            </DialogClose>

            {/* Video Title */}
            {campaign.campaign_name && (
              <h4 className="text-2xl font-bold mb-4 text-center">
                {campaign.campaign_name} (Preview)
              </h4>
            )}

            {/* Video Player */}
            <div className="w-full h-[calc(90vh-100px)] bg-black rounded-lg overflow-hidden">
              <video controls className="w-full h-full object-contain" autoPlay>
                {videoSrc && <source src={videoSrc} type="video/mp4" />}
                Your browser does not support the video tag.
              </video>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MarketerLayout>
  );
};

export default CampaignDetail;
