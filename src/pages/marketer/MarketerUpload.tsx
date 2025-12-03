import { useState } from "react";
import { LayoutDashboard, Video, Upload, Settings, CloudUpload, FileVideo, AlertCircle, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/marketer/dashboard" },
  { icon: Video, label: "Campaigns", href: "/marketer/campaigns" },
  { icon: Upload, label: "Upload Video", href: "/marketer/upload" },
  { icon: Settings, label: "Settings", href: "/marketer/settings" },
];

const MarketerUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rateType, setRateType] = useState("");
  const [budget, setBudget] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid video file (MP4, WebM, etc.)",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const budgetWarning = budget && parseFloat(budget) < 100;
  const isValid = title && videoFile && rateType && budget && parseFloat(budget) >= 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      toast({
        title: "Campaign created!",
        description: "Your video campaign has been created successfully.",
      });
      navigate("/marketer/campaigns");
    }, 2000);
  };

  return (
    <DashboardLayout
      title="Create Campaign"
      sidebarItems={sidebarItems}
      userType="marketer"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
            <CardDescription>
              Upload your advertisement video and configure campaign settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video Upload */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
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
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100">
                      <CheckCircle className="h-7 w-7 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{videoFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setVideoFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
                      <CloudUpload className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Drop your video here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supported formats: MP4, WebM, MOV (max 500MB)
                      </p>
                    </div>
                    <label>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <FileVideo className="h-4 w-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {/* Campaign Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Sale 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Rate Type & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate">Price per View *</Label>
                  <Select value={rateType} onValueChange={setRateType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rate type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free (Brand Awareness)</SelectItem>
                      <SelectItem value="standard">Standard ($0.05/view)</SelectItem>
                      <SelectItem value="premium">Premium ($0.10/view)</SelectItem>
                      <SelectItem value="custom">Custom Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Allocation * ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    min="100"
                    required
                  />
                </div>
              </div>

              {/* Warnings */}
              {budgetWarning && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    Minimum budget is $100. Higher budgets allow for more views and better reach.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/marketer/campaigns")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  className="flex-1"
                  disabled={!isValid || isUploading}
                >
                  {isUploading ? "Creating Campaign..." : "Create Campaign"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MarketerUpload;
