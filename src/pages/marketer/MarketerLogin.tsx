import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";

const MarketerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const payload = { email, password };

    const res = await fetch(API_ENDPOINTS.MARKETER.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.status) {
      toast({
        title: "Login failed",
        description: data.error || "Invalid credentials.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const marketerStatus = data.marketer?.status;

    // Handle statuses
    if (marketerStatus === "pendingPassChange") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("marketer_id", data.marketer.id);
      localStorage.setItem("userInfo", JSON.stringify(data.marketer));
      localStorage.setItem("status", marketerStatus);
      navigate("/marketer/update-password");
      setIsLoading(false);
      return;
    }

    if (marketerStatus === "active") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("marketer_id", data.marketer.id);
      localStorage.setItem("userInfo", JSON.stringify (data.marketer));
      localStorage.setItem("status", marketerStatus);
      toast({
        title: `Welcome ${data.marketer.name}!`,
        description: "Login successful.",
      });
      navigate("/marketer/dashboard");
      setIsLoading(false);
      return;
    }

    // Block inactive / deactivated users
    toast({
      title: "Login blocked",
      description: `Your account is ${marketerStatus}. Please contact the administrator.`,
      variant: "destructive",
    });
  } catch (err: any) {
    console.error("Login error:", err);
    toast({
      title: "Login failed",
      description: "Something went wrong. Try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   // Simulate login (replace with actual auth in production)
  //   setTimeout(() => {
  //     if (email && password) {
  //       toast({
  //         title: "Welcome back!",
  //         description: "Successfully logged in to your marketer dashboard.",
  //       });
  //       navigate("/marketer/dashboard");
  //     } else {
  //       toast({
  //         title: "Login failed",
  //         description: "Please check your credentials and try again.",
  //         variant: "destructive",
  //       });
  //     }
  //     setIsLoading(false);
  //   }, 1000);
  // };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <Logo size="lg" />
            <h1 className="mt-6 text-3xl font-bold text-foreground">
              Marketer Portal
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to manage your campaigns
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="marketer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-input" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Contact Sales
            </a>
          </p>

          <div className="pt-4 border-t border-border text-center">
            <Link
              to="/admin/login"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Admin Portal →
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-orange-600 items-center justify-center p-12">
        <div className="text-primary-foreground max-w-md space-y-6">
          <h2 className="text-4xl font-bold">Grow Your Brand with Video Ads</h2>
          <p className="text-lg opacity-90">
            Reach millions of engaged viewers with targeted video campaigns.
            Track performance, optimize spend, and maximize ROI.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold">100K+</p>
              <p className="text-sm opacity-80">Daily Views</p>
            </div>
            <div>
              <p className="text-3xl font-bold">100+</p>
              <p className="text-sm opacity-80">Marketers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">95%</p>
              <p className="text-sm opacity-80">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketerLogin;
