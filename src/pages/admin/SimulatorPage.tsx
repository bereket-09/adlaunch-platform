import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

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

      // Initially shorten the link for display like a phone
      setShortenedLink(truncateLink(data.watch_url));
    } catch (err: any) {
      setError(err.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper to truncate link like phones do
  const truncateLink = (link: string) => {
    const maxLength = 30;
    return link.length > maxLength ? link.slice(0, maxLength) + "..." : link;
  };

  // Animate truncation after 2s for realism
  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => {
        setShortenedLink(truncateLink(response.watch_url));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [response]);

  return (
    <AdminLayout title="USSD SMS Simulator">
      <div className="space-y-8 flex flex-col items-center">
        {/* MSISDN Input */}
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Simulate SMS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono px-3 py-2 bg-gray-200 rounded-l-md text-gray-700">+251</span>
              <Input
                placeholder="9XXXXXXXX"
                value={msisdn}
                maxLength={9}
                onChange={(e) => setMsisdn(e.target.value.replace(/\D/, ""))}
                className="rounded-r-md"
              />
            </div>
            <Button
              onClick={simulateSMS}
              disabled={loading || msisdn.length !== 9}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
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

        {/* Smartphone Simulation */}
        {response && (
          <div className="relative w-[340px] h-[650px] rounded-3xl shadow-2xl overflow-hidden border border-gray-300 bg-gray-900">
            {/* Top Bar */}
            <div className="h-12 bg-gray-800 flex items-center justify-center text-white font-mono text-sm">
              + Simulated Phone
            </div>

            {/* Screen */}
            <div className="flex flex-col justify-end h-full p-5 bg-gray-100">
              {/* Message Bubble */}
              <div className="flex flex-col gap-2">
                <div className="bg-white p-4 rounded-2xl shadow-lg max-w-[80%] animate-slide-in-left relative">
                  <p className="text-sm text-gray-800 mb-2">
                    TO continue browsing and get free 50MB Data bundle, click the link below:
                  </p>
                  <a
                    href={response.watch_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline break-words"
                  >
                    {shortenedLink}
                  </a>
                  <span className="absolute top-2 right-3 text-xs text-gray-400">NEW</span>
                </div>
                <div className="self-end text-xs text-gray-500">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Bottom Home Button */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-800 rounded-full shadow-inner"></div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SimulatorPage;
