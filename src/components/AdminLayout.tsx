import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Video,
  BarChart3,
  Settings,
  Eye,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
  Shield,
  Smartphone,
  SmartphoneCharging,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Shield, label: "Fraud Monitor", href: "/admin/fraud" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: SmartphoneCharging, label: "Customer Lookup", href: "/admin/lookup" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface Props {
  children: ReactNode;
  title?: string;
}

const AdminLayout = ({ children, title = "Admin Dashboard" }: Props) => {
  return (
    <DashboardLayout title={title} sidebarItems={sidebarItems} userType="admin">
      {children}
    </DashboardLayout>
  );
};

export default AdminLayout;
