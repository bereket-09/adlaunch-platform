import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Video,
  Upload,
  Settings,
  MoreHorizontal,
  Eye,
  Play,
  Pause,
  ExternalLink,
  FileText,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { adAPI, Ad } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// Import the new filter component
import CampaignFilters from "@/components/analytics/CampaignFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RealTimeIndicator from "@/components/analytics/RealTimeIndicator";
import MarketerLayout from "@/components/MarketerLayout";
import { API_ENDPOINTS } from "@/config/api";

const MarketerCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Ad[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState("created_desc");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [campaigns, filters, sortBy]);

  const fetchCampaigns = async () => {
    try {
      let marketerId = localStorage.getItem("marketer_id");
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.AD.ListByMarketer(marketerId || ""));
      let data = await response.json();
        // console.log("🚀 ~ fetchCampaigns ~ response:", data)
        // console.log("🚀 ~ fetchCampaigns ~ response.ads:", data.ads);
      if (data.status) {
        setCampaigns(data.ads);
      
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...campaigns];

    // Search / campaign name filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      data = data.filter(
        (c) =>
          c.title?.toLowerCase().includes(query) ||
          c.campaign_name?.toLowerCase().includes(query) ||
          c.marketer_id?.name?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      data = data.filter((c) => c.status === filters.status);
    }

    // Marketer filter
    if (filters.marketer && filters.marketer !== "all") {
      data = data.filter((c) => c.marketer_id?._id === filters.marketer);
    }

    // Date range filter
    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      if (from) data = data.filter((c) => new Date(c.start_date) >= from);
      if (to) data = data.filter((c) => new Date(c.end_date) <= to);
    }

    // Sorting
    data.sort((a, b) => {
      if (sortBy === "created_desc")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "created_asc")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sortBy === "budget_desc")
        return b.budget_allocation - a.budget_allocation;
      if (sortBy === "budget_asc")
        return a.budget_allocation - b.budget_allocation;
      return 0;
    });

    setFilteredCampaigns(data);
  };

  const handleToggleStatus = async (campaign: Ad) => {
    const newStatus = campaign.status === "active" ? "paused" : "active";
    try {
      await adAPI.update(campaign._id, { status: newStatus });
      toast({
        title:
          newStatus === "active" ? "Campaign activated" : "Campaign paused",
      });
      fetchCampaigns();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-700">Paused</Badge>;
      case "pending_approval":
        return <Badge className="bg-blue-100 text-blue-700">Pending</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalSpent = campaigns.reduce(
    (sum, c) => sum + (c.budget_allocation - c.remaining_budget),
    0
  );

  return (
    <MarketerLayout title="Campaigns">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Campaigns & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor performance in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RealTimeIndicator />
        </div>
      </div>

      <div className="space-y-6 mb-6">
        <div className="flex flex-wrap items-center gap-4 justify-between mb-6">
          {/* ---------------- FILTERS ---------------- */}
          <div className="flex-1 min-w-[300px]">
            <CampaignFilters
              campaigns={campaigns}
              marketers={campaigns
                .map((c) => c.marketer_id)
                .filter(
                  (v, i, a) => a.findIndex((x) => x?._id === v?._id) === i
                )}
              config={{
                campaign: true,
                marketer: true,
                status: true,
                dateRange: true,
              }}
              onFiltersChange={setFilters}
            />
          </div>

          {/* CREATE CAMPAIGN BUTTON */}
          <Link to="/marketer/upload">
            <Button variant="gradient">
              <Upload className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* ---------------- TABLE ---------------- */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              All Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Marketer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">CPC ($)</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Loading campaigns...
                      </TableCell>
                    </TableRow>
                  ) : filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No campaigns found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <TableRow
                        key={campaign._id}
                        className="cursor-pointer"
                        onClick={() =>
                          navigate(`/marketer/campaigns/${campaign._id}`)
                        }
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{campaign.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {campaign.campaign_name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{campaign.marketer_id?.name}</TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>
                          {new Date(campaign.start_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(campaign.end_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.cost_per_view?.toFixed(2)} Br.
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.budget_allocation?.toLocaleString()} Br.
                        </TableCell>
                        <TableCell className="text-right">
                          {(
                            campaign.budget_allocation -
                            campaign.remaining_budget
                          )?.toLocaleString()}{" "}
                          Br.
                        </TableCell>
                        <TableCell className="text-right font-medium text-primary">
                          {campaign.remaining_budget?.toLocaleString()} Br.
                        </TableCell>
                        <TableCell>
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/marketer/campaigns/${campaign._id}`
                                  );
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(campaign);
                                }}
                              >
                                {campaign.status === "active" ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem> */}
                              <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-elevated">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-foreground">
                {campaigns.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Total Campaigns
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">
                {campaigns.filter((c) => c.status === "active").length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Active Campaigns
              </p>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketerLayout>
  );
};

export default MarketerCampaigns;
