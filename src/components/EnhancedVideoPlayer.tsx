import { useState, useRef, useEffect } from "react";
import { Loader2, Gift, Smartphone, Wifi, CheckCircle2 } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerProps {
  videoUrl: string;
  onComplete: () => void;
  adDetails?: {
    sponsor: string;
    duration: string;
    reward: string;
    rewardType: 'data' | 'voice' | 'sms';
  };
}

const EnhancedVideoPlayer = ({ 
  videoUrl, 
  onComplete,
  adDetails = {
    sponsor: "MTN Nigeria",
    duration: "30 seconds",
    reward: "50MB Data",
    rewardType: 'data'
  }
}: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [watchDuration, setWatchDuration] = useState(0);
  const [replays, setReplays] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setStartTime(new Date());
      video.play();
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        const currentProgress = (video.currentTime / video.duration) * 100;
        setProgress(currentProgress);
        setWatchDuration(Math.floor(video.currentTime));
      }
    };

    const handleEnded = () => {
      // Track completion event
      const completionData = {
        startTime: startTime?.toISOString(),
        endTime: new Date().toISOString(),
        watchDuration,
        completionRate: 100,
        replays,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browserType: navigator.userAgent,
      };
      console.log('Video completion event:', completionData);
      onComplete();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onComplete, startTime, watchDuration, replays]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const RewardIcon = adDetails.rewardType === 'data' ? Wifi : 
                     adDetails.rewardType === 'voice' ? Smartphone : Gift;

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Reward Preview Card */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-orange-100 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary rounded-lg">
              <RewardIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Complete this ad to earn</p>
              <p className="text-lg font-bold text-primary">{adDetails.reward}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Sponsored by</p>
            <p className="font-semibold text-foreground">{adDetails.sponsor}</p>
          </div>
        </div>
      </div>

      {/* Ad in progress label */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-primary rounded-full text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-orange" />
          Ad in progress
        </span>
        <span className="text-sm text-muted-foreground">{adDetails.duration}</span>
      </div>

      {/* Video container */}
      <div 
        className="relative bg-foreground/5 rounded-2xl overflow-hidden aspect-video shadow-xl"
        onContextMenu={handleContextMenu}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary z-10">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your reward video...</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen"
          onContextMenu={handleContextMenu}
          style={{ pointerEvents: 'none' }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Custom progress bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <Progress value={progress} className="h-1.5 rounded-none bg-foreground/20" />
        </div>
      </div>

      {/* Progress info */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Watch the complete ad to claim your reward</span>
        <span className="font-bold text-lg text-primary">{Math.round(progress)}%</span>
      </div>

      {/* Completion steps */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {[25, 50, 75, 100].map((milestone) => (
          <div 
            key={milestone}
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
              progress >= milestone 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-border text-muted-foreground'
            }`}
          >
            {progress >= milestone ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <span className="text-xs font-medium">{milestone}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;
