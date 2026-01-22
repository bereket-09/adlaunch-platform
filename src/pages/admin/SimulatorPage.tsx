import { useState } from "react";
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

  const simulateSMS = async () => {
    if (!msisdn) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/v1/link/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msisdn }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: LinkResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="USSD SMS Simulator">
      <div className="space-y-6">
        {/* Input Card */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Simulate SMS for MSISDN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter MSISDN"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
            />
            <Button onClick={simulateSMS} disabled={loading || !msisdn}>
              {loading ? "Simulating..." : "Simulate"}
            </Button>
            {error && (
              <div className="flex items-center gap-2 text-red-600 mt-2">
                <AlertTriangle className="h-4 w-4" /> {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smartphone Simulation */}
        {response && (
          <div className="flex justify-center">
            <div className="relative w-[320px] h-[600px] border-4 border-gray-300 rounded-3xl shadow-lg overflow-hidden bg-black">
              {/* Top Frame */}
              <div className="h-12 bg-gray-800 flex items-center justify-center text-white font-mono text-sm">
                + Simulated Phone +
              </div>

              {/* Message App */}
              <div className="flex flex-col justify-end h-full p-4 bg-gray-100">
                <div className="bg-white p-3 rounded-xl shadow mb-2 animate-slide-in-left max-w-[80%]">
                  <p className="text-sm">
                    TO continue browsing and get free 50MB Data bundle, click the link below:
                  </p>
                  <a
                    href={response.watch_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline break-words"
                  >
                    {response.watch_url}
                  </a>
                </div>

                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SimulatorPage;
