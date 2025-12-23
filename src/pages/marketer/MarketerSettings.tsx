import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Video,
  Upload,
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Key,
  Save,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import MarketerLayout from "@/components/MarketerLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Campaigns", href: "/marketer/campaigns" },
  { icon: FileText, label: "Reports", href: "/marketer/reports" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

const MarketerSettings = () => {
  const [profile, setProfile] = useState({
    companyName: "TechCorp Inc.",
    email: "",
    phone: "",
    address: "123 Business Street, Lagos",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    budgetWarnings: true,
    campaignUpdates: true,
    weeklyReports: true,
    smsNotifications: false,
  });

  // Load user info from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setProfile({
        companyName: parsed.name || "TechCorp Inc.",
        email: parsed.email || "",
        phone: parsed.phone || "",
        address: parsed.address || "123 Business Street, Lagos",
      });
    }
  }, []);

  return (
    <MarketerLayout title="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground">
            View your account preferences and configurations
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            {/* <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger> */}
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>View your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={profile.companyName} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={profile.email} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={profile.phone} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Address</Label>
                    <Input value={profile.address} readOnly />
                  </div>
                </div>
                <Button disabled className="btn-primary-gradient gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>View your notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{key.replace(/([A-Z])/g, " $1")}</Label>
                      <p className="text-sm text-muted-foreground">
                        {/* Static description */}
                        {key === "budgetWarnings"
                          ? "Alert when budget reaches 75%"
                          : key === "emailAlerts"
                          ? "Receive important alerts via email"
                          : key === "campaignUpdates"
                          ? "Notifications about campaign status changes"
                          : key === "weeklyReports"
                          ? "Receive weekly performance summaries"
                          : "SMS notifications"}
                      </p>
                    </div>
                    <Switch checked={value} disabled />
                  </div>
                ))}
                <Button disabled className="btn-primary-gradient gap-2">
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>View your payment methods and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Update
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Balance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Available Budget</p>
                      <p className="text-2xl font-bold text-primary">$7,265</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Spent (This Month)</p>
                      <p className="text-2xl font-bold">$22,735</p>
                    </div>
                  </div>
                </div>
                <Button disabled className="btn-primary-gradient">Add Funds</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>View your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" readOnly />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    Enable 2FA
                  </Button>
                </div>
                <Button disabled className="btn-primary-gradient gap-2">
                  <Save className="h-4 w-4" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MarketerLayout>
  );
};

export default MarketerSettings;
