import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";

interface LinkResponse {
  status: boolean;
  token: string;
  watch_url: string;
  state: string;
  createdStatus: string;
}

const SimulatorPage = () => {
  const [msisdn, setMsisdn] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<LinkResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shortenedLink, setShortenedLink] = useState("");

  const simulateSMS = async () => {
    if (!msisdn) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:3000/api/v1/link/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msisdn: `251${msisdn}` }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: LinkResponse = await res.json();
      setResponse(data);
      setShortenedLink(truncateLink(data.watch_url));
    } catch (err: any) {
      setError(err.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  const truncateLink = (link: string) => {
    const maxLength = 55;
    return link.length > maxLength ? link.slice(0, maxLength) + "..." : link;
  };

  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => {
        setShortenedLink(truncateLink(response.watch_url));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [response]);

  // Submit on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && msisdn.length === 9 && !loading) {
      simulateSMS();
    }
  };

  return (
    <AdminLayout title="USSD SMS Simulator">
      <div className="flex gap-6 h-full">
        {/* Left Column - MSISDN Input */}
        <div className="w-1/3">
          <Card className="sticky top-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Simulate SMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="text-sm font-medium text-gray-700">User MSISDN</label>
              <div className="flex items-center gap-2">
                <span className="font-mono px-3 py-2 bg-gray-200 rounded-l-md text-gray-700 select-none">
                  +251
                </span>
                <Input
                  placeholder="9XXXXXXXX"
                  value={msisdn}
                  maxLength={9}
                  onChange={(e) => setMsisdn(e.target.value.replace(/\D/, ""))}
                  className="rounded-r-md"
                  autoComplete="tel"
                  onKeyDown={handleKeyPress}
                />
              </div>
              <Button
                onClick={simulateSMS}
                disabled={loading || msisdn.length !== 9}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md"
              >
                {loading ? "Simulating..." : "Simulate SMS"}
              </Button>
              {error && (
                <div className="flex items-center gap-2 text-red-600 mt-2 font-semibold">
                  <AlertTriangle className="h-4 w-4" /> {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Smartphone */}
        <div className="w-2/3 flex justify-center">
          {response ? (
            <div className="relative w-[400px] h-[700px] rounded-3xl shadow-2xl overflow-hidden border border-gray-300 bg-gray-900 flex flex-col">
              {/* Top Bar */}
              <div className="h-12 bg-gray-800 flex items-center justify-center text-white font-mono text-sm">
                + Simulated Phone
              </div>

              {/* Screen - Messages at top */}
              <div className="flex-1 overflow-y-auto p-5 bg-gray-100 flex flex-col justify-start gap-4">
                <div className="bg-white p-4 rounded-3xl shadow-lg max-w-full animate-slide-in-left break-words relative">
                  <p className="text-sm text-gray-800 mb-2">
                    TO continue browsing and get free 50MB Data bundle, click the link below:
                  </p>
                  <a
                    href={response.watch_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline block break-all"
                  >
                    {shortenedLink}
                  </a>
                  <span className="absolute top-2 right-3 text-xs text-gray-400">NEW</span>
                </div>
                <div className="self-end text-xs text-gray-500">{new Date().toLocaleTimeString()}</div>
              </div>

              {/* Bottom Home Button */}
              <div className="h-20 flex justify-center items-end pb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full shadow-inner"></div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 italic mt-20">Simulated phone preview will appear here</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SimulatorPage;
