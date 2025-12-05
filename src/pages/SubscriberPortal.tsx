import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Gift, Play, ArrowRight, RefreshCw, Wifi, Smartphone, Globe } from "lucide-react";
import Logo from "@/components/Logo";
import EnhancedVideoPlayer from "@/components/EnhancedVideoPlayer";
import { Button } from "@/components/ui/button";

type ViewState = 'loading' | 'ready' | 'playing' | 'completed' | 'rewarded';

const SubscriberPortal = () => {
  const [searchParams] = useSearchParams();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [showReward, setShowReward] = useState(false);
  
  const videoId = searchParams.get('v') || 'demo';
  const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const adDetails = {
    sponsor: "ETHIO TELECOM",
    duration: "30 seconds",
    reward: "50MB Data Bundle",
    rewardType: 'data' as const,
  };

  useEffect(() => {
    // Simulate checking video availability
    const timer = setTimeout(() => {
      setViewState('ready');
    }, 1500);
    return () => clearTimeout(timer);
  }, [videoId]);

  const handleStartVideo = () => {
    setViewState('playing');
  };

  const handleVideoComplete = () => {
    setViewState('completed');
    // Simulate reward API call
    setTimeout(() => {
      setShowReward(true);
      setViewState('rewarded');
    }, 2000);
  };

  const handleWatchAnother = () => {
    setViewState('ready');
    setShowReward(false);
  };

  const handleBrowseNow = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>Zero-Rated Access</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl">
          {/* Loading State */}
          {viewState === 'loading' && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Loading Your Reward</h1>
              <p className="text-muted-foreground">Preparing your advertisement...</p>
            </div>
          )}

          {/* Ready to Play State */}
          {viewState === 'ready' && (
            <div className="text-center animate-slide-up">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-600 mb-6 shadow-orange">
                  <Gift className="h-12 w-12 text-primary-foreground" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  Earn Free {adDetails.rewardType === 'data' ? 'Data' : 'Airtime'}!
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Watch a short video ad and get <span className="font-bold text-primary">{adDetails.reward}</span> instantly credited to your account.
                </p>
              </div>

              {/* Reward Preview */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 mb-8 max-w-md mx-auto">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <Wifi className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Your Reward</p>
                    <p className="text-2xl font-bold text-foreground">{adDetails.reward}</p>
                    <p className="text-sm text-muted-foreground">Duration: {adDetails.duration}</p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="btn-primary-gradient text-lg px-10 py-6 rounded-xl gap-3"
                onClick={handleStartVideo}
              >
                <Play className="h-6 w-6" />
                Watch Ad & Earn
              </Button>

              <p className="mt-4 text-sm text-muted-foreground">
                By watching, you agree to our terms of service
              </p>
            </div>
          )}

          {/* Playing State */}
          {viewState === 'playing' && (
            <div className="animate-fade-in">
              <EnhancedVideoPlayer
                videoUrl={demoVideoUrl}
                onComplete={handleVideoComplete}
                adDetails={adDetails}
              />
            </div>
          )}

          {/* Completed/Processing State */}
          {viewState === 'completed' && !showReward && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Processing Your Reward</h1>
              <p className="text-muted-foreground">Crediting {adDetails.reward} to your account...</p>
            </div>
          )}

          {/* Rewarded State */}
          {viewState === 'rewarded' && showReward && (
            <div className="text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-14 w-14 text-green-600" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Congratulations! 🎉
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                <span className="font-bold text-primary">{adDetails.reward}</span> has been credited to your account!
              </p>

              {/* Reward Summary */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <Wifi className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-green-600">Reward Credited</p>
                    <p className="text-2xl font-bold text-green-700">{adDetails.reward}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="btn-primary-gradient gap-2"
                  onClick={handleBrowseNow}
                >
                  <Globe className="h-5 w-5" />
                  Browse Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="gap-2"
                  onClick={handleWatchAnother}
                >
                  <RefreshCw className="h-5 w-5" />
                  Watch Another Ad
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>© 2024 AdRewards Platform. Powered by Zero-Rated Technology.</p>
      </footer>
    </div>
  );
};

export default SubscriberPortal;
