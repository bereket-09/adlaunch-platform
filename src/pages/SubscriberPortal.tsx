import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Gift, Play, ArrowRight, RefreshCw, Wifi, Globe, Loader2, AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { videoAPI, VideoResponse, TrackStartResponse, TrackCompleteResponse } from "@/services/api";

type ViewState = 'loading' | 'ready' | 'playing' | 'completed' | 'rewarded' | 'error';

// Demo video URL - will be replaced by backend video_url
const DEMO_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

// Helper to encode meta to base64
const encodeMetaToBase64 = (meta: Record<string, any>): string => {
  return btoa(JSON.stringify(meta));
};

// Get device info
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);
  return {
    model: isMobile ? 'Smartphone' : 'Desktop',
    brand: /iPhone|iPad/i.test(ua) ? 'Apple' : /Android/i.test(ua) ? 'Android' : 'Unknown',
    userAgent: ua,
  };
};

const SubscriberPortal = () => {
  const [searchParams] = useSearchParams();
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [error, setError] = useState<string | null>(null);
  
  // Video data from API
  const [videoData, setVideoData] = useState<VideoResponse | null>(null);
  const [currentSecureKey, setCurrentSecureKey] = useState<string>('');
  const [metaBase64, setMetaBase64] = useState<string>('');
  
  // Video player state
  const [progress, setProgress] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isCssFs, setIsCssFs] = useState(false);
  
  // Reward state
  const [rewardData, setRewardData] = useState<TrackCompleteResponse | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastTimeRef = useRef(0);
  
  const token = searchParams.get('v') || '';

  // Prepare meta data
  useEffect(() => {
    const deviceInfo = getDeviceInfo();
    const meta = {
      msisdn: "251912345678", // This would come from MNO integration
      ip: "127.0.0.1", // This would be detected server-side
      userAgent: deviceInfo.userAgent,
      deviceInfo: {
        model: deviceInfo.model,
        brand: deviceInfo.brand,
      },
      location: {
        lat: 8.0,
        lon: 34.0,
        category: "Ethiopia",
      },
    };
    setMetaBase64(encodeMetaToBase64(meta));
  }, []);

  // Fetch video data on mount
  useEffect(() => {
    const fetchVideo = async () => {
      if (!token) {
        // Demo mode - use demo video
        setVideoData({
          status: true,
          ad_id: 'demo',
          video_url: DEMO_VIDEO_URL,
          token: 'demo',
          secure_key: 'demo-key',
        });
        setCurrentSecureKey('demo-key');
        setViewState('ready');
        return;
      }

      try {
        const response = await videoAPI.getVideo(token, metaBase64);
        if (response.status) {
          setVideoData(response);
          setCurrentSecureKey(response.secure_key);
          setViewState('ready');
        } else {
          throw new Error('Failed to load video');
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        // Fallback to demo mode
        setVideoData({
          status: true,
          ad_id: 'demo',
          video_url: DEMO_VIDEO_URL,
          token: token || 'demo',
          secure_key: 'demo-key',
        });
        setCurrentSecureKey('demo-key');
        setViewState('ready');
      }
    };

    if (metaBase64) {
      fetchVideo();
    }
  }, [token, metaBase64]);

  const adDetails = {
    sponsor: "ETHIO TELECOM",
    duration: "30 seconds",
    reward: "50MB Data Bundle",
    rewardType: 'data' as const,
  };

  // Handle video start - call track/start API
  const handleStartVideo = async () => {
    setViewState('playing');
    
    if (token && token !== 'demo') {
      try {
        const response = await videoAPI.trackStart(token, metaBase64, currentSecureKey);
        if (response.status) {
          // Update secure_key with the new one from response
          setCurrentSecureKey(response.secure_key);
        }
      } catch (err) {
        console.error('Error tracking video start:', err);
      }
    }
  };

  // Handle video complete - call track/complete API
  const handleVideoComplete = async () => {
    setViewState('completed');
    
    if (token && token !== 'demo') {
      try {
        const response = await videoAPI.trackComplete(token, metaBase64, currentSecureKey);
        if (response.status) {
          setRewardData(response);
          setViewState('rewarded');
        } else {
          throw new Error('Reward failed');
        }
      } catch (err) {
        console.error('Error completing video:', err);
        // Show reward anyway for demo
        setViewState('rewarded');
      }
    } else {
      // Demo mode - simulate reward
      setTimeout(() => {
        setViewState('rewarded');
      }, 2000);
    }
  };

  const handleWatchAnother = () => {
    setViewState('ready');
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleBrowseNow = () => {
    window.location.href = 'https://www.google.com';
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video || viewState !== 'playing') return;

    const onLoaded = () => {
      setIsVideoLoading(false);
      video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      setProgress(pct);
      lastTimeRef.current = video.currentTime;
    };

    const onSeeking = () => {
      // Prevent seeking
      if (Math.abs((video.currentTime || 0) - (lastTimeRef.current || 0)) > 0.5) {
        video.currentTime = Math.max(0, lastTimeRef.current - 0.1);
      }
    };

    const onEnded = () => {
      setProgress(100);
      handleVideoComplete();
    };

    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('seeking', onSeeking);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('seeking', onSeeking);
      video.removeEventListener('ended', onEnded);
    };
  }, [viewState, currentSecureKey]);

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

  // Fullscreen handlers
  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (isCssFs) {
      root.classList.remove('app-fullscreen');
      setIsCssFs(false);
    } else {
      const request = root.requestFullscreen || (root as any).webkitRequestFullscreen;
      if (request) {
        request.call(root).catch(() => {
          root.classList.add('app-fullscreen');
          setIsCssFs(true);
        });
      } else {
        root.classList.add('app-fullscreen');
        setIsCssFs(true);
      }
    }
  }, [isCssFs]);

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

          {/* Error State */}
          {viewState === 'error' && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Something Went Wrong</h1>
              <p className="text-muted-foreground mb-6">{error || 'Unable to load the advertisement.'}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
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
            <div ref={rootRef} className={`animate-fade-in ${isCssFs ? 'fixed inset-0 z-[9999] bg-black flex items-center justify-center' : ''}`}>
              <div className={`w-full max-w-3xl ${isCssFs ? 'mx-auto' : ''}`}>
                {/* Reward header */}
                <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-orange-50 border border-primary/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Reward</p>
                      <p className="text-sm font-semibold">{adDetails.reward}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Sponsored by</div>
                    <div className="font-semibold text-foreground">{adDetails.sponsor}</div>
                  </div>
                </div>

                {/* Video container */}
                <div className={`relative rounded-2xl overflow-hidden bg-black shadow-lg ${isCssFs ? 'h-[92vh]' : 'aspect-video'}`} onContextMenu={handleContextMenu}>
                  {/* Loading overlay */}
                  {isVideoLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-3" />
                        <div className="text-sm text-white/80">Loading your ad…</div>
                      </div>
                    </div>
                  )}

                  {/* Video element */}
                  <video
                    ref={videoRef}
                    src={videoData?.video_url || DEMO_VIDEO_URL}
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                    disablePictureInPicture
                    controls={false}
                    controlsList="nodownload noplaybackrate"
                    onContextMenu={handleContextMenu}
                  />

                  {/* Fullscreen button */}
                  <div className="absolute top-3 right-3 z-30">
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-white"
                      onClick={toggleFullscreen}
                    >
                      {document.fullscreenElement || isCssFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <Progress value={Math.min(100, Math.round(progress))} className="h-1.5" />
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-orange-50 rounded-full">Ad in progress</div>
                    <div>{Math.round(progress)}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[25, 50, 75, 100].map((m) => (
                      <div key={m} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${progress >= m ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                        {progress >= m ? '✓' : m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completed/Processing State */}
          {viewState === 'completed' && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Processing Your Reward</h1>
              <p className="text-muted-foreground">Crediting {adDetails.reward} to your account...</p>
            </div>
          )}

          {/* Rewarded State */}
          {viewState === 'rewarded' && (
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

              {rewardData && (
                <div className="text-xs text-muted-foreground mb-4">
                  Reward ID: {rewardData.reward_record_id}
                </div>
              )}

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

      {/* CSS Fullscreen styles */}
      <style>{`
        .app-fullscreen { position: fixed !important; inset: 0 !important; z-index: 99999 !important; display: flex; align-items: center; justify-content: center; background: black; }
      `}</style>
    </div>
  );
};

export default SubscriberPortal;
