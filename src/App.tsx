import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SubscriberPortal from "./pages/SubscriberPortal";
import MarketerLogin from "./pages/marketer/MarketerLogin";
import MarketerDashboard from "./pages/marketer/MarketerDashboard";
import MarketerCampaigns from "./pages/marketer/MarketerCampaigns";
import MarketerUpload from "./pages/marketer/MarketerUpload";
import CampaignDetail from "./pages/marketer/CampaignDetail";
import MSISDNDetail from "./pages/admin/MSISDNDetail";
import MarketerReports from "./pages/marketer/MarketerReports";
import MarketerSettings from "./pages/marketer/MarketerSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMarketers from "./pages/admin/AdminMarketers";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminBudget from "./pages/admin/AdminBudget";
import AdminFraud from "./pages/admin/AdminFraud";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminViewCampaigns from "./pages/admin/AdminViewCampaigns";
import AdminCampaignDetail from "./pages/admin/AdminCampaignDetail";
import MarketerUpdatePassword from "./pages/marketer/UpdatePassword";
import AdminMsisdnSearch from "./pages/admin/MSISDNLookup";
import SimulatorPage from "./pages/admin/SimulatorPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Subscriber Portal (Zero-Rated) */}
          <Route path="/watch" element={<SubscriberPortal />} />
          
          {/* Marketer Routes */}
          <Route path="/marketer/login" element={<MarketerLogin />} />
          <Route path="/marketer/dashboard" element={<MarketerDashboard />} />
          <Route path="/marketer/campaigns" element={<MarketerCampaigns />} />
          <Route path="/marketer/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/marketer/msisdn/:msisdn" element={<MSISDNDetail />} />
          <Route path="/marketer/upload" element={<MarketerUpload />} />
          <Route path="/marketer/analytics" element={<MarketerDashboard />} />
          <Route path="/marketer/reports" element={<MarketerReports />} />
          <Route path="/marketer/settings" element={<MarketerSettings />} />
          <Route path="/marketer/update-password" element={<MarketerUpdatePassword />} />


          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/marketers" element={<AdminMarketers />} />
          <Route path="/admin/campaigns" element={<AdminCampaigns />} />
          <Route path="/admin/campaigns/:id" element={<AdminCampaignDetail />} />
          <Route path="/admin/msisdn/:msisdn" element={<MSISDNDetail />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/fraud" element={<AdminFraud />} />
          <Route path="/admin/budget" element={<AdminBudget />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          <Route path="/admin/lookup" element={<AdminMsisdnSearch />} />
          <Route path="/admin/simulator" element={<SimulatorPage />} />
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;