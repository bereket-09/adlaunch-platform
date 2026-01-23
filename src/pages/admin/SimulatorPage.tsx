import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { AlertTriangle, Send, Phone, MessageSquare, Wifi, Battery, MoreHorizontal } from "lucide-react";

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

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: LinkResponse = await res.json();
    setResponse(data);
    setShortenedLink(truncateLink(data.watch_url));
  } catch (err: any) {
    setError(err.message || "Simulation failed - please try again");
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && msisdn.length === 9 && !loading) {
      simulateSMS();
    }
  };

  return (
    <AdminLayout title="SMS Trigger - Handset Simulator">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">USSD SMS Simulator</h1>
            <p className="text-gray-600">Simulate SMS delivery to Ethiopian mobile numbers</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - MSISDN Input */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-semibold text-white">Simulate SMS</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User MSISDN (Ethiopian Number)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-mono px-4 py-3 bg-gray-100 rounded-l-lg text-gray-700 select-none border border-r-0 border-gray-300">
                        +251
                      </span>
                      <input
                        type="tel"
                        placeholder="9XXXXXXXX"
                        value={msisdn}
                        maxLength={9}
                        onChange={(e) => setMsisdn(e.target.value.replace(/\D/g, ""))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Enter 9-digit Ethiopian mobile number (without country code)</p>
                  </div>

                  <button
                    onClick={simulateSMS}
                    disabled={loading || msisdn.length !== 9}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                      loading || msisdn.length !== 9
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Simulate SMS
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="text-red-700 font-medium">{error}</span>
                    </div>
                  )}

                  {response && !error && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">SMS sent successfully!</span>
                      </div>
                      <p className="text-green-600 text-sm mt-1">Check the simulated phone preview</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  How it works
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Enter a valid Ethiopian mobile number</li>
                  <li>• Click "Simulate SMS" to generate a test message</li>
                  <li>• View the SMS in the simulated phone interface</li>
                  {/* <li>• Test your USSD flow without real SMS costs</li> */}
                </ul>
              </div>
            </div>

            {/* Right Column - Smartphone */}
            <div className="lg:w-2/3 flex justify-center">
              <div className="relative">
                {response ? (
                  <div className="relative w-100 h-[700px] bg-black rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-800">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-6 bg-black rounded-b-2xl z-10"></div>
                    
                    {/* Status Bar */}
                    <div className="absolute top-2 left-0 right-0 px-6 flex justify-between items-center z-20">
                      <Wifi className="h-4 w-4 text-white" />
                      <span className="text-white text-xs font-medium">12:30</span>
                      <Battery className="h-4 w-4 text-white" />
                    </div>

                    {/* Screen Content */}
                    <div className="pt-10 mt-15 pb-20 px-4 h-full flex flex-col">
                      <div className="flex-1 overflow-y-auto space-y-4">
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-lg max-w-xs animate-fade-in">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageSquare className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 mb-2 leading-relaxed">
                                To continue browsing and get free 50MB Data bundle, click the link below:
                              </p>
                              <a
                                href={response.watch_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-medium hover:underline block break-all text-sm"
                              >
                                {shortenedLink}
                              </a>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">Just now</span>
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                  NEW
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="flex justify-around items-center pt-4 border-t border-gray-700/50">
                        <div className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center">
                          <MoreHorizontal className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-80 h-[700px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                      <Phone className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Simulated Phone Preview</h3>
                      <p className="text-gray-500 px-8 text-center">
                        Enter a mobile number and click "Simulate SMS" to see how your message appears on a real device
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default SimulatorPage;
