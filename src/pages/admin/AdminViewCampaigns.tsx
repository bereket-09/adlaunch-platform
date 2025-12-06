// ================= IMPORTS =================
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ReactPaginate from "react-paginate";
import { CheckCircle2, Eye, Clock } from "lucide-react";

// ================= COMPONENT =================
interface WatchSession {
  _id: string;
  msisdn: string;
  status: "completed" | "opened" | "pending";
  device_info: { brand: string; model: string };
  ip: string;
  location?: { category: string; lat: number; lon: number };
  started_at?: string;
  completed_at?: string;
}

interface Ad {
  title: string;
  campaign_name: string;
  status: string;
  cost_per_view: number;
  budget_allocation: number;
  remaining_budget?: number;
  start_date: string;
  end_date: string;
  video_file_path: string;
  total_views: number;
  opened_views: number;
  completed_views: number;
  pending_views: number;
  completion_rate: number;
  watch_sessions?: WatchSession[];
}

interface ViewCampaignDetailsDialogProps {
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  selectedAd?: Ad;
}

const ViewCampaignDetailsDialog: React.FC<ViewCampaignDetailsDialogProps> = ({
  isDetailOpen,
  setIsDetailOpen,
  selectedAd,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>;
      case "opened":
        return <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1"><Eye className="h-3 w-3" /> Opened</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-700 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!selectedAd) return null;

  const pieData = [
    { name: "Completed", value: selectedAd.completed_views, color: "#4ade80" },
    { name: "Opened", value: selectedAd.opened_views - selectedAd.completed_views, color: "#facc15" },
    { name: "Pending", value: selectedAd.pending_views, color: "#f87171" },
  ];

  return (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-auto rounded-2xl p-6 bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">Campaign Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-4 border-b border-gray-200 bg-gray-50 rounded-lg">
            <TabsTrigger value="summary" className="hover:bg-gray-100 font-semibold">Summary</TabsTrigger>
            <TabsTrigger value="stats" className="hover:bg-gray-100 font-semibold">Stats</TabsTrigger>
            <TabsTrigger value="sessions" className="hover:bg-gray-100 font-semibold">Watch Sessions</TabsTrigger>
          </TabsList>

          {/* ================= SUMMARY ================= */}
          <TabsContent value="summary">
            <Card className="card-elevated mb-4">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
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
                    <p className="font-medium text-primary">${selectedAd.remaining_budget?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(selectedAd.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(selectedAd.end_date).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-muted-foreground">Video Path</p>
                    <p className="font-medium text-sm break-all">{selectedAd.video_file_path}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= STATS ================= */}
          <TabsContent value="stats">
            <div className="grid grid-cols-2 gap-6 items-center">
              {/* KPI Cards */}
              <div className="flex flex-col gap-4">
                <Card className="card-elevated p-4">
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{selectedAd.total_views}</p>
                </Card>
                <Card className="card-elevated p-4">
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{(selectedAd.completion_rate * 100).toFixed(2)}%</p>
                </Card>
              </div>

              {/* Pie Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* ================= WATCH SESSIONS ================= */}
          <TabsContent value="sessions">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Watch Sessions</CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MSISDN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAd.watch_sessions
                      ?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                      .map((ws) => (
                        <TableRow key={ws._id} className="hover:bg-gray-50 transition">
                          <TableCell>{ws.msisdn}</TableCell>
                          <TableCell>{getStatusBadge(ws.status)}</TableCell>
                          <TableCell>{`${ws.device_info.brand} ${ws.device_info.model}`}</TableCell>
                          <TableCell>{ws.ip}</TableCell>
                          <TableCell>
                            {ws.location?.category} ({ws.location?.lat}, {ws.location?.lon})
                          </TableCell>
                          <TableCell>{ws.started_at ? new Date(ws.started_at).toLocaleString() : "-"}</TableCell>
                          <TableCell>{ws.completed_at ? new Date(ws.completed_at).toLocaleString() : "-"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                  <ReactPaginate
                    pageCount={Math.ceil((selectedAd.watch_sessions?.length || 0) / itemsPerPage)}
                    onPageChange={(selected) => setCurrentPage(selected.selected)}
                    containerClassName="flex space-x-2"
                    pageClassName="px-3 py-1 border rounded hover:bg-gray-100 cursor-pointer"
                    activeClassName="bg-blue-500 text-white"
                    previousLabel="<"
                    nextLabel=">"
                    breakLabel="..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCampaignDetailsDialog;
