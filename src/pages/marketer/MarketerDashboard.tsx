import { useEffect, useState } from "react";
import { analyticsAPI } from "@/services/api";
import {
  LayoutDashboard,
  Video,
  Upload,
  Settings,
  Eye,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
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
  ComposedChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  Bar,
} from "recharts";
import MarketerLayout from "@/components/MarketerLayout";
import { useNavigate } from "react-router-dom";

const MarketerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();
  let marketerID = localStorage.getItem("marketer_id");
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (!marketerID) {
          navigate("/marketer/login");
          return;
        }
        const res = await analyticsAPI.getMarketerAnalysis(marketerID);
        setData(res);
      } catch (err) {
        console.error("Failed to fetch marketer analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [marketerID]);

  if (loading) {
    return (
      <MarketerLayout title="Analytics Dashboard">
        <div className="text-center py-20 text-gray-500">
          Loading marketer analytics...
        </div>
      </MarketerLayout>
    );
  }

  if (!data) {
    return (
      <MarketerLayout title="Analytics Dashboard">
        <div className="text-center py-20 text-red-500">
          Failed to load data.
        </div>
      </MarketerLayout>
    );
  }

  const {
    analytics,
    budget,
    total_views,
    opened_views,
    completed_views,
    completion_rate,
  } = data;

  return (
    <MarketerLayout title="Analytics Dashboard">
      <div className="space-y-6">
        {/* Header with Real-time indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Campaign Analytics
            </h1>
            <p className="text-muted-foreground">
              Real-time performance insights across all campaigns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RealTimeIndicator />
            {/* <ExportButton filename="dashboard-report" /> */}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Impressions"
            value={total_views}
            icon={Eye}
            trend="up"
          />
          <KPICard
            title="Total Completions"
            value={completed_views}
            icon={Target}
            trend="up"
          />
          <KPICard
            title="Completion Rate"
            value={`${(completion_rate * 100).toFixed(1)}%`}
            icon={TrendingUp}
            trend="up"
          />
          <KPICard
            title="Total Spend"
            value={`${budget?.spent || 0} Br.`}
            icon={DollarSign}
            trend="down"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Average CPC"
            value={`${((budget?.spent || 0) / (completed_views || 1)).toFixed(2)} Br.`}
            icon={Zap}
            trend="neutral"
            size="sm"
          />
          <KPICard  
            title="Number of Ads"
            value={data?.adCount}
            icon={Users}
            trend="up"
            size="sm"
          />
          <KPICard
            title="Reward Success Rate"
            value={`${analytics?.reward_success_rate || "100"} %`}
            icon={Activity}
            trend="up"
            size="sm"
          />
          <KPICard
            title="Avg. Watch Time"
            value={analytics?.avg_watch_time || "29 Sec"}
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
            {/* <TabsTrigger value="msisdn">MSISDN Insights</TabsTrigger> */}
            {/* <TabsTrigger value="comparison">Campaign Comparison</TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Trend Chart */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Daily Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={analytics?.dailyData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          yAxisId="left"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
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
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="views"
                          fill="hsl(var(--primary) / 0.1)"
                          stroke="hsl(var(--primary))"
                          name="Views"
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="completions"
                          stroke="hsl(var(--orange-600))"
                          strokeWidth={2}
                          name="Completions"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="spend"
                          fill="hsl(var(--gray-300))"
                          name="Spend ($)"
                          radius={[4, 4, 0, 0]}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Device Distribution */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Device Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analytics?.deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {analytics?.deviceData?.map(
                            (entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            )
                          )}
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
                <CardTitle className="text-lg font-semibold">
                  Engagement Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HeatmapChart
                  data={analytics?.heatmapData}
                  title="Completions by Day & Hour"
                />
              </CardContent>
            </Card>

            {/* Hourly Performance */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Hourly Performance (Today)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.hourlyData}>
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
                      <Area
                        type="monotone"
                        dataKey="views"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary) / 0.3)"
                        name="Views"
                      />
                      <Area
                        type="monotone"
                        dataKey="completions"
                        stackId="2"
                        stroke="hsl(var(--orange-600))"
                        fill="hsl(var(--orange-600) / 0.3)"
                        name="Completions"
                      />
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
                  <CardTitle className="text-lg font-semibold">
                    Completion Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FunnelChart data={analytics?.funnelData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="msisdn" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Per-MSISDN Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <MSISDNTable data={analytics?.msisdnData} /> */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            {/* <CampaignComparison data={analytics?.comparisonData} /> */}
          </TabsContent>
        </Tabs>
      </div>
    </MarketerLayout>
  );
};

export default MarketerDashboard;
