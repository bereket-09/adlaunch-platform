import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/AdminLayout";

const normalizeEthiopianMsisdn = (value: string): string | null => {
  const v = value.trim();

  // 09XXXXXXXX → 2519XXXXXXXX
  if (/^09\d{8}$/.test(v)) {
    return `251${v.slice(1)}`;
  }

  // 2519XXXXXXXX
  if (/^2519\d{8}$/.test(v)) {
    return v;
  }

  return null;
};

const AdminMsisdnSearch = () => {
  const navigate = useNavigate();
  const [msisdn, setMsisdn] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    const normalized = normalizeEthiopianMsisdn(msisdn);

    if (!normalized) {
      setError("Enter a valid Ethiopian MSISDN");
      return;
    }

    setError("");
    navigate(`/admin/msisdn/${normalized}`);
  };

  return (
    <AdminLayout title="MSISDN Lookup">
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Input
                value={msisdn}
                onChange={(e) => setMsisdn(e.target.value)}
                placeholder="Enter customer MSISDN (0912345678)"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>

            <Badge variant="secondary" className="hidden sm:inline">
              Admin Lookup
            </Badge>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminMsisdnSearch;
