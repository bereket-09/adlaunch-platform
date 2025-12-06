import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Video,
  BarChart3,
  Settings,
  DollarSign,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  CheckCircle,
  XCircle,
  CloudUpload,
  FileVideo,
  AlertCircle,
  Shield,
  Edit2,
  Calendar,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { adAPI, marketerAPI, Ad, Marketer } from "@/services/api";
import { Link } from "react-router-dom";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Marketers", href: "/admin/marketers" },
  { icon: Video, label: "Campaigns", href: "/admin/campaigns" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Shield, label: "Fraud Monitor", href: "/admin/fraud" },
  { icon: DollarSign, label: "Budget Controls", href: "/admin/budget" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminCampaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Campaign Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    marketer_id: "",
    campaign_name: "",
    title: "",
    cost_per_view: "",
    budget_allocation: "",
    video_description: "",
    video_file_path: "ads/video.mp4",
    start_date: "",
    end_date: "",
  });
  
  // Edit Campaign Dialog
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  
  // View Details Dialog
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adsRes, marketersRes] = await Promise.all([
        adAPI.list(),
        marketerAPI.list(),
      ]);
      
      if (adsRes.status) {
        setAds(adsRes.ads);
      }
      if (marketersRes.status) {
        setMarketers(marketersRes.marketers);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Demo data fallback
      setAds([
        {
          _id: "1",
          marketer_id: "1",
          campaign_name: "Promo Campaign",
          title: "Ad Video 1",
          cost_per_view: 5,
          budget_allocation: 1000,
          remaining_budget: 800,
          video_file_path: "ads/video123.mp4",
          start_date: "2025-12-01T00:00:00.000Z",
          end_date: "2025-12-31T23:59:59.000Z",
          status: "active",
          created_at: "2025-12-06T16:04:23.395Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.campaign_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const response = await adAPI.create({
        marketer_id: newCampaign.marketer_id,
        campaign_name: newCampaign.campaign_name,
        title: newCampaign.title,
        cost_per_view: parseFloat(newCampaign.cost_per_view) || 5,
        budget_allocation: parseFloat(newCampaign.budget_allocation) || 1000,
        video_description: newCampaign.video_description,
        video_file_path: newCampaign.video_file_path,
        start_date: newCampaign.start_date ? new Date(newCampaign.start_date).toISOString() : new Date().toISOString(),
        end_date: newCampaign.end_date ? new Date(newCampaign.end_date).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (response.status) {
        toast({
          title: "Campaign created",
          description: `${newCampaign.title} has been created and is pending approval.`,
        });
        setIsCreateOpen(false);
        resetNewCampaign();
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign.",
        variant: "destructive",
      });
    }
  };

  const resetNewCampaign = () => {
    setNewCampaign({
      marketer_id: "",
      campaign_name: "",
      title: "",
      cost_per_view: "",
      budget_allocation: "",
      video_description: "",
      video_file_path: "ads/video.mp4",
      start_date: "",
      end_date: "",
    });
    setVideoFile(null);
  };

  const handleApprove = async (adId: string) => {
    try {
      const response = await adAPI.approve(adId);
      if (response.status) {
        toast({
          title: "Campaign approved",
          description: "The campaign is now active.",
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve campaign.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAd = async () => {
    if (!editingAd) return;

    try {
      const response = await adAPI.update(editingAd._id, {
        title: editingAd.title,
        campaign_name: editingAd.campaign_name,
        cost_per_view: editingAd.cost_per_view,
        budget_allocation: editingAd.budget_allocation,
        start_date: editingAd.start_date,
        end_date: editingAd.end_date,
        status: editingAd.status,
      });

      if (response.status) {
        toast({
          title: "Campaign updated",
          description: "Changes saved successfully.",
        });
        setIsEditOpen(false);
        setEditingAd(null);
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (ad: Ad) => {
    const newStatus = ad.status === "active" ? "paused" : "active";
    try {
      await adAPI.update(ad._id, { status: newStatus });
      toast({
        title: newStatus === "active" ? "Campaign activated" : "Campaign paused",
      });
      fetchData();
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
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Paused</Badge>;
      case "pending_approval":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Pending Approval</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMarketerName = (marketerId: string) => {
    const marketer = marketers.find(m => m._id === marketerId);
    return marketer?.name || 'Unknown';
  };

  const budgetWarning = newCampaign.budget_allocation && parseFloat(newCampaign.budget_allocation) > 50000;

  return (
    <DashboardLayout
      title="Manage Campaigns"
      sidebarItems={sidebarItems}
      userType="admin"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="gradient" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Pending Approvals */}
        {ads.filter(ad => ad.status === "pending_approval").length > 0 && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-800">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ads.filter(ad => ad.status === "pending_approval").map(ad => (
                  <div key={ad._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                    <div>
                      <p className="font-medium">{ad.title}</p>
                      <p className="text-sm text-muted-foreground">{ad.campaign_name} • {getMarketerName(ad.marketer_id)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" variant="gradient" onClick={() => handleApprove(ad._id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaigns Table */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableHead>Campaign</TableHead>
                    <TableHead>Marketer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">CPC ($)</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Loading campaigns...
                      </TableCell>
                    </TableRow>
                  ) : filteredAds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No campaigns found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAds.map((ad) => (
                      <TableRow key={ad._id} className="table-row">
                        <TableCell>
                          <div>
                            <p className="font-medium">{ad.title}</p>
                            <p className="text-sm text-muted-foreground">{ad.campaign_name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {getMarketerName(ad.marketer_id)}
                        </TableCell>
                        <TableCell>{getStatusBadge(ad.status)}</TableCell>
                        <TableCell className="text-right">${ad.cost_per_view}</TableCell>
                        <TableCell className="text-right">${ad.budget_allocation.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium text-primary">
                          ${ad.remaining_budget.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            <div>{new Date(ad.start_date).toLocaleDateString()}</div>
                            <div>{new Date(ad.end_date).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAd(ad);
                                  setIsDetailOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingAd(ad);
                                  setIsEditOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {ad.status !== "pending_approval" && (
                                <DropdownMenuItem onClick={() => handleToggleStatus(ad)}>
                                  {ad.status === "active" ? (
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
                                </DropdownMenuItem>
                              )}
                              {ad.status === "pending_approval" && (
                                <DropdownMenuItem onClick={() => handleApprove(ad._id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                              )}
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{ads.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Campaigns</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {ads.filter(ad => ad.status === "active").length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {ads.filter(ad => ad.status === "pending_approval").length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Pending Approval</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  ${ads.reduce((acc, ad) => acc + ad.budget_allocation, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total Budget</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Campaign Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Create a new campaign and assign it to a marketer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Video Upload */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-orange-50"
                    : videoFile
                    ? "border-green-500 bg-green-50"
                    : "border-border hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {videoFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileVideo className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{videoFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setVideoFile(null)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudUpload className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Drop video here or{" "}
                      <label className="text-primary cursor-pointer hover:underline">
                        browse
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Assign to Marketer</Label>
                <Select
                  value={newCampaign.marketer_id}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, marketer_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select marketer" />
                  </SelectTrigger>
                  <SelectContent>
                    {marketers.map((m) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input
                    value={newCampaign.campaign_name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e.target.value })}
                    placeholder="e.g., Promo Campaign"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ad Title</Label>
                  <Input
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                    placeholder="e.g., Summer Sale Ad"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newCampaign.video_description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, video_description: e.target.value })}
                  placeholder="Campaign description..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost Per View ($)</Label>
                  <Input
                    type="number"
                    value={newCampaign.cost_per_view}
                    onChange={(e) => setNewCampaign({ ...newCampaign, cost_per_view: e.target.value })}
                    placeholder="e.g., 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Budget Allocation ($)</Label>
                  <Input
                    type="number"
                    value={newCampaign.budget_allocation}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget_allocation: e.target.value })}
                    placeholder="e.g., 1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newCampaign.start_date}
                    onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={newCampaign.end_date}
                    onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                  />
                </div>
              </div>

              {budgetWarning && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    Budget exceeds $50,000. Please verify this amount with the marketer.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Campaign Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Campaign</DialogTitle>
            </DialogHeader>
            {editingAd && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Ad Title</Label>
                  <Input
                    value={editingAd.title}
                    onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Campaign Name</Label>
                  <Input
                    value={editingAd.campaign_name}
                    onChange={(e) => setEditingAd({ ...editingAd, campaign_name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cost Per View ($)</Label>
                    <Input
                      type="number"
                      value={editingAd.cost_per_view}
                      onChange={(e) => setEditingAd({ ...editingAd, cost_per_view: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget ($)</Label>
                    <Input
                      type="number"
                      value={editingAd.budget_allocation}
                      onChange={(e) => setEditingAd({ ...editingAd, budget_allocation: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleUpdateAd}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Campaign Details</DialogTitle>
            </DialogHeader>
            {selectedAd && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-medium">{selectedAd.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Campaign</p>
                    <p className="font-medium">{selectedAd.campaign_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedAd.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPC</p>
                    <p className="font-medium">${selectedAd.cost_per_view}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">${selectedAd.budget_allocation.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="font-medium text-primary">${selectedAd.remaining_budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(selectedAd.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(selectedAd.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Video Path</p>
                  <p className="font-medium text-sm break-all">{selectedAd.video_file_path}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminCampaigns;
