import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Gift,
  Play,
  RefreshCw,
  Wifi,
  Globe,
  Loader2,
  AlertCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import API_CONFIG from "@/config/api";

type ViewState =
  | "loading"
  | "ready"
  | "playing"
  | "completed"
  | "rewarded"
  | "error";

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android/i.test(ua);
  return {
    model: isMobile ? "Smartphone" : "Desktop",
    brand: /iPhone|iPad/i.test(ua)
      ? "Apple"
      : /Android/i.test(ua)
        ? "Android"
        : "Unknown",
    userAgent: ua,
  };
};

const encodeMetaToBase64 = (meta: Record<string, any>) =>
  btoa(JSON.stringify(meta));

interface AdDetails {
  sponsor: string; f
  duration: string;
  reward: string;
  rewardType: "data" | "airtime";
}

interface VideoResponse {
  ad_id: string;
}

const SubscriberPortal = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("v") || ""; // <- read query param "v"

  const [viewState, setViewState] = useState<ViewState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [currentSecureKey, setCurrentSecureKey] = useState<string>("");
  const [metaBase64, setMetaBase64] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isCssFs, setIsCssFs] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastTimeRef = useRef(0);

  const adDetails: AdDetails = {
    sponsor: "ETHIO TELECOM",
    duration: "30 seconds",
    reward: "50MB Data Bundle",
    rewardType: "data",
  };

  // Prepare meta
  useEffect(() => {
    const deviceInfo = getDeviceInfo();
    const meta = {
      msisdn: "251912345678",
      ip: "127.0.0.1",
      userAgent: deviceInfo.userAgent,
      deviceInfo: { model: deviceInfo.model, brand: deviceInfo.brand },
      location: { lat: 8.0, lon: 34.0, category: "Ethiopia" },
    };
    setMetaBase64(encodeMetaToBase64(meta));
  }, []);

  // Fetch video based on token -> get ad_id -> get video blob
  // useEffect(() => {
  //   if (!token || !metaBase64) return;

  //   const fetchVideo = async () => {
  //     setViewState("loading");
  //     try {
  //       const res = await fetch(`${API_CONFIG.API_BASE}/video/${token}`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           meta_base64: metaBase64,
  //         },
  //       });

  //       const data = await res.json();

  //       // Check for API-level error
  //       if (data.status === false) {
  //         throw new Error(data.error || "Video cannot be loaded");
  //       }

  //       if (!data.ad_id) throw new Error("Failed to get ad_id");

  //       setCurrentSecureKey(data?.secure_key); // reset secure key

  //       // Fetch video blob
  //       const blobRes = await fetch(
  //         `${API_CONFIG.API_BASE}/ad/video/${data.ad_id}`
  //       );
  //       if (!blobRes.ok) throw new Error("Failed to fetch video blob");

  //       const blob = await blobRes.blob();
  //       const blobUrl = URL.createObjectURL(blob);

  //       setVideoUrl(blobUrl);
  //       setViewState("ready");
  //     } catch (err: any) {
  //       console.error(err);
  //       setError(err.message || "Unable to load video");
  //       setViewState("error");
  //     }
  //   };

  //   fetchVideo();
  // }, [token, metaBase64]);

  useEffect(() => {
    if (!token || !metaBase64) return;

    const fetchVideo = async () => {
      setViewState("loading");
      try {
        const res = await fetch(`${API_CONFIG.API_BASE}/video/${token}`, {
          headers: {
            "Content-Type": "application/json",
            meta_base64: metaBase64,
          },
        });

        const data = await res.json();
        if (data.status === false) throw new Error(data.error || "Video cannot be loaded");
        if (!data.ad_id) throw new Error("Failed to get ad_id");

        setCurrentSecureKey(data?.secure_key);

        // Fetch video blob
        const blobRes = await fetch(`${API_CONFIG.API_BASE}/ad/video/${data.ad_id}`);
        if (!blobRes.ok) throw new Error("Failed to fetch video blob");

        const blob = await blobRes.blob();
        const blobUrl = URL.createObjectURL(blob);

        setVideoUrl(blobUrl);

        // --- AUTO START ---
        setViewState("playing");      // directly go to playing state
        handleStartVideo();           // trigger start API call

        // Force play and auto-unmute after a short delay
        // Force play and handle unmute correctly
        const playVideoSafely = async () => {
          if (!videoRef.current) return;

          const video = videoRef.current;

          // Start muted first
          video.muted = true;
          try {
            await video.play();
          } catch {
            console.warn("Autoplay blocked, user interaction needed");
          }

          // Auto unmute after a short delay
          setTimeout(async () => {
            video.muted = false;
            video.volume = 1;
            try {
              // Re-trigger play to prevent pause on unmute
              await video.play();
            } catch {
              console.warn("Play after unmute blocked");
            }
          }, 500); // 0.5s is usually enough
        };

        playVideoSafely();


      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unable to load video");
        setViewState("error");
      }
    };

    fetchVideo();
  }, [token, metaBase64]);




  const handleStartVideo = async () => {
    if (!currentSecureKey) return;
    setViewState("playing");
    try {
      const res = await fetch(`${API_CONFIG.API_BASE}/track/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secure_key: currentSecureKey,
          meta: metaBase64,
          token,
        }),
      });
      const data = await res.json();
      if (data.status) setCurrentSecureKey(data.secure_key);
    } catch (err) {
      console.error("Start video failed", err);
    }
  };

  const handleVideoComplete = async () => {
    setViewState("completed");
    try {
      const res = await fetch(`${API_CONFIG.API_BASE}/track/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secure_key: currentSecureKey,
          meta: metaBase64,
          token,
        }),
      });
      const data = await res.json();
      setRewardData(data);
      setViewState("rewarded");
    } catch (err) {
      console.error("Complete video failed", err);
      setViewState("rewarded");
    }
  };


  //   useEffect(() => {
  //   const handleFsChange = () => {
  //     const video = videoRef.current;
  //     if (!video) return;
  //     // If the current fullscreen element is our video, CSS fullscreen mode is active
  //     setIsCssFs(document.fullscreenElement === video);
  //   };

  //   document.addEventListener("fullscreenchange", handleFsChange);

  //   return () => {
  //     document.removeEventListener("fullscreenchange", handleFsChange);
  //   };
  // }, []);


  // Video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video || viewState !== "playing") return;

    const onLoaded = () => {
      setIsVideoLoading(false);
      video.play().catch(() => { });
    };
    const onTimeUpdate = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
      lastTimeRef.current = video.currentTime;
    };
    const onSeeking = () => {
      if (Math.abs(video.currentTime - lastTimeRef.current) > 0.5)
        video.currentTime = Math.max(0, lastTimeRef.current - 0.1);
    };
    const onEnded = () => {
      setProgress(100);
      handleVideoComplete();
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("seeking", onSeeking);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("seeking", onSeeking);
      video.removeEventListener("ended", onEnded);
    };
  }, [viewState, currentSecureKey]);

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

  // const toggleFullscreen = useCallback(() => {
  //   const root = rootRef.current;
  //   if (!root) return;
  //   if (document.fullscreenElement) document.exitFullscreen();
  //   else if (isCssFs) {
  //     root.classList.remove("app-fullscreen");
  //     setIsCssFs(false);
  //   } else {
  //     const req =
  //       root.requestFullscreen || (root as any).webkitRequestFullscreen;
  //     if (req)
  //       req.call(root).catch(() => {
  //         root.classList.add("app-fullscreen");
  //         setIsCssFs(true);
  //       });
  //     else {
  //       root.classList.add("app-fullscreen");
  //       setIsCssFs(true);
  //     }
  //   }
  // }, [isCssFs]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement === video) {
      document.exitFullscreen().catch(() => { });
      setIsCssFs(false);
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => { });
        setIsCssFs(true);
      }
    }
  }, []);

  // Sync CSS state when user presses Esc or browser toggles fullscreen
  useEffect(() => {
    const handleFsChange = () => {
      const video = videoRef.current;
      if (!video) return;
      setIsCssFs(document.fullscreenElement === video);
    };

    document.addEventListener("fullscreenchange", handleFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);



  const handleUserUnmute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => console.warn("Play after unmute blocked"));
    }
  };



  const handleWatchAnother = () => {
    setViewState("ready");
    setProgress(0);
    if (videoRef.current) videoRef.current.currentTime = 0;
  };
  
  const handleBrowseNow = () => {
  window.close();

  // Fallback for browsers that block closing user-opened tabs
  setTimeout(() => {
    if (!window.closed) {
      window.location.href = "about:blank";
    }
  }, 100);
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
          {viewState === "loading" && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Loading Your Reward
              </h1>
              <p className="text-muted-foreground">
                Preparing your advertisement...
              </p>
            </div>
          )}

          {/* Error State */}
          {/* Error State */}
          {viewState === "error" && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in px-4">
              <div className="relative w-28 h-28 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-400 to-red-600 animate-pulse opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertCircle className="h-14 w-14 text-red-700" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-red-700 mb-3">
                Oops! Something Went Wrong
              </h1>

              <p className="text-center text-lg text-red-500/80 mb-6 max-w-md">
                {error ||
                  "We couldn't load your advertisement. Please try again or check your connection."}
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg"
                onClick={() => window.location.reload()}
              >
                Retry Now
              </Button>

              <p className="mt-4 text-sm text-red-400/70">
                If the problem persists, contact support.
              </p>
            </div>
          )}

          {/* Ready to Play State */}
          {/* Ready to Play State */}
          {viewState === "ready" && (
            <div className="flex flex-col items-center animate-slide-up px-4">
              {/* Hero Reward */}
              <div className="mb-10 flex flex-col items-center">
                <div className="relative w-28 h-28 mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-600 animate-pulse opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gift className="h-14 w-14 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 drop-shadow-md">
                  Earn Free{" "}
                  {adDetails.rewardType === "data" ? "Data" : "Airtime"}!
                </h1>
                <p className="text-lg text-muted-foreground max-w-md text-center">
                  Watch a short video ad and get{" "}
                  <span className="font-bold text-primary">
                    {adDetails.reward}
                  </span>{" "}
                  instantly credited to your account.
                </p>
              </div>

              {/* Reward Card */}
              <div className="bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20 mb-8 max-w-md mx-auto transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-orange-200 shadow-inner">
                    <Wifi className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Your Reward</p>
                    <p className="text-2xl font-bold text-foreground drop-shadow-sm">
                      {adDetails.reward}

                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {adDetails.duration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Watch Button */}
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-primary text-white font-bold text-lg px-12 py-6 rounded-2xl shadow-xl flex items-center gap-3 transform hover:scale-105 transition-all duration-200"
                onClick={handleStartVideo}
              >
                <Play className="h-6 w-6" />
                Watch Ad & Earn
              </Button>

              <p className="mt-4 text-sm text-muted-foreground text-center max-w-xs">
                By watching, you agree to our terms of service
              </p>
            </div>
          )}

          {/* Playing State */}
          {viewState === "playing" && (
            <div
              ref={rootRef}
              className={`animate-fade-in ${isCssFs
                  ? "fixed inset-0 z-[9999] bg-black flex items-center justify-center"
                  : ""
                }`}
            >
              <div className={`w-full max-w-3xl ${isCssFs ? "mx-auto" : ""}`}>
      
                {/* Video container */}
                {/* <div
                  className={`relative rounded-2xl overflow-hidden bg-black shadow-lg ${
                    isCssFs ? "h-[92vh]" : "aspect-video"
                  }`}
                  onContextMenu={handleContextMenu}
                > */}
                <div
                  className={`relative rounded-2xl overflow-hidden bg-black shadow-lg ${isCssFs ? "w-full h-full" : "w-full max-w-3xl"
                    }`}
                  style={{
                    aspectRatio: !isCssFs && videoRef.current?.videoWidth
                      ? `${videoRef.current.videoWidth} / ${videoRef.current.videoHeight}`
                      : undefined,
                  }}
                  onContextMenu={handleContextMenu}
                >

                  {isVideoLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-3" />
                        <div className="text-sm text-white/80">
                          Loading your ad…
                        </div>
                      </div>
                    </div>
                  )}


                  <video
                    ref={videoRef}
                    src={videoUrl}
                    playsInline
                    autoPlay
                    muted
                    className={`w-full h-full object-contain ${isCssFs ? "pointer-events-none" : ""}`}
                    disablePictureInPicture
                    controls={false}
                    controlsList="nodownload noplaybackrate"
                    onContextMenu={handleContextMenu}
                    onClick={handleUserUnmute} // <-- user interaction triggers unmute
                  />


                  {/* <video
                    ref={videoRef}
                    src={videoUrl}
                    playsInline
                    autoPlay
                    className="w-full h-full object-cover"
                    disablePictureInPicture
                    controls={false}
                    controlsList="nodownload noplaybackrate"
                    onContextMenu={handleContextMenu}
                  /> */}

                  <div className="absolute top-3 right-3 z-[9999]">
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-white"
                      onClick={toggleFullscreen}
                    >
                      {document.fullscreenElement || isCssFs ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <Progress
                      value={Math.min(100, Math.round(progress))}
                      className="h-1.5"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-orange-50 rounded-full">
                      Ad in progress
                    </div>
                    <div>{Math.round(progress)}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[25, 50, 75, 100].map((m) => (
                      <div
                        key={m}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${progress >= m
                            ? "bg-primary text-white"
                            : "bg-secondary text-muted-foreground"
                          }`}
                      >
                        {progress >= m ? "✓" : m}
                      </div>
                    ))}
                  </div>
                </div>
                          {/* Reward header */}
                <div className={`${isCssFs ? "hidden" : ""}`}>
                  <div className="mb-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-orange-50 border border-primary/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="text-sm font-semibold">
                          {adDetails.reward}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Sponsored by</div>
                      <div className="font-semibold text-foreground">
                        {adDetails.sponsor}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completed State */}
          {viewState === "completed" && (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Processing Your Reward
              </h1>
              <p className="text-muted-foreground">
                Crediting {adDetails.reward} to your account...
              </p>
            </div>
          )}

          {/* Rewarded State */}
          {viewState === "rewarded" && (
            <div className="text-center animate-scale-in px-4">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-green-100 mb-6 shadow-lg">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground mb-3">
                Congratulations! 🎉
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-6">
                <span className="font-bold text-green-700">
                  {adDetails.reward}
                </span>{" "}
                has been successfully credited to your account!
              </p>

              {rewardData?.reward_record_id && (
                <p className="text-sm text-green-600 mb-6">
                  Reward ID: {rewardData.reward_record_id}
                </p>
              )}

              <div className="bg-green-50 border border-green-200 rounded-3xl p-6 mb-8 max-w-md mx-auto shadow-inner">
                <div className="flex items-center justify-center gap-4">
                  <div className="p-4 rounded-full bg-green-100">
                    <Wifi className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-green-600">Reward Credited</p>
                    <p className="text-2xl font-bold text-green-700">
                      {adDetails.reward}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="btn-primary-gradient gap-2"
                  onClick={handleBrowseNow}
                >
                  <Globe className="h-5 w-5" />
                  Browse Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>© 2026 AdRewards Platform.</p>
      </footer>

      <style>{`
       .app-fullscreen {
  position: fixed !important;
  inset: 0 !important;
  z-index: 99999 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
}

.app-fullscreen video {
  width: 100%;
  height: 100%;
  object-fit: contain; /* ensures video fills screen without cropping */
}

      `}</style>
    </div>
  );
};

export default SubscriberPortal;
