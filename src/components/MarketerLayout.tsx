import { ReactNode } from "react";
import { LayoutDashboard, Video, FileText, Settings } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Ad Campaigns", href: "/marketer/campaigns" },
  { icon: FileText, label: "Reports", href: "/marketer/reports" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

interface Props {
  children: ReactNode;
  title?: string;
  sidebarItems?: any;
  userType?: any;
}

const MarketerLayout = ({
  children,
  title = "Marketer Dashboard",
}: Props) => {
  return (
    <DashboardLayout
      title={title}
      sidebarItems={sidebarItems}
      userType="marketer"
    >
      {children}
    </DashboardLayout>
  );
};

export default MarketerLayout;
