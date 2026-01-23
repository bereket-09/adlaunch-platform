import { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Video,
  Upload,
  Settings,
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import ExportButton from "@/components/analytics/ExportButton";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import MarketerLayout from "@/components/MarketerLayout";
import { API_ENDPOINTS } from "@/config/api";

const periods = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
];




  const performanceData = [
    { campaign: "Summer Sale 2024", impressions: 20, completions: 18, spend: 20 },
    { campaign: "Data Bundle Offer", impressions: 38200, completions: 34380, spend: 5157 },
    { campaign: "Voice Pack Deal", impressions: 29500, completions: 26550, spend: 3982 },
    { campaign: "Holiday Special", impressions: 52000, completions: 47320, spend: 7098 },
  ];

  const weeklyTrend = [
    { week: "Week 1", views: 42000, spend: 6300 },
    { week: "Week 2", views: 48000, spend: 7200 },
    { week: "Week 3", views: 52000, spend: 7800 },
    { week: "Week 4", views: 58000, spend: 8700 },
  ];

  const rewardData = [
    { name: "Data Bundle", value: 65, color: "hsl(var(--primary))" },
    { name: "Voice Minutes", value: 25, color: "hsl(var(--orange-600))" },
    { name: "SMS Bundle", value: 10, color: "hsl(var(--gray-400))" },
  ];

  const reportTemplates = [
    { id: 1, name: "Campaign Performance Summary", description: "Overview of all campaign metrics", type: "performance" },
    { id: 2, name: "Funnel Analysis Report", description: "Detailed conversion funnel breakdown", type: "funnel" },
    { id: 3, name: "MSISDN Activity Report", description: "Per-user engagement details", type: "msisdn" },
    { id: 4, name: "Budget Utilization Report", description: "Spend analysis and ROI metrics", type: "budget" },
    { id: 5, name: "Daily Engagement Summary", description: "Day-by-day performance metrics", type: "daily" },
  ];

const MarketerReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  let marketerId = localStorage.getItem("marketer_id") || "";
  const fetchReports = async () => {
    try {
      setLoading(true);

      // Build URL with period query parameter
      const url = `${API_ENDPOINTS.ANALYTICS.MarketerReports(
        marketerId
      )}?period=${selectedPeriod}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch reports: ${res.statusText}`);
      }

      const data = await res.json();

      // Map backend response to frontend structure
      const performanceData =
        data.analytics?.dailyData?.map((d, i) => ({
          campaign: `Campaign ${i + 1}`,
          impressions: d.views,
          completions: d.completions,
          spend: d.spend,
        })) || [];

      const weeklyTrend =
        data.analytics?.dailyData?.map((d, i) => ({
          week: `Day ${i + 1}`,
          views: d.views,
          spend: d.spend,
        })) || [];

      const rewardData = data.analytics?.deviceData?.map((d) => ({
        name: d.name,
        value: d.value,
        color: d.color || "hsl(var(--primary))",
      })) || [
        { name: "Data Bundle", value: 65, color: "hsl(var(--primary))" },
        { name: "Voice Minutes", value: 25, color: "hsl(var(--orange-600))" },
        { name: "SMS Bundle", value: 10, color: "hsl(var(--gray-400))" },
      ];

      const summary = {
        totalImpressions: performanceData.reduce(
          (sum, d) => sum + d.impressions,
          0
        ),
        totalCompletions: performanceData.reduce(
          (sum, d) => sum + d.completions,
          0
        ),
        completionRate: performanceData.length
          ? Math.round(
              (performanceData.reduce((sum, d) => sum + d.completions, 0) /
                performanceData.reduce((sum, d) => sum + d.impressions, 0)) *
                1000
            ) / 10
          : 0,
        totalSpend: performanceData.reduce((sum, d) => sum + d.spend, 0),
      };

      setReportData({
        performanceData,
        weeklyTrend,
        rewardData,
        summary,
        raw: data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  if (loading || !reportData) return <p>Loading reports...</p>;

  const { performanceData, weeklyTrend, rewardData, summary } = reportData;

  return (
    <MarketerLayout title="Reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Generate and export detailed performance reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={`last-${selectedPeriod}`}
              onValueChange={(val) =>
                setSelectedPeriod(Number(val.replace("last-", "")))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  {periods.find((p) => p.value === selectedPeriod)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.value} value={`last-${p.value}`}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Reports</TabsTrigger>
            <TabsTrigger value="rewards">Reward Reports</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Impressions
                      </p>
                      <p className="text-2xl font-bold">
                        {summary.totalImpressions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-100">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Completions
                      </p>
                      <p className="text-2xl font-bold">
                        {summary.totalCompletions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-orange-100">
                      <PieChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Completion Rate
                      </p>
                      <p className="text-2xl font-bold">
                        {summary.completionRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Spend
                      </p>
                      <p className="text-2xl font-bold">
                        {summary.totalSpend.toFixed(2)} Br.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts: Weekly Trend & Rewards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    Daily Performance Trend
                  </CardTitle>
                  <ExportButton filename="weekly-trend" />
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyTrend}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="week"
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
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="views"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          name="Views"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="spend.toFixed(2)"
                          stroke="hsl(var(--orange-600))"
                          strokeWidth={2}
                          name="Spend (Br)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    Reward Type Distribution
                  </CardTitle>
                  <ExportButton filename="reward-distribution" />
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={rewardData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {rewardData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


{/* // Belwo needs to updated */}

         <TabsContent value="campaigns" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Campaign Performance Report</CardTitle>
                  <ExportButton filename="campaign-report" />
                </CardHeader>
                <CardContent>
                  <AnalyticsFilters config={{ campaign: true, dateRange: true, status: true }} />
                  
                  <div className="mt-6 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="campaign" type="category" width={150} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="impressions" fill="hsl(var(--primary))" name="Impressions" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="completions" fill="hsl(var(--orange-600))" name="Completions" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Reward Fulfillment Report</CardTitle>
                  <ExportButton filename="reward-report" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-600">Successful Rewards</p>
                      <p className="text-3xl font-bold text-green-700">47</p>
                      <p className="text-sm text-green-600">99.6% success rate</p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">Failed Rewards</p>
                      <p className="text-3xl font-bold text-red-700">3</p>
                      <p className="text-sm text-red-600">1.3% failure rate</p>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-600">Pending Retry</p>
                      <p className="text-3xl font-bold text-yellow-700">2</p>
                      <p className="text-sm text-yellow-600">1.1% pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="card-elevated hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Generate
                        </Button>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          {/* Keep your existing tabs for campaigns, rewards, templates intact */}
        </Tabs>
      </div>
    </MarketerLayout>
  );
};

export default MarketerReports;
