import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PublicVideoView from "./pages/PublicVideoView";
import MarketerLogin from "./pages/marketer/MarketerLogin";
import MarketerDashboard from "./pages/marketer/MarketerDashboard";
import MarketerCampaigns from "./pages/marketer/MarketerCampaigns";
import MarketerUpload from "./pages/marketer/MarketerUpload";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMarketers from "./pages/admin/AdminMarketers";
import AdminCampaigns from "./pages/admin/AdminCampaigns";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Public Video View */}
          <Route path="/watch" element={<PublicVideoView />} />
          
          {/* Marketer Routes */}
          <Route path="/marketer/login" element={<MarketerLogin />} />
          <Route path="/marketer/dashboard" element={<MarketerDashboard />} />
          <Route path="/marketer/campaigns" element={<MarketerCampaigns />} />
          <Route path="/marketer/upload" element={<MarketerUpload />} />
          <Route path="/marketer/settings" element={<MarketerDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/marketers" element={<AdminMarketers />} />
          <Route path="/admin/campaigns" element={<AdminCampaigns />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/budget" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
