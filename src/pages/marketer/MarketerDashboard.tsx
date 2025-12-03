import { LayoutDashboard, Video, Upload, Settings, Eye, Users, TrendingUp, DollarSign } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Campaigns", href: "/marketer/campaigns" },
  { icon: Upload, label: "Upload Video", href: "/marketer/upload" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

const viewsData = [
  { name: "Mon", views: 1200 },
  { name: "Tue", views: 1800 },
  { name: "Wed", views: 2400 },
  { name: "Thu", views: 1900 },
  { name: "Fri", views: 2800 },
  { name: "Sat", views: 3200 },
  { name: "Sun", views: 2600 },
];

const campaignData = [
  { name: "Campaign A", views: 4500 },
  { name: "Campaign B", views: 3200 },
  { name: "Campaign C", views: 2800 },
  { name: "Campaign D", views: 1900 },
];

const recentActivity = [
  { id: 1, action: "Video completed", campaign: "Summer Sale 2024", time: "2 mins ago" },
  { id: 2, action: "New view started", campaign: "Product Launch", time: "5 mins ago" },
  { id: 3, action: "Video completed", campaign: "Summer Sale 2024", time: "8 mins ago" },
  { id: 4, action: "Campaign activated", campaign: "Holiday Special", time: "15 mins ago" },
  { id: 5, action: "Video completed", campaign: "Product Launch", time: "22 mins ago" },
];

const MarketerDashboard = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      sidebarItems={sidebarItems}
      userType="marketer"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Views"
            value="124,832"
            change="+12.5% from last week"
            changeType="positive"
            icon={Eye}
          />
          <StatCard
            title="Unique Users"
            value="45,291"
            change="+8.2% from last week"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Engagement Rate"
            value="94.2%"
            change="+2.1% from last week"
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="Budget Spent"
            value="$3,842"
            change="$1,158 remaining"
            changeType="neutral"
            icon={DollarSign}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Trend Chart */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Daily Views Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsData}>
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
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Performance Chart */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignData}>
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
                    <Bar
                      dataKey="views"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.campaign}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MarketerDashboard;
