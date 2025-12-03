import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import VideoPlayer from "@/components/VideoPlayer";

const PublicVideoView = () => {
  const [searchParams] = useSearchParams();
  const [isComplete, setIsComplete] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Get video ID from URL params (in production, this would fetch the actual video)
  const videoId = searchParams.get("v") || "demo";

  // Demo video URL (replace with actual video source in production)
  const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const handleVideoComplete = async () => {
    setIsComplete(true);
    
    // Simulate API call to record completion
    try {
      // In production: await api.recordVideoComplete(videoId);
      console.log("Video completed, triggering backend event for:", videoId);
    } catch (error) {
      console.error("Failed to record completion");
    }

    // Start redirect countdown
    setIsRedirecting(true);
    
    // Redirect after 3 seconds
    setTimeout(() => {
      // In production, redirect to the appropriate URL
      window.location.href = "/";
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <Logo size="sm" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
        {!isComplete ? (
          <VideoPlayer
            videoUrl={demoVideoUrl}
            onComplete={handleVideoComplete}
          />
        ) : (
          <div className="text-center animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Thank you for watching!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your engagement has been recorded.
            </p>
            {isRedirecting && (
              <div className="flex items-center justify-center gap-2 text-primary">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Redirecting...</span>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by <span className="font-medium text-primary">AdView Pro</span>
        </p>
      </footer>
    </div>
  );
};

export default PublicVideoView;
